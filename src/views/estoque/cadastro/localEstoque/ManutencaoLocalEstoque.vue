<script setup>
import { ref, reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { useContexto } from '@/stores';
import { LocalEstoqueService as Service, TipoLocalEstoqueService, EmpresaFilialService } from '@/service';

const contextoStore = useContexto();

const seletorFilial = ref(null);

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
    codigo: yup.number().required('Código é obrigatório.'),
    tipoLocalEstoqueId: yup.number().required('Tipo de Local do Estoque é obrigatório.'),
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
    nome: undefined,
    codigo: undefined,
    tipoLocalEstoqueId: undefined,
    filialEspecifica: false,
    empresaFilialId: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Local do Estoque criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o Local do Estoque.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Local do Estoque alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o Local do Estoque.', life: 5000 });
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
        formData.tipoLocalEstoqueId = undefined;
        formData.filialEspecifica = false;
        formData.empresaFilialId = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
            if (!formData.filialEspecifica) {
                formData.empresaFilialId = undefined;
                seletorFilial.value.reload(formData.empresaFilialId);
            }
        });
    }
};

const changeFilialEspecifica = async () => {
    if (!formData.filialEspecifica) {
        formData.empresaFilialId = undefined;
    }
    seletorFilial.value.reload(formData.empresaFilialId);
}

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Local do Estoque' : 'Alterar Local do Estoque'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formLocalEstoque" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-4" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                        <UWSeletor
                                classContainer="col-12 md:col-12"
                                v-model="formData.tipoLocalEstoqueId"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="Tipo de Local do Estoque"
                                :service="TipoLocalEstoqueService"
                                placeholder="Selecione o Tipo de Local do Estoque"
                                :erros="errors?.value?.tipoLocalEstoqueId"
                        />
                        <div class="field md:col-4 pt-0">
                            <span class="p-float-label">
                                <ToggleButton
                                    v-model="formData.filialEspecifica"
                                    onLabel="Filial Específica"
                                    offLabel="SEM Filial Específica"
                                    onIcon="pi pi-lock"
                                    offIcon="pi pi-lock-open"
                                    class="w-full"
                                    aria-label="Do you confirm"
                                    @change="changeFilialEspecifica"
                                    :pt="{
                                        root: {
                                            class: [{ 'h-full': true, 'bg-green-100 border-white': formData.filialEspecifica, 'bg-red-100 border-white': !formData.filialEspecifica }]
                                        }
                                    }"
                                />
                            </span>
                        </div>  
                        <UWSeletor
                                ref="seletorFilial"
                                id="seletorFilial"
                                label="Filial"
                                classContainer="col-12 md:col-8"
                                v-model="formData.empresaFilialId"
                                optionLabel="nome"
                                optionValue="id"
                                :service="EmpresaFilialService"
                                :disabled="!formData.filialEspecifica"
                                placeholder="Selecione a Filial"
                                :columnsFilters="[{ field: 'empresa', value: contextoStore.contexto.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                            />                                                       
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
