<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ContaService as Service, BancoService, AgenciaService, TipoContaCxBcoService } from '@/service';

const schema = yup.object().shape({
    numero: yup.number().required('Número é obrigatório.'),
    dv: yup.number().required('Dv é obrigatório.'),
    nome: yup.string().required('Nome é obrigatório.'),
    tipoContaCxBcoId: yup.number().required('Tipo da conta é obrigatório.'),
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
    nome: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a conta.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a conta.', life: 5000 });
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
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Conta' : 'Alterar Conta'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConta" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            id="banco"
                            classContainer="col-12 md:col-12"
                            v-model="formData.bancoId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Banco"
                            :service="BancoService"
                            placeholder="Selecione o banco"
                            :erros="errors.value?.bancoId"
                        />
                        <UWSeletor
                            id="agencia"
                            classContainer="col-12 md:col-12"
                            v-model="formData.agenciaId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            label="Agência"
                            :service="AgenciaService"
                            placeholder="Selecione a agência"
                            :columnsFilters="[{ field: 'banco', value: formData.bancoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'banco.id' }]"
                            :erros="errors.value?.agenciaId"
                        />
                        <UWInteger id="numero" label="Número" required autofocus v-model="formData.numero" :errors="errors.value?.numero" classContainer="col-12 md:col-3" />
                        <UWInput id="dv" label="DV" required v-model="formData.dv" :errors="errors.value?.dv" classContainer="col-12 md:col-2" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-7" />
                        <UWSeletor
                                    v-model="formData.tipoContaCxBcoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo da Conta"
                                    :service="TipoContaCxBcoService"
                                    placeholder="Selecione o tipo da conta"
                                    :erros="errors.value?.tipoContaCxBcoId"
                                    classContainer="col-12 md:col-12"
                                />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
