<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useContexto } from '@/stores';
import { TituloService, DepartamentoService, CarteiraFinanceiraService, TipoOperacaoFinanceiraService, BancoService, AgenciaService, ContaService } from '@/service';

const emit = defineEmits(['doCancelar']);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    carteiraDestino: {
        type: Number,
        required: true
    }
});

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: () => {}
});

const carteiraValue = computed({
  get: () => props.carteiraDestino,
  set: (value) => {
    emit('update:carteiraDestino', Number(value));
  }
});

const createSchema = () => {
    return yup.object().shape({
        dataMovimento: yup.date().required('Data de movimento é obrigatória').max(new Date(), 'Data de Movimento deve ser menor que a data atual.'),
        departamentoId: yup.number().required('Departamento é obrigatório')
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
    movimentosSelecionados: []
});
const tipoOperacaoFinanceira = ref({});
const seletorAgencia = ref(null);
const seletorConta = ref(null);
const carteiraFinanceiraDestino = ref({});

const handleCancelar = () => {
    emit('doCancelar');
};

const handleSubstituicaoCarteira = async () => {
    const substituicaoCarteiraRequest = montarSubstituicaoCarteiraRequest();
    await TituloService.substituicaoCarteira(substituicaoCarteiraRequest)
        .then(() => {
            Swal.fire('Sucesso', 'Substituição realizada com sucesso', 'success');
            emit('doCancelar');
        })
        .catch(() => {
            Swal.fire('Falha', 'Ocorreu uma falha no processo de substituição de carteira', 'error');
        })
        .finally(() => {});
};

const montarSubstituicaoCarteiraRequest = () => {
    return {
        dataMovimento: formData.value.dataMovimento,
        departamentoId: formData.value.departamentoId,
        carteiraFinanceiraDestinoId: carteiraFinanceiraDestino.value.id,
        tipoOperacaoFinanceiraId: formData.value.tipoOperacaoFinanceiraId,
        contaId: formData.value.contaId,
        selecionados: formData.value.movimentosSelecionados.map((titulo) => {
            return {
                tituloId: titulo.id,
                parcelaFinanceiraId: titulo.parcelaFinanceiraId,
                movimentoFinanceiroId: titulo.movimentoFinanceiroId,
                valorTotal: titulo.saldoParcela
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

const  onChangeTipoOperacaoFinanceira = async (value) => {
    if (value) {
        tipoOperacaoFinanceira.value = value;
        if (tipoOperacaoFinanceira.value.integracaoCaixaBanco === 'S') {
            seletorAgencia.value.reload();
            seletorConta.value.reload();
        } else {
            formData.value.bancoId = null;
            formData.value.agenciaId = null;
            formData.value.contaId = null;
        }
    } else {
        tipoOperacaoFinanceira.value = {};
        formData.value.bancoId = null;
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};

const onChangeBanco = (value) => {
    if (value) {
        seletorAgencia.value.reload();
        seletorConta.value.reload();
    } else {
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};

const onChangeAgencia = (value) => {
    if (value) {
        seletorConta.value.reload();
    } else {
        formData.value.contaId = null;
    }
};

onMounted(() => {
    CarteiraFinanceiraService.getById(props.carteiraDestino).then((carteira) => {
        carteiraFinanceiraDestino.value = carteira;
    });
})

</script>

<template>
    <UWPageBase title="Substituição de Carteira">
        <UWForm :schema="createSchema()" :values="formData" ref="formBaixa" @doSubmit="handleSubstituicaoCarteira" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Informações da Substituição">
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
                                    id="carteiraFinanceira"
                                    classContainer="col-12 md:col-6"
                                    v-model="carteiraValue"
                                    optionLabel="nome"
                                    optionValue="id"
                                    disabled
                                    label="Carteira Financeira de Destino"
                                    :service="CarteiraFinanceiraService"
                                    placeholder="Selecione a carteira financeira"
                                    :erros="errors.value?.carteiraFinanceiraDestinoId"
                                />
                                <UWSeletor
                                    id="tipoTitulo"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.tipoOperacaoFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo de Operação Financeira"
                                    :service="TipoOperacaoFinanceiraService"
                                    placeholder="Selecione o tipo de operação"
                                    :columnsFilters="[{ field: 'selecionaSubstituicaoCarteira', value: true, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'selecionaSubstituicaoCarteira' }]"
                                    :erros="errors.value?.tipoOperacaoFinanceiraId"
                                    @changeObject="onChangeTipoOperacaoFinanceira"
                                />
                                <UWSeletor
                                    id="banco"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.bancoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N' || carteiraFinanceiraDestino.informaBanco"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N' || carteiraFinanceiraDestino.informaBanco"
                                    label="Banco"
                                    :service="BancoService"
                                    placeholder="Selecione o banco"
                                    :erros="errors.value?.bancoId"
                                    @changeObject="onChangeBanco"
                                />
                                <UWSeletor
                                    id="agencia"
                                    ref="seletorAgencia"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.agenciaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N' || carteiraFinanceiraDestino.informaBanco"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N' || carteiraFinanceiraDestino.informaBanco"
                                    label="Agência"
                                    :service="AgenciaService"
                                    placeholder="Selecione a agência"
                                    :columnsFilters="[{ field: 'banco', value: formData.bancoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'banco.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeAgencia"
                                />
                                <UWSeletor
                                    id="conta"
                                    ref="seletorConta"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.contaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N' || carteiraFinanceiraDestino.informaBanco"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N' || carteiraFinanceiraDestino.informaBanco"
                                    label="Conta"
                                    :service="ContaService"
                                    placeholder="Selecione a conta"
                                    :columnsFilters="[{ field: 'agencia', value: formData.agenciaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'agencia.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeConta"
                                />                                
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12" v-if="errors.value?.movimentosSelecionados">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="errors.value?.movimentosSelecionados">{{ errors.value?.movimentosSelecionados }}</Message>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Movimentos a serem substituídos">
                             <DataTable :value="localModelValue" v-model:selection="formData.movimentosSelecionados" paginator :rows="10" :rowStyle="rowStyle" dataKey="movimentoFinanceiroId" showGridlines size="small" stripedRows>
                                <template #empty> Sem movimentos selecionados para substituição. </template>
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
                                <Column field="dataVencimento" header="Vencimento" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div>
                                    </template>
                                </Column>
                                <Column field="saldoParcela" header="Saldo" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoParcela, 2) }}</div>
                                    </template>
                                </Column>
                               </DataTable> 
                               <code>{{ carteiraFinanceiraDestino }}</code>
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
