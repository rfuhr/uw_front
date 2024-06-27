<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useContexto } from '@/stores';
import { TituloService, DepartamentoService, MotivoEstornoFinanceiroService } from '@/service';

const emit = defineEmits(['doCancelar']);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: () => {}
});

const createSchema = () => {
    return yup.object().shape({
        dataMovimento: yup.date().required('Data de movimento é obrigatória').max(new Date(), 'Data de Movimento deve ser menor que a data atual.'),
        departamentoId: yup.number().required('Departamento é obrigatório'),
        motivoEstornoFinanceiroId: yup.number().required('Motivo de Estorno Financeiro é obrigatório'),
        baixasSelecionadas: yup.array().min(1, 'Selecione ao menos uma baixa para o estorno')
    });
};
const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY } = useFormatDate();
const { formatDocumento } = useFormatDocumentos();
const contextoStore = useContexto();

const formData = ref({
    dataMovimento: new Date(),
    departamentoId: null,
    motivoEstornoFinanceiroId: null,
    baixasSelecionadas: []
});

const handleCancelar = () => {
    emit('doCancelar');
};

const handleEstornoTitulos = async () => {
    const estornoTituloRequest = montarEstornoTituloRequest();
    await TituloService.estornoBaixa(estornoTituloRequest)
        .then(() => {
            Swal.fire('Sucesso', 'Estornos realizados com sucesso', 'success');
            emit('doCancelar');
        })
        .catch(() => {
            Swal.fire('Falha', 'Ocorreu uma falha no processo de estorno de baixas', 'error');
        })
        .finally(() => {});
};

const montarEstornoTituloRequest = () => {
    return {
        dataMovimento: formData.value.dataMovimento,
        departamentoId: formData.value.departamentoId,
        motivoEstornoFinanceiroId: formData.value.motivoEstornoFinanceiroId,
        observacao: formData.value.observacao,
        baixasSelecionadas: formData.value.baixasSelecionadas.map((titulo) => {
            return {
                tituloId: titulo.id,
                parcelaFinanceiraId: titulo.parcelaFinanceiraId,
                movimentoFinanceiroId: titulo.movimentoFinanceiroId,
                valorMovimento: titulo.valorMovimento
            };
        })
    };
};


const rowStyle = (data) => {
    if (data.tipoTituloSigla === 'PAG') {
        return { color: 'var(--red-600)' };
    }
    if (data.tipoTituloSigla === 'REC') {
        return { color: 'var(--blue-600)' };
    }
};
</script>

<template>
    <UWPageBase title="Estorno de Títulos">
        <UWForm :schema="createSchema()" :values="formData" ref="formBaixa" @doSubmit="handleEstornoTitulos" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Informações do estorno">
                            <div class="p-fluid formgrid grid">
                                <UWCalendar id="dataMovimento" label="Data de Movimento" dateFormat="dd/mm/yy" disabled required v-model="formData.dataMovimento" :errors="errors.value?.dataMovimento" classContainer="col-12 md:col-2" />
                                <UWSeletor
                                    :id="departamento"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWSeletor
                                    id="motivoEstornoFinanceiro"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.motivoEstornoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Motivo do Estorno"
                                    :service="MotivoEstornoFinanceiroService"
                                    placeholder="Selecione o motivo de estorno"
                                    :erros="errors.value?.motivoEstornoFinanceiroId"
                                />
                                <UWInput id="observacao" label="Observação" v-model="formData.observacao" :errors="errors.value?.observacao" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12" v-if="errors.value?.baixasSelecionadas">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="errors.value?.baixasSelecionadas">{{ errors.value?.baixasSelecionadas }}</Message>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Baixas a serem estornadas">
                            <DataTable :value="localModelValue" v-model:selection="formData.baixasSelecionadas" paginator :rows="10" :rowStyle="rowStyle" dataKey="movimentoFinanceiroId" showGridlines size="small" stripedRows>
                                <template #empty> Sem baixas selecionadas para estorno. </template>
                                <Column selectionMode="multiple" headerStyle="width: 3rem" headerClass="columnHeaderItem"></Column>
                                <Column field="nossoNumero" header="Nosso Número" sortable headerClass="columnHeaderItem" />
                                <Column field="departamentoSigla" header="Depto" sortable headerClass="columnHeaderItem" />
                                <Column field="parceiroLocalCpfCnpj" header="Parceiro" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatDocumento(slotProps.data.parceiroLocalCpfCnpj) }}</div>
                                    </template>
                                </Column>
                                <Column field="documento" header="Documento" sortable headerClass="columnHeaderItem" />
                                <Column field="numeroParcela" header="Parcela" sortable headerClass="columnHeaderItem" />
                                <Column field="tipoOperacaoFinanceiraNome" header="Tipo da Operação" sortable headerClass="columnHeaderItem" />
                                <Column field="dataMovimento" header="Data de Movimento" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataMovimento) }}</div>
                                    </template>
                                </Column>
                                <Column field="valorMovimento" header="Saldo" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorMovimento, 2) }}</div>
                                    </template>
                                </Column>
                            </DataTable>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>

<style>
.columnHeaderItem .p-column-title {
    text-align: center;
    width: 100%;
}
</style>
