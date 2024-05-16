<script setup>
import { ref, reactive } from 'vue';
import UWPageBase from '@/components/layout/UWPageBase.vue';
import * as yup from 'yup';
import { useContexto } from '@/stores';
import 'vue3-form-wizard/dist/style.css';
import { EmpresaFilialService, LocalEstoqueService, GrupoContabilService, ItemService } from '@/service';
import { SaldoEstoqueService } from '@/service';
import moment from 'moment';
import { useFormatNumber } from '@/composables/useFormatNumber';

const contextoStore = useContexto();
const errors = reactive({});

const resultado = ref();
const totalRegistros = ref();
const { formatNumber } = useFormatNumber();

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
    dataFinal: new Date()
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

const consultaSaldoEstoque = async () => {
  // if (this.validateForm()) {
    SaldoEstoqueService.buscaSaldoEstoque(JSON.stringify(formData)).then((data) => {
      resultado.value = data;
      totalRegistros.value = resultado.value.length;
    })
  // }
}

</script>

<template>
    <UWPageBase title="Posição de Estoque Físico/Financeira">
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
          <UWCalendar id="dataInicio" label="Data Início" required v-model="formData.dataInicio" :errors="errors.value?.dataInicio" classContainer="col-12 md:col-3" />
          <UWCalendar id="dataFinal" label="Data Final" required v-model="formData.dataFinal" :errors="errors.value?.dataFinal" classContainer="col-12 md:col-3" />
          <div class="col-3">
            <Button label="Consultar" class="px-3 py-12 mr-3" icon="pi pi-fw pi-search" outlined severity="success" @click="consultaSaldoEstoque" />
          </div>      
          <div class="col-3">
            <Button label="Imprimir Relatório" class="px-3 py-12 mr-3" icon="pi pi-fw pi-print" outlined severity="secundary" @click="validateForm" />
          </div>         
        </div>
      </div>
      <div class="col-12">
        <DataTable ref="dtSaldoEstoque" :value="resultado" responsiveLayout="scroll" :paginator="true" :rows="10" 
            :totalRecords="totalRegistros"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
        >
            <template #empty> Nenhum Saldo de Estoque encontrado. </template>

            <Column field="empresaFilialNome" header="Filial" style="width: 12%"> </Column>
            <Column field="localEstoqueNome" header="Local Estoque" style="width: 12%"></Column>
            <Column field="grupoContabilNome" header="Grupo Contábil" style="width: 12%"></Column>
            <Column field="itemNome" header="Item" style="width: 12%"></Column>
            <Column field="unidadeMedidaSigla" header="U.M." style="width: 8%"></Column>
            <Column header="Data" style="width: 10%">
                <template #body="slotProps">
                    <span>{{ formataData(slotProps.data.data) }}</span>
                </template>
            </Column>
            <Column field="saldoQuantidade" header="Saldo Físico" style="width: 10%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoQuantidade, 3) }}</div> 
                </template>
            </Column>            
            <Column field="saldoValor" header="Saldo Financeiro" style="width: 10%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoValor, 2) }}</div> 
                </template>
            </Column>            
            <Column field="custoMedio" header="Custo Médio" style="width: 10%">
                <template #body="slotProps">
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.custoMedio, 5) }}</div> 
                </template>
            </Column>
        </DataTable>
    </div>
    </UWPageBase>
</template>