<script setup>
import { ref, reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { useContexto } from '@/stores';
import { ConfigAutorizacaoSolicitacaoMercadoriaService as Service, EmpresaService, EmpresaFilialService, DepartamentoService, GrupoContabilService, UsuarioService } from '@/service';

const formData = reactive({
    empresaId: undefined,
    empresaFilialId: undefined,
    departamentoId: undefined,
    grupoContabilId: undefined
});

const schema = yup.object().shape({
    empresaId: yup.number().required('Empresa é obrigatória'),
    empresaFilialId: yup.number().required('Filial é obrigatória'),
    departamentoId: yup.number().required('Departamento é obrigatório'),
    grupoContabilId: yup.number().required('Grupo Contábil é obrigatório'),
    autorizadoresId: yup
            .array()
            .min(1, 'Deve ser informado pelo menos 1 autorizador')
            .required('Obrigatório informar autorizador')
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
const contextoStore = useContexto();
const empresaFilialSelecionada = ref();

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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a configuração.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a configuração.', life: 5000 });
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
        formData.empresaId = contextoStore.contexto.empresaId;
        formData.empresaFilialId = contextoStore.contexto.empresaFilialId;
        formData.departamentoId = undefined;
        formData.grupoContabilId = undefined;
        formData.autorizadoresId = [];
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const changeEmpresaFilial = (empresaFilial) => {
    if (empresaFilial) {
        formData.departamentoId = undefined;
        empresaFilialSelecionada.value = empresaFilial;
    } else {
        formData.departamentoId = undefined;
        formData.grupoContabilId = undefined;
        empresaFilialSelecionada.value = undefined;
    }
};

</script>

<template>
    <Dialog
        v-model:visible="showDialogComputed"
        :style="{ width: '60%' }"
        :header="mode === 'create' ? 'Nova Configuração de Autorização para Solicitação' : 'Alterar Configuração de Autorização para Solicitação'"
        :modal="true"
        :closable="false"
        @show="showModal"
    >
        <UWForm :schema="schema" :values="formData" ref="formConfigAutorizacaoSolicitacao" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWFieldSet title="Configuração" class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    id="empresa"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.empresaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Empresa"
                                    :service="EmpresaService"
                                    placeholder="Selecione a empresa"
                                    :erros="errors.value?.empresaId"
                                />    
                                <UWSeletor
                                    id="empresaFilial"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.empresaFilialId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Filial"
                                    :service="EmpresaFilialService"
                                    :noShowGeneral="false"
                                    placeholder="Selecione a filial"
                                    :erros="errors.value?.empresaFilialId"
                                    :columnsFilters="[{ field: 'empresa', value: formData.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                    @changeObject="changeEmpresaFilial"
                                />
                                <UWSeletor
                                    id="departamento"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    :noShowGeneral="false"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />    
                                <UWSeletor
                                    id="grupoContabil"
                                    classContainer="col-12 md:col-6"
                                    v-model="formData.grupoContabilId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Grupo Contábil"
                                    :service="GrupoContabilService"
                                    :noShowGeneral="false"
                                    placeholder="Selecione o grupo contábil"
                                    :erros="errors.value?.grupoContabilId"
                                />   
                                <UWMultiSeletor
                                    classContainer="col-12 md:col-12"
                                    v-model="formData.autorizadoresId"
                                    label="Autorizadores"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    :service="UsuarioService"
                                    placeholder="Selecione o usuário"
                                    :erros="errors.value?.autorizadoresId"
                                />                                                  
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
