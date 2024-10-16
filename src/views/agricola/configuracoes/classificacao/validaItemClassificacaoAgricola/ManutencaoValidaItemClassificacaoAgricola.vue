<script setup>
import { ref, reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ValidaItemClassificacaoAgricolaService as Service, ItemService, ItemClassificacaoAgricolaService } from '@/service';

const formData = reactive({
    itemId: undefined,
    itemClassificacaoAgricolaId: undefined,
    tipoUsoRomaneio: 'NN',
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    itemClassificacaoAgricolaId: yup.number().required('Item de Classificação é obrigatório.'),
    tipoUsoRomaneio: yup.string().required('Tipo de Uso Romaneio é obrigatório.'),
    ordemTela: yup.number().required('Ordem em tela é obrigatório.'),
    dataInicioVigencia: yup.date().required('Data Início Vigência é obrigatório.')
        .nullable()
        .max(yup.ref('dataFinalVigencia'), 'Data de início de vigência deve ser menor que a data final.'),
    dataFinalVigencia: yup.date().required('Data Final Vigência é obrigatório.')
        .nullable()
        .min(yup.ref('dataInicioVigencia'), 'Data final de vigência deve ser maior que a data inicial.')
});

const tiposUso = ref([
    { name: 'Não Opera', value: 'NN' },
    { name: 'Digita', value: 'DD' },
    { name: 'Digita / Calcula', value: 'DC' },
    { name: 'Calcula', value: 'CC' }
]);

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Validação criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a validação.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Validação alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a validação.', life: 5000 });
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
        formData.itemClassificacaoAgricolaId = undefined;
        formData.tipoUsoRomaneio = 'NN';
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Validação Produto x Classificação Agrícola' : 'Alterar Validação Produto x Classificação Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formTipoCalculo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
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
                            label="Item de Classificação"
                            classContainer="col-12 md:col-12"
                            v-model="formData.itemClassificacaoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação"
                            :erros="errors.value?.itemClassificacaoAgricolaId"
                        />
                        <UWPickList
                            id="tipoUsoRomaneio"
                            required
                            label="Uso no Romaneio"
                            v-model="formData.tipoUsoRomaneio"
                            optionLabel="name"
                            optionValue="value"
                            :options="tiposUso"
                            classContainer="col-12 md:col-5"
                            :errors="errors.value?.tipoUsoRomaneio"
                        />
                        <UWInteger id="ordemTela" label="Ordem em tela" required v-model="formData.ordemTela" :errors="errors.value?.ordemTela" classContainer="col-12 md:col-3" />
                        <UWToggleButton
                            id="obrigatorio"   
                            classContainer="col-12 md:col-4"
                            v-model="formData.obrigatorio"
                            onLabel="Obrigatório informar"
                            offLabel="Não é obrigatório"
                            onIcon="pi pi-lock"
                            offIcon="pi pi-lock-open"
                            onColor="#e9cdf7"
                            offColor="rgb(215, 243, 215)"
                        />   
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
