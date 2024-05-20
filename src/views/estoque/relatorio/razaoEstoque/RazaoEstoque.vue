<script setup>
import { ref, reactive } from 'vue';
import UWPageBase from '@/components/layout/UWPageBase.vue';
import * as yup from 'yup';
import { useContexto } from '@/stores';
import 'vue3-form-wizard/dist/style.css';
import { EmpresaFilialService, LocalEstoqueService, GrupoContabilService, ItemService, OperacaoInternaService } from '@/service';
import { MovimentoEstoqueService } from '@/service';
import moment from 'moment';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useToast } from 'primevue/usetoast';


const contextoStore = useContexto();
const errors = reactive({});
const loading = ref(false);
const blocked = ref(false);

const resultado = ref();
const totalRegistros = ref();
const { formatNumber } = useFormatNumber();
const toast = useToast();

const schema = yup.object().shape({
    dataInicio: yup.date().required('Data Início é obrigatória.'),
    dataFinal: yup.date().required('Data Final é obrigatória.'),
});

const formData = reactive({
    empresaFilialId: undefined,
    localEstoqueId: undefined,
    grupoContabilId: undefined,
    itemId: undefined,
    dataInicio: new Date(),
    dataFinal: new Date(),
    operacaoInternaId: undefined,
    documento: undefined
});

const formataData = (data) => {
    if (data) {
        moment.locale('pt-br')
        return moment(data).format('DD/MM/YYYY')
    }
    return ''
}

async function validateForm () {
    errors.value = {};
    return schema
        .validate(formData, { abortEarly: false })
        .then(() => {
            return true;
        })
        .catch((err) => {
            err.inner.forEach((error) => {
                errors.value[error.path] = error.message;
            });
            return false;
        });
};

const consultaMovimentoEstoque = async () => {
    if (await validateForm()) {
        loading.value = true;
        MovimentoEstoqueService.buscaMovimentoEstoque(JSON.stringify(formData)).then((data) => {
            resultado.value = data;
            totalRegistros.value = resultado.value.length;
            loading.value = false;
        })
    }
}

const imprimirRazaoEstoque = async () => {
    if (await validateForm()) {
        blocked.value = true;
        MovimentoEstoqueService.imprimirRazaoEstoque(JSON.stringify(formData)).then((response) => {
            const disposition = response.headers['content-disposition'];
            const fileNameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(disposition);
            const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'RazaoEstoque.pdf';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            blocked.value = false;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Erro ao gerar o Relatório de Razão de Estoque.', life: 5000 });
            blocked.value = false;
        });
    }
}

</script>

<template>
    <BlockUI :blocked="blocked" fullScreen />      
    <UWPageBase title="Razão de Estoque">
      <div class="col-12">
        <div class="p-fluid formgrid grid">
          <UWSeletor
              ref="seletorFilial"
              id="seletorFilial"
              label="Filial"
              classContainer="col-12 md:col-6"
              v-model="formData.empresaFilialId"
              optionLabel="nome"
              optionValue="id"
              :service="EmpresaFilialService"
              placeholder="Selecione a Filial"
              :columnsFilters="[{ field: 'empresa', value: contextoStore.contexto.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
          /> 
          <UWSeletor
              classContainer="col-12 md:col-6"
              v-model="formData.localEstoqueId"
              optionLabel="nome"
              optionValue="id"
              label="Local do Estoque"
              :service="LocalEstoqueService"
              placeholder="Selecione o Local do Estoque"
          />
          <UWSeletor
              classContainer="col-12 md:col-6"
              v-model="formData.grupoContabilId"
              optionLabel="nome"
              optionValue="id"
              label="Grupo Contábil"
              :service="GrupoContabilService"
              placeholder="Selecione o Grupo Contábil"
          />
          <UWSeletor
              classContainer="col-12 md:col-6"
              v-model="formData.itemId"
              optionLabel="nome"
              optionValue="id"
              label="Item"
              :service="ItemService"
              placeholder="Selecione o Item"
          />
          <UWSeletor
              classContainer="col-12 md:col-6"
              v-model="formData.operacaoInternaId"
              optionLabel="nome"
              optionValue="id"
              label="Operação Interna"
              :service="OperacaoInternaService"
              placeholder="Selecione a Operação Interna"
          />
          <UWInput id="documento" label="Documento" v-model="formData.documento" classContainer="col-12 md:col-6" />
          <UWCalendar id="dataInicio" label="Data Início" required v-model="formData.dataInicio" :errors="errors.value?.dataInicio" classContainer="col-12 md:col-3" />
          <UWCalendar id="dataFinal" label="Data Final" required v-model="formData.dataFinal" :errors="errors.value?.dataFinal" classContainer="col-12 md:col-3" />
          <div class="col-3">
            <Button label="Consultar" class="px-3 py-12 mr-3" icon="pi pi-fw pi-search" outlined severity="success" @click="consultaMovimentoEstoque" />
          </div>      
          <div class="col-3">
            <Button label="Imprimir Relatório" class="px-3 py-12 mr-3" icon="pi pi-fw pi-print" outlined severity="secundary" @click="imprimirRazaoEstoque" />
          </div>         
        </div>
      </div>
      <div class="col-12">
        <DataTable ref="dtMovtoEstoque" :value="resultado" responsiveLayout="scroll" :paginator="true" :rows="10" 
            :totalRecords="totalRegistros"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            :loading="loading"
        >
            <template #empty> Nenhum Movimento de Estoque encontrado. </template>

            <Column field="empresaFilialId" header="Filial" style="width: 5%"> </Column>
            <Column field="localEstoqueId" header="Local Estoque" style="width: 5%"></Column>
            <Column field="grupoContabilId" header="Grupo Contábil" style="width: 5%"></Column>
            <Column header="Item" style="width: 15%">
                <template #body="slotProps">
                    <span>{{ slotProps.data.itemCodigo }} - {{ slotProps.data.itemNome }}</span>
                </template>
            </Column>            
            <Column field="unidadeMedidaSigla" header="U.M." style="width: 5%"></Column>
            <Column field="tipoMovimentoEstoque" header="Tipo Movimento" style="width: 8%"></Column>
            <Column field="operacaoInternaSigla" header="Operação Interna" style="width: 8%"></Column>
            <Column header="Data" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.data) }}</span>
                </template>
            </Column>
            <Column field="documento" header="Documento" style="width: 10%"> </Column>
            <Column field="quantidade" header="Quantidade" style="width: 8%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.quantidade, 3) }}</div> 
                </template>
            </Column>
            <Column field="valor" header="Valor" style="width: 8%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valor, 2) }}</div> 
                </template>
            </Column>
            <Column field="custoMedio" header="Custo Médio" style="width: 8%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.custoMedio, 5) }}</div> 
                </template>
            </Column>
            <Column field="creditoDebitoQuantidade" header="C/D" style="width: 5%"> </Column>
        </DataTable>
    </div>
    </UWPageBase>
</template>