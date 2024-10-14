<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { TaxaCalculoAgricolaService as Service, ItemService, TipoCalculoAgricolaService, RegraAtividadeService, TiposService } from '@/service';

const formData = reactive({
    itemId: undefined,
    tipoCalculoAgricolaId: undefined,
    regraAtividadeId: undefined,
    faixaLimite: undefined,
    tipoTaxaAgricola: undefined,
    percentualTaxa: undefined,
    indice: undefined,
    quantidade: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    tipoCalculoAgricolaId: yup.number().required('Tipo de Cálculo é obrigatório.'),
    regraAtividadeId: yup.number().required('Regra de Atividade é obrigatório.'),
    faixaLimite: yup.number().required('Faixa Limite é obrigatório.'),
    tipoTaxaAgricola: yup.string().required('Tipo de Taxa é obrigatório.'),
    fatorCalculo: yup.number().required('Fator de Cálculo é obrigatório.'),
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.')
        .nullable()
        .max(yup.ref('dataFinalVigencia'), 'Data de início de vigência deve ser menor que a data final.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.')
        .nullable()
        .min(yup.ref('dataInicioVigencia'), 'Data final de vigência deve ser maior que a data inicial.')
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
const tiposTaxa = ref([]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Taxa de cálculo criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a taxa de cálculo.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Taxa de cálculo alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a taxa de cálculo.', life: 5000 });
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
        formData.itemId = undefined;
        formData.tipoCalculoAgricolaId = undefined;
        formData.regraAtividadeId = undefined;
        formData.faixaLimite = undefined;
        formData.tipoTaxaAgricola = undefined;
        formData.percentualTaxa = undefined;
        formData.indice = undefined;
        formData.quantidade = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

onMounted(async () => {
    TiposService.getTipoTaxaAgricola().then((data) => {
        tiposTaxa.value = data;
    });
});

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Taxa de Cálculo' : 'Alterar Taxa de Cálculo'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTaxaCalculo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            label="Produto"
                            classContainer="col-12 md:col-12"
                            v-model="formData.itemId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemService"
                            placeholder="Selecione o produto"
                            :erros="errors.value?.itemId"
                        />
                        <UWSeletor
                            label="Tipo de Cálculo"
                            classContainer="col-12 md:col-12"
                            v-model="formData.tipoCalculoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="TipoCalculoAgricolaService"
                            placeholder="Selecione o tipo de cálculo"
                            :erros="errors.value?.tipoCalculoAgricolaId"
                        />
                        <UWSeletor
                            label="Regra de Atividade"
                            classContainer="col-12 md:col-12"
                            v-model="formData.regraAtividadeId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="RegraAtividadeService"
                            placeholder="Selecione a regra de atividade"
                            :erros="errors.value?.regraAtividadeId"
                        />
                        <UWDecimal
                            id="faixaLimite"
                            label="Faixa Limite"
                            required
                            v-model="formData.faixaLimite"
                            :errors="errors.value?.faixaLimite"
                            classContainer="col-12 md:col-4" />
                        <UWPickList
                            id="tipoTaxaAgricola"
                            label="Tipo de Taxa"
                            required
                            v-model="formData.tipoTaxaAgricola"
                            optionLabel="name"
                            optionValue="value"
                            :options="tiposTaxa"
                            classContainer="col-12 md:col-4"
                            :errors="errors.value?.tipoTaxaAgricola"
                        />                            
                        <UWDecimal
                            v-if="formData.tipoTaxaAgricola === '1'"
                            id="percentualTaxa"
                            label="Percentual Taxa (%)"
                            required
                            v-model="formData.fatorCalculo"
                            :errors="errors.value?.fatorCalculo"
                            classContainer="col-12 md:col-4" />
                        <UWDecimal
                            v-if="formData.tipoTaxaAgricola === '2'"
                            id="indice"
                            label="Índice"
                            required
                            v-model="formData.fatorCalculo"
                            :errors="errors.value?.fatorCalculo"
                            classContainer="col-12 md:col-4" />
                        <UWDecimal
                            v-if="formData.tipoTaxaAgricola === '3'"
                            id="quantidade"
                            label="Valor Absoluto"
                            required
                            v-model="formData.fatorCalculo"
                            :errors="errors.value?.fatorCalculo"
                            classContainer="col-12 md:col-4" />                            

                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
