<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfigCalculoPrecoService as Service, TipoPrecoService, OperacaoInternaService } from '@/service';
import { parseISO } from 'date-fns';
import  ManutencaoConfigCalculoPrecoOperInterna from './ManutencaoConfigCalculoPrecoOperInterna.vue';

const schema = yup.object().shape({
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.'),
    tipoPrecoId: yup.number().required('Tipo de Preço é obrigatório.'),
    operacaoInternaId: yup.number().required('Operação Interna é obrigatória.'),
    diasBuscaPrecos: yup.number().required('Dias Busca de Preço é obrigatório.'),
    // percentual: yup.number().test('custom-validation', 'Erro de validação personalizado', function (value) {
    //                 if (formData.value.aplicaPercentualFixo && !value) {
    //                     throw new yup.ValidationError(this.createError({ message: 'Percentual é obrigatório' }));
    //                 }
    //                 return true;
    // }),
});

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['closeDialog']);

const toast = useToast();

const formData = reactive({
    dataInicioVigencia: undefined,
    dataFinalVigencia: undefined,
    tipoPrecoId: undefined,
    operacaoInternaId: undefined,
    id: undefined,
    diasBuscaPrecos: undefined,
    aplicaIndicesMarkup: false,
    aplicaPercentualFixo: false,
    percentual: undefined,
    configCalculoPrecoOperInternas: []
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

const criarRegistro = () => {
    Service.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração do Cálculo de Preços criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Configuração do Cálculo de Preços.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração do Cálculo de Preços alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Configuração do Cálculo de Preços.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.tipoPrecoId = undefined;
        formData.operacaoInternaId = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
        formData.id = undefined;
        formData.diasBuscaPrecos = undefined;
        formData.aplicaIndicesMarkup = false;
        formData.aplicaPercentualFixo = false;
        formData.percentual = undefined;
        formData.configCalculoPrecoOperInternas = [];
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
            formData.dataInicioVigencia = parseISO(data.dataInicioVigencia)
            formData.dataFinalVigencia = parseISO(data.dataFinalVigencia)
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '90%' }" :header="mode === 'create' ? 'Nova Configuração do Cálculo de Preços' : 'Alterar Configuração do Cálculo de Preços'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConfigCalculoPreco" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="identificador" label="Identificador" disabled autofocus v-model="formData.id" classContainer="col-12 md:col-3" />
                        <UWSeletor 
                                id="seletorTipoPreco" 
                                label="Tipo de Preço" 
                                v-model="formData.tipoPrecoId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione o Tipo de Preço" 
                                :service="TipoPrecoService" 
                                classContainer="col-12 md:col-4"
                                :erros="errors?.value?.tipoPrecoId"
                            >
                        </UWSeletor>   
                        <UWSeletor 
                                id="seletorOperacaoInterna" 
                                label="Operação Interna para Busca de Impostos" 
                                v-model="formData.operacaoInternaId" 
                                required
                                optionLabel="nome" 
                                optionValue="id" 
                                placeholder="Selecione a Operação Interna para Busca de Impostos" 
                                :service="OperacaoInternaService" 
                                classContainer="col-12 md:col-5"
                                :erros="errors?.value?.operacaoInternaId"
                                @changeObject="changeOperacao"
                            >
                        </UWSeletor>  
                        <UWInput id="diasBuscaPrecos" label="Dias Busca de Preços" required autofocus v-model="formData.diasBuscaPrecos" :errors="errors.value?.diasBuscaPrecos" classContainer="col-12 md:col-3" />
                        <div class="field md:col-3 pt-0">
                            <span class="p-float-label">
                                <ToggleButton
                                    v-model="formData.aplicaIndicesMarkup"
                                    onLabel="Aplica Índices de Markup"
                                    offLabel="NÃO Aplica Índices de Markup"
                                    onIcon="pi pi-lock"
                                    offIcon="pi pi-lock-open"
                                    class="w-full"
                                    aria-label="Do you confirm"
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': formData.aplicaIndicesMarkup, 'bg-red-100 border-white': !formData.aplicaIndicesMarkup }]
                                        }
                                    }"
                                />
                            </span>
                        </div>   
                        <div class="field md:col-3 pt-0">
                            <span class="p-float-label">
                                <ToggleButton
                                    v-model="formData.aplicaPercentualFixo"
                                    onLabel="Aplica Percentual Fixo"
                                    offLabel="NÃO Aplica Percentual Fixo"
                                    onIcon="pi pi-lock"
                                    offIcon="pi pi-lock-open"
                                    class="w-full"
                                    aria-label="Do you confirm"
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': formData.aplicaPercentualFixo, 'bg-red-100 border-white': !formData.aplicaPercentualFixo }]
                                        }
                                    }"
                                />
                            </span>
                        </div>   
                        <UWDecimal id="percentual" label="Percentual" maximoDigitos="3" :disabled="!formData.aplicaPercentualFixo" :required="formData.aplicaPercentualFixo" v-model="formData.percentual" :errors="errors.value?.percentual" classContainer="col-12 md:col-3" />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-4" />
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Operações Internas" class="col-12">
                            <ManutencaoConfigCalculoPrecoOperInterna v-model="formData.configCalculoPrecoOperInternas" />
                        </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
