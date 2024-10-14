<script setup>
import { reactive, computed } from 'vue';
import * as yup from 'yup';
import UWSeletorOIAgricola from '@/components/seletores/operacaoInterna/UWSeletorOIAgricola.vue';
import UWSeletorCfopByOpInt from '@/components/seletores/UWSeletorCfopByOpInt.vue';
import { TipoDocumentoService } from '@/service';

const schema = yup.object().shape({
    operacaoInternaId: yup.number().required('Operação Interna deve ser informada'),
    cfopId: yup.number().required('Cfop deve ser informado'),
    numeroNota: yup.number().required('Número da Nota Fiscal é obrigatório'),
    serie: yup.string().required('Série é obrigatória'),
    dataEmissao: yup.date().required('Data de Emissão é obrigatória'),
    tipoDocumentoId: yup.number().required('Tipo de Documento é obrigatório'),
    quantidade: yup.number().required('Quantidade é obrigatória'),
    valorUnitario: yup.number().required('Valor Unitário é obrigatório'),
    valorTotal: yup.number().required('Valor Total é obrigatório'),
});

const props = defineProps({
    modelValue: {},
    showDialog: {
        type: Boolean,
        required: true
    },
    tipoPeso: {
        type: String,
        default: 'entrada'
    }
});

const emit = defineEmits(['closeDialog', 'update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) value = 0;
        if (value !== props.modelValue) {
            emit('update:modelValue', value);
        }
    }
});

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const hideDialog = () => {
    emit('closeDialog');
};

const salvarRegistro = async () => {
    emit('confirmDialog', localModelValue.value);
};

const showModal = async () => {

};

const changeQuantidade = () => {
    localModelValue.value.valorTotal = (localModelValue.value.quantidade * localModelValue.value.valorUnitario) || 0;
};

const changeValorUnitario = () => {
    localModelValue.value.valorTotal = (localModelValue.value.quantidade * localModelValue.value.valorUnitario) || 0;
};

const changeValorTotal = () => {
    localModelValue.value.valorUnitario = (localModelValue.value.valorTotal / localModelValue.value.quantidade) || 0;
};

const changeOperacaoInterna = (registro) => {
    if (registro)
        localModelValue.value.operacaoInternaSigla = registro.sigla;
    else
        localModelValue.value.operacaoInternaSigla = '';
};

const changeCfop = (registro) => {
    if (registro)
        localModelValue.value.cfopCodigo = registro.codigo;
    else
        localModelValue.value.cfopCodigo = '';
};

const changeTipoDocumento = (registro) => {
    if (registro)
        localModelValue.value.tipoDocumentoSigla = registro.sigla;
    else
        localModelValue.value.tipoDocumentoSigla = '';
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '70%' }" header="Vincular Nota Fiscal"  :modal="true" :closable="false"
            @show="showModal">
        <UWForm :schema="schema" :values="localModelValue" @doVoltar="hideDialog" @doSubmit="salvarRegistro" :visibleSave="false" :visibleCancel="false" 
                visibleVoltar visibleConfirmar>
            <template #errors="{ errors }">
                <UWFieldSet title="Característica da Nota Fiscal" class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletorOIAgricola
                            label="Operação Interna"
                            ref="seletorOperacaoInterna"
                            classContainer="col-12 md:col-6"
                            v-model="localModelValue.operacaoInternaId"
                            disabled
                            optionLabel="nome"
                            optionValue="id"
                            required
                            placeholder="Selecione a operação interna"
                            :erros="errors.value?.operacaoInternaId"
                            @changeObject="changeOperacaoInterna"
                        /> 
                        <UWSeletorCfopByOpInt
                            id="cfop"
                            v-model:operacaoInternaId="localModelValue.operacaoInternaId"
                            v-model="localModelValue.cfopId"
                            classContainer="col-12 md:col-6"
                            required
                            label="Cfop"
                            :erros="errors.value?.cfopId"
                            @changeObject="changeCfop"
                        />
                    </div>
                </UWFieldSet>
                <UWFieldSet title="Dados da Nota Fiscal" class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInteger id="numeroNota" label="Número" v-model="localModelValue.numeroNota" classContainer="col-12 md:col-2" :errors="errors.value?.numeroNota"/>
                        <UWInput id="serie" label="Série" v-model="localModelValue.serie" classContainer="col-12 md:col-1" :errors="errors.value?.serie"/>
                        <UWCalendar
                            id="dataEmissao "
                            label="Data de Emissão"
                            v-model="localModelValue.dataEmissao"
                            dateFormat="dd/mm/yy"
                            :showTime="false"
                            required
                            classContainer="col-12 md:col-2"
                            :errors="errors.value?.dataEmissao"
                        />
                        <UWInput id="chaveNFe" label="Chave NFe" v-model="localModelValue.chaveNFe" classContainer="col-12 md:col-4" />
                        <UWSeletor
                            id="tipoDocumento"
                            classContainer="col-12 md:col-3"
                            v-model="localModelValue.tipoDocumentoId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Tipo de Documento"
                            :service="TipoDocumentoService"
                            placeholder="Selecione o tipo de documento"
                            :erros="errors.value?.tipoDocumentoId"
                            @changeObject="changeTipoDocumento"
                        />
                        <UWDecimal id="quantidade" label="Quantidade" v-model="localModelValue.quantidade" :maximoDigitos="5" @onChange="changeQuantidade()" classContainer="col-12 md:col-4" :errors="errors.value?.quantidade"/>
                        <UWCurrency id="valorUnitario" label="Valor Unitário" v-model="localModelValue.valorUnitario" classContainer="col-12 md:col-4" @onChange="changeValorUnitario()" :errors="errors.value?.valorUnitario"/>
                        <UWCurrency id="valorTotal" label="Valor Total" v-model="localModelValue.valorTotal" classContainer="col-12 md:col-4" @onChange="changeValorTotal()" :errors="errors.value?.valorTotal"/>
                    </div>
                </UWFieldSet>
            </template>
        </UWForm>
    </Dialog>
</template>
