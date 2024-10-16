<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ValidaCalculoAgricolaService as Service, ItemService, GrupoOperacaoAgricolaService, TipoCalculoAgricolaService, RegraAtividadeService } from '@/service';
import UWSeletorOIAgricola from '@/components/seletores/operacaoInterna/UWSeletorOIAgricola.vue';

const formData = reactive({
    itemId: undefined,
    tipoCalculoAgricolaId: undefined,
    operacaoInternaId: undefined,
    grupoOperacaoAgricolaId: undefined,
    regraAtividadeId: undefined,
    dataInicioVigencia: null,
    dataFinalVigencia: null
});

const schema = yup.object().shape({
    itemId: yup.number().required('Produto é obrigatório.'),
    tipoCalculoAgricolaId: yup.number().required('Tipo de Cálculo é obrigatório.'),
    operacaoInternaId: yup.number().required('Operação Interna é obrigatório.'),
    grupoOperacaoAgricolaId: yup.number().required('Grupo de Operação Agrícola é obrigatório.'),
    regraAtividadeId: yup.number().required('Regra de Atividade é obrigatório.'),
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
        formData.tipoCalculoAgricolaId = undefined;
        formData.operacaoInternaId = undefined;
        formData.grupoOperacaoAgricolaId = undefined;
        formData.regraAtividadeId = undefined;
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
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Validação' : 'Alterar Validação'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formValidacaoCalculo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
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
                        <UWSeletorOIAgricola
                            label="Operação Interna"
                            classContainer="col-12 md:col-12"
                            v-model="formData.operacaoInternaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            placeholder="Selecione a operação interna"
                            :erros="errors.value?.operacaoInternaId"
                        />   
                        <UWSeletor
                            label="Grupo de Operação Agrícola"
                            classContainer="col-12 md:col-6"
                            v-model="formData.grupoOperacaoAgricolaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="GrupoOperacaoAgricolaService"
                            placeholder="Selecione o grupo de operação agrícola"
                            :erros="errors.value?.grupoOperacaoAgricolaId"
                        />
                        <UWSeletor
                            label="Regra de Atividade"
                            classContainer="col-12 md:col-6"
                            v-model="formData.regraAtividadeId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="RegraAtividadeService"
                            placeholder="Selecione a regra de atividade"
                            :erros="errors.value?.regraAtividadeId"
                        />
                        <UWCalendar id="dataInicioVigencia" label="Data Início Vigência" required v-model="formData.dataInicioVigencia" :errors="errors.value?.dataInicioVigencia" classContainer="col-12 md:col-6" />
                        <UWCalendar id="dataFinalVigencia" label="Data Final Vigência" required v-model="formData.dataFinalVigencia" :errors="errors.value?.dataFinalVigencia" classContainer="col-12 md:col-6" />                        
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
