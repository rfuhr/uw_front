<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { useContexto } from '@/stores';
import { ValidaDepartamentoGrupoContabilService as Service, DepartamentoService, GrupoContabilService } from '@/service';

const formData = reactive({
    departamentoId: undefined,
    grupoContabilId: undefined,
    controlaEstoque: true
});
const schema = yup.object().shape({
    departamentoId: yup.number().required('Departamento é obrigatório'),
    grupoContabilId: yup.number().required('Grupo contábil é obrigatório')
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

const contextoStore = useContexto();
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
        formData.departamentoId = undefined;
        formData.grupoContabilId = undefined;
        formData.controlaEstoque = false;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Validação' : 'Alterar Validação'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formValidacaoDepartamentoGrupoContabil" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor
                            id="departamento"
                            classContainer="col-12 md:col-12"
                            v-model="formData.departamentoId"
                            optionLabel="nome"
                            optionValue="id"
                            label="Departamento"
                            required
                            :service="DepartamentoService"
                            :selecaoAutomatica="false"
                            placeholder="Selecione o departamento"
                            :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                        />
                        <UWSeletor
                            label="Grupo Contábil"
                            classContainer="col-12 md:col-12"
                            v-model="formData.grupoContabilId"
                            optionLabel="nome"
                            optionValue="id"
                            required
                            :service="GrupoContabilService"
                            :selecaoAutomatica="false"
                            placeholder="Selecione o grupo contábil"
                        />
                        <UWToggleButton
                            id="controlaEstoque"
                            classContainer="col-12 md:col-4"
                            v-model="formData.controlaEstoque"
                            onLabel="Controla estoque"
                            offLabel="Não controla estoque"
                            onIcon="pi pi-thumbs-up"
                            offIcon="pi pi-thumbs-down"
                        /> 
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
