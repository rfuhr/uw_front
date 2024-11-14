<script setup>
import { ref, computed, onMounted } from 'vue';
import * as yup from 'yup';
import { useRoute, useRouter } from 'vue-router';
import { CotacaoMercadoriaService } from '@/service'

const createSchema = () => {
    return yup.object().shape({});
};

const formData = ref({});
const route = useRoute();
const router = useRouter();

const handleCancelar = () => {
    router.push({ path: '/compra/cotacao/retorno-cotacao' });
};

const nomeParceiro = computed(() => {
    return formData.value.parceiros && formData.value.parceiros[0].parceiroLocal.nomeRazaoSocial + " - " + formData.value.parceiros[0].parceiroLocal.nomeLocal;
})

const situacao = computed(() => {
    return formData.value.parceiros && formData.value.parceiros[0].situacaoNome;
})

const itensDaCotacao = computed(() => {
    return formData.value.parceiros && formData.value.parceiros[0].itens;
})

const getNomeItem = (data) => {
    return data.itemSimplificadoNome ? data.itemSimplificadoNome : data.itemNome;
};

onMounted(() => {
    const cotacaoMercadoriaId = route.params.cotacaomercadoriaid || 0;
    const cotacaoMercadoriaParceiroId = route.params.cotacaomercadoriaparceiroid || 0;

    CotacaoMercadoriaService.getCotacaoParaRetorno(cotacaoMercadoriaId, cotacaoMercadoriaParceiroId).then((data) => {
        formData.value = data;
    })
    .catch(() => {
        formData.value = {}
    })

})

</script>

<template>
    <UWPageBase title="Retorno de Cotação" subtitle="Informe aqui as informações retornadas pelo parceiro para a cotação">
        <UWForm :schema="createSchema()" :values="formData" ref="formRetornoCotacao" :visibleSave="false" @doSubmit="salvarRegistro" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="grid nested-grid">
                            <UWFieldSet title="Identificação da Cotação" class="col-12 h-full flex flex-column justify-content-start border-solid"> 
                                <div class="p-fluid formgrid grid">
                                    <UWInteger id="numero" label="Número" disabled v-model="formData.numero" classContainer="col-12 md:col-1" />
                                    <UWCalendar id="dataCotacao" label="Data da Cotação" dateFormat="dd/mm/yy" disabled v-model="formData.dataCotacao" classContainer="col-12 md:col-2" />
                                    <UWInput id="departamentoCotacao" label="Departamento da Cotação" disabled v-model="formData.departamentoCotacaoNome" classContainer="col-12 md:col-3" />
                                    <UWInput id="parceiro" label="Parceiro" disabled v-model="nomeParceiro" classContainer="col-12 md:col-4" />
                                    <UWInput id="situacao" label="Situação" disabled v-model="situacao" classContainer="col-12 md:col-2" />
                                </div>
                            </UWFieldSet>
                            <UWFieldSet title="Itens da Cotação" class="col-12 h-full flex flex-column justify-content-start border-solid mt-2">
                                <div class="p-fluid formgrid grid">
                                    <DataTable ref="dtItens" size="small" :value="itensDaCotacao" showGridlines stripedRows responsiveLayout="scroll" class="col-12">
                                        <template #empty> Nenhum item informado. </template>
                                        <Column header="Item">
                                            <template #body="slotProps">
                                                <div class="w-full text-left">{{ getNomeItem(slotProps.data) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="solicitacaoMercadoriaItemQuantidadeSolicitada" header="Quantidade Solicitada" />
                                        <Column field="solicitacaoMercadoriaItemQuantidadeSolicitada" header="Quantidade Cotada" />
                                        <Column field="solicitacaoMercadoriaItemQuantidadeSolicitada" header="Valor Unitário" />
                                    </DataTable>
                                </div>
                            </UWFieldSet>
                            <UWFieldSet title="Informações Complementares" class="col-12 h-full flex flex-column justify-content-start border-solid mt-2">
                                <div class="p-fluid formgrid grid">
                                    <UWInteger id="previsaoEntrega" label="Previsão de Entrega (dias)" disabled v-model="formData.numero" classContainer="col-12 md:col-2" />
                                    <UWInteger id="condicaoPagamento" label="Condição de Pagamento" disabled v-model="formData.numero" classContainer="col-12 md:col-2" />
                                    <UWInteger id="meioPagamento" label="Meio de Pagamento" disabled v-model="formData.numero" classContainer="col-12 md:col-2" />
                                </div>
                            </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
        <code>{{ formData }}</code>
    </UWPageBase>
</template>
