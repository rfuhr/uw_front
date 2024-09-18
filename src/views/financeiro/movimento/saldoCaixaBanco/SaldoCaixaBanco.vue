<script setup>
import { ref, reactive } from 'vue';
import * as yup from 'yup';
import { BancoService, AgenciaService, ContaService, SaldoCaixaBancoService } from '@/service';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate} from '@/composables/useFormatDate';

const schema = yup.object().shape({
    dataInicio: yup.date().required('Data Início é obrigatória.'),
    dataFinal: yup.date().required('Data Final é obrigatória.')
});

const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY } = useFormatDate();

const formData = reactive({
    dataInicio: new Date(),
    dataFinal: new Date()
});

const errors = reactive({});
const seletorAgencia = ref(null);
const seletorConta = ref(null);
const loading = ref(false);
const resultado = ref();
const totalRegistros = ref();

const onChangeBanco = (value) => {
    if (value) {
        seletorAgencia.value.reload();
        seletorConta.value.reload();
        formData.contaId = null;
        formData.agenciaId = null;
    } else {
        formData.contaId = null;
        formData.agenciaId = null;
        seletorAgencia.value.reload();
        seletorConta.value.reload();
    }
};

const onChangeAgencia = (value) => {
    if (value) {
        seletorConta.value.reload();
    } else {
        formData.value.contaId = null;
    }
};

async function validateForm() {
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
}

const consultaSaldoEstoque = async () => {
    if (await validateForm()) {
        loading.value = true;
        SaldoCaixaBancoService.buscaSaldoCaixaBanco(JSON.stringify(formData)).then((data) => {
            resultado.value = data;
            totalRegistros.value = resultado.value.length;
            loading.value = false;
        });
    }
};
</script>

<template>
    <BlockUI :blocked="blocked" fullScreen />
    <UWPageBase title="Saldo de Caixa e Bancos">
        <div class="col-12">
            <UWFieldSet title="Filtro de pesquisa">
                <div class="p-fluid formgrid grid">
                    <UWSeletor
                        id="banco"
                        ref="seletorBanco"
                        classContainer="col-12 md:col-2"
                        v-model="formData.bancoId"
                        optionLabel="nome"
                        optionValue="id"
                        label="Banco"
                        :service="BancoService"
                        placeholder="Selecione o banco"
                        @changeObject="onChangeBanco"
                    />
                    <UWSeletor
                        id="agencia"
                        ref="seletorAgencia"
                        classContainer="col-12 md:col-2"
                        v-model="formData.agenciaId"
                        optionLabel="nome"
                        optionValue="id"
                        label="Agência"
                        :service="AgenciaService"
                        placeholder="Selecione a agência"
                        :columnsFilters="[{ field: 'banco', value: formData.bancoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'banco.id' }]"
                        @changeObject="onChangeAgencia"
                    />
                    <UWSeletor
                        id="conta"
                        ref="seletorConta"
                        classContainer="col-12 md:col-2"
                        v-model="formData.contaId"
                        optionLabel="nome"
                        optionValue="id"
                        label="Conta"
                        :service="ContaService"
                        placeholder="Selecione a conta"
                        :columnsFilters="[{ field: 'agencia', value: formData.agenciaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'agencia.id' }]"
                        :erros="errors.value?.agenciaId"
                    />
                    <UWCalendar id="dataInicio" label="Data Início" required v-model="formData.dataInicio" :errors="errors.value?.dataInicio" classContainer="col-12 md:col-2" />
                    <UWCalendar id="dataFinal" label="Data Final" required v-model="formData.dataFinal" :errors="errors.value?.dataFinal" classContainer="col-12 md:col-2" />
                    <div class="col-2">
                        <Button label="Consultar" class="px-3 py-12 mr-3" icon="pi pi-fw pi-search" outlined severity="success" @click="consultaSaldoEstoque" />
                    </div>
                </div>
            </UWFieldSet>
        </div>
        <div class="col-12">
            <UWFieldSet title="Saldos Encontrados">
                <DataTable
                    ref="dtSaldoCaixaBanco"
                    :value="resultado"
                    responsiveLayout="scroll"
                    :paginator="true"
                    :rows="10"
                    :totalRecords="totalRegistros"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 20, 50]"
                    :loading="loading"
                >
                    <template #empty> Nenhum Saldo de Caixa e Bancos encontrado. </template>

                    <Column field="bancoNome" header="Banco" style="width: 12%"> </Column>
                    <Column field="agenciaNome" header="Agência" style="width: 12%"> </Column>
                    <Column field="contaNumero" header="Núm. Conta" style="width: 12%"> </Column>
                    <Column field="contaNome" header="Conta" style="width: 12%"> </Column>
                    <Column header="Data" style="width: 10%">
                        <template #body="slotProps">
                            <span>{{ formatToDDMMYYYY(slotProps.data.data) }}</span>
                        </template>
                    </Column>
                    <Column field="saldoValor" header="Saldo" style="width: 10%" >
                        <template #body="slotProps">
                            <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoValor, 2) }}</div>
                        </template>
                    </Column>
                </DataTable>
            </UWFieldSet>
        </div>
    </UWPageBase>
</template>