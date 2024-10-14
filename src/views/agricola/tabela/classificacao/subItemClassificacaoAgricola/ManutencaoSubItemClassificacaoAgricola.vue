<script setup>
import { reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { SubItemClassificacaoAgricolaService as Service, ItemClassificacaoAgricolaService } from '@/service';
import UWSeletorItemAgricola from '@/components/seletores/item/UWSeletorItemAgricola.vue';
import UWSeletorSubItemClassAgricolaRomaneio from '@/components/seletores/subItemClassificacaoAgricola/UWSeletorSubItemClassAgricolaRomaneio.vue';

const formData = reactive({
    nome: undefined,
    codigo: undefined,
    itemId: undefined,
    itemClassificacaoAgricolaId: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    codigo: yup.string().required('Código é obrigatório.')
        .min(0, 'Código deve ser maior OU igual a 0'),
    nome: yup.string().required('Nome é obrigatório.')
        .max(120, 'Nome deve ter no máximo 120 caracteres.'),
    itemId: yup.number().required('Produto é obrigatório.'),
    itemClassificacaoAgricolaId: yup.number().required('Item de Classificação é obrigatório.'),
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Sub. Item de classificação criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o sub item de classificação.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Sub. Item de classificação alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o sub item de classificação.', life: 5000 });
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
        formData.nome = undefined;
        formData.codigo = undefined;
        formData.itemId = undefined;
        formData.itemClassificacaoAgricolaId = undefined;
        formData.dataInicioVigencia = undefined;
        formData.dataFinalVigencia = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

onMounted(() => {

});

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Sub. Item de Classificação' : 'Alterar Sub. Item de Classificação'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formSubItemClassificacao" @doCancel="hideDialog" @doSubmit="salvarRegistro">
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
                            label="Item de Classificação Agrícola"
                            classContainer="col-12 md:col-12"
                            v-model="formData.itemClassificacaoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação agrícola"
                            :erros="errors.value?.itemClassificacaoAgricolaId"
                        />
                        <UWInput id="id" label="Código" required v-model="formData.codigo" :showButton="false" classContainer="col-12 md:col-3" :errors="errors.value?.codigo" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />   
                        <UWSeletor
                            label="Item de Classificação Agrícola Gerado"
                            classContainer="col-12 md:col-6"
                            v-model="formData.itemClassificacaoAgricolaGeradoId"
                            optionLabel="nome"
                            optionValue="id"
                            :service="ItemClassificacaoAgricolaService"
                            placeholder="Selecione o item de classificação agrícola gerado"
                            :erros="errors.value?.itemClassificacaoAgricolaId"
                        />
                        <UWSeletorSubItemClassAgricolaRomaneio
                            classContainer="col-12 md:col-6"
                            label="Sub. Item Classificação Gerado"
                            v-model="formData.subItemClassificacaoAgricolaGeradoId"
                            :itemId="formData.itemId"
                            :itemClassificacaoAgricolaId="formData.itemClassificacaoAgricolaGeradoId"
                            :dataRomaneio="new Date()"
                            optionLabel="nome"
                            optionValue="id"
                        />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
