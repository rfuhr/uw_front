<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFormatDate} from '@/composables/useFormatDate';
import { CotacaoMercadoriaService } from '@/service'

const router = useRouter()
const { formatToDDMMYYYY } = useFormatDate();

const registros = ref([]);
const totalRegistros = ref(0);
const loading = ref(false);

const openEdit = (cotacaoMercadoriaId, cotacaoMercadoriaParceiroId) => {
   router.push({ name: 'compra-cotacao-retorno-cotacao-lancar', params: {
        cotacaomercadoriaid: cotacaoMercadoriaId,
        cotacaomercadoriaparceiroid: cotacaoMercadoriaParceiroId 
    }})
}

const getNomeParceiro = (dado) => {
    return dado.parceiroNomeRazaoSocial + ' - ' + dado.parceiroLocalNome
}

onMounted(() => {

    CotacaoMercadoriaService.buscarCotacoesParaRetorno().then(data => {
        registros.value = data;
    });

})
</script>

<template>
    <UWPageBase title="Retorno de Cotações" subtitle="Listagem das cotações aguardando retorno do parceiro">
        <DataTable
            ref="tableCrud"
            size="small"
            :value="registros"
            dataKey="cotacaoMercadoriaParceiroId"
            :paginator="true"
            :rows="10"
            :totalRecords="totalRegistros"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            :loading="loading"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} registros"
            responsiveLayout="scroll"
        >
            <template #empty> Nenhuma cotação aguardando retorno. </template>
            <Column field="cotacaoMercadoriaNumero" header="Nº" showFilterMatchModes="true" showFilterOperator="true" sortable="true">
                <template #filter="{ filterModel, filterCallback }">
                    <InputNumber v-model="filterModel.value" mode="decimal" minFractionDigits="0" maxFractionDigits="5" locale="pt-Br" @keydown.enter="filterCallback()" class="p-column-filter" />
                </template>
            </Column>
            <Column field="cotacaoMercadoriaData" header="Data">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ formatToDDMMYYYY(slotProps.data.cotacaoMercadoriaData) }}</div>
                </template>
            </Column>
            <Column field="departamentoSigla" header="Departamento Solicitado"/>
            <Column field="parceiroNomeRazaoSocial" header="Parceiro">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ getNomeParceiro(slotProps.data) }}</div>
                </template>
            </Column>
            <Column field="situacaoCotacaoMercadoriaName" header="Situação"/>
            <Column header="Ações" style="width: 10%">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.cotacaoMercadoriaId, slotProps.data.cotacaoMercadoriaParceiroId)" />
                </template>
            </Column>
        </DataTable>
    </UWPageBase> 
</template>