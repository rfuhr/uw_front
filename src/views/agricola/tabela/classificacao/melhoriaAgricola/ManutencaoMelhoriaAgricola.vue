<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { MelhoriaAgricolaService as Service, ItemClassificacaoAgricolaService } from '@/service';
import UWSeletorItemAgricola from '@/components/seletores/item/UWSeletorItemAgricola.vue';
import UWSeletorSubItemClassAgricolaRomaneio from '@/components/seletores/subItemClassificacaoAgricola/UWSeletorSubItemClassAgricolaRomaneio.vue';

const formData = reactive({
    itemId: null,
    itemClassificacaoAgricolaPrincipalId: null,
    subItemClassificacaoAgricolaPrincipalId: null,
    itemClassificacaoAgricolaSecundarioId: null,
    subItemClassificacaoAgricolaSecundarioId: null,
    itemClassificacaoAgricolaGeradoId: null,
    subItemClassificacaoAgricolaGeradoId: null,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    itemClassificacaoAgricolaPrincipalId: yup.number().required('Item de Classificação Principal é obrigatório.'),
    subItemClassificacaoAgricolaPrincipalId: yup.number().required('Sub. Item de Classificação Principal é obrigatório.'),
    itemClassificacaoAgricolaSecundarioId: yup.number().required('Item de Classificação Secundário é obrigatório.'),
    subItemClassificacaoAgricolaSecundarioId: yup.number().required('Sub. Item de Classificação Secundário é obrigatório.'),
    itemClassificacaoAgricolaGeradoId: yup.number().required('Item de Classificação Gerado é obrigatório.'),
    subItemClassificacaoAgricolaGeradoId: yup.number().required('Sub. Item de Classificação Gerado é obrigatório.'),
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Predefinição de preço criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a predefinição de preço.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Predefinição de preço alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a predefinição de preço.', life: 5000 });
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
        formData.itemClassificacaoAgricolaPrincipalId = undefined;
        formData.subItemClassificacaoAgricolaPrincipalId = undefined;
        formData.itemClassificacaoAgricolaSecundarioId = undefined;
        formData.subItemClassificacaoAgricolaSecundarioId = undefined;
        formData.itemClassificacaoAgricolaGeradoId = undefined;
        formData.subItemClassificacaoAgricolaGeradoId = undefined;
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
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Melhoria Agrícola' : 'Alterar Melhoria Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formMelhoriaAgricola" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletorItemAgricola
                        classContainer="col-12 md:col-12"
                            label="Produto"
                            v-model="formData.itemId"
                            required
                            autofocus
                            optionLabel="nome"
                            optionValue="id"
                            placeholder="Selecione o produto"
                            :erros="errors.value?.itemId"
                        />     
                        <UWSeletor
                            label="Item de Classificação Principal"
                            classContainer="col-12 md:col-6"
                            v-model="formData.itemClassificacaoAgricolaPrincipalId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação principal"
                            :erros="errors.value?.itemClassificacaoAgricolaPrincipalId"
                        />              
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            label="Sub. Item de Classificação Principal"
                            v-model="formData.subItemClassificacaoAgricolaPrincipalId"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="formData.itemClassificacaoAgricolaPrincipalId"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.subItemClassificacaoAgricolaPrincipalId"
                        />     
                        <UWSeletor
                            label="Item de Classificação Secundário"
                            classContainer="col-12 md:col-6"
                            v-model="formData.itemClassificacaoAgricolaSecundarioId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação secundário"
                            :erros="errors.value?.itemClassificacaoAgricolaSecundarioId"
                        />              
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            label="Sub. Item de Classificação Secundário"
                            v-model="formData.subItemClassificacaoAgricolaSecundarioId"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="formData.itemClassificacaoAgricolaSecundarioId"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.subItemClassificacaoAgricolaSecundarioId"
                        />   
                        <UWSeletor
                            label="Item de Classificação Gerado"
                            classContainer="col-12 md:col-6"
                            v-model="formData.itemClassificacaoAgricolaGeradoId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação gerado"
                            :erros="errors.value?.itemClassificacaoAgricolaGeradoId" />
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            label="Sub. Item de Classificação Gerado"
                            v-model="formData.subItemClassificacaoAgricolaGeradoId"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="formData.itemClassificacaoAgricolaGeradoId"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                            :erros="errors.value?.subItemClassificacaoAgricolaGeradoId"
                        /> 
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
