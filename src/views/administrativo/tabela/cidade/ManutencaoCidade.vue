<script setup>
import { reactive, computed, defineProps } from 'vue';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import _ from 'lodash';
import { CidadeService, PaisService, UfService } from '@/service';
import UWForm from '@/components/layout/UWForm.vue';

const schema = yup.object().shape({
    id: yup.number().optional(),
    codigoIBGE: yup.number().required('Código do IBGE é obrigatório.'),
    nome: yup.string().required('Nome é obrigatória.').max(120, 'Nome deve ter no máximo 80 caracteres.'),
    pais: yup.object().shape({
        id: yup.number().required('País é obrigatório.')
    }),
    uf: yup.object().shape({
        id: yup.number().required('UF é obrigatória.')
    }),
    latitude: yup.number().optional().min(-90, 'Latitude deve ser maior ou igual a -90.').max(90, 'Latitude deve ser menor ou igual a 90.'),
    longitude: yup.number().optional().min(-180, 'Longitude deve ser maior ou igual a -180.').max(180, 'Longitude deve ser menor ou igual a 180.'),
    capital: yup.boolean().optional().default(false),
    siglaUF: yup.string().optional(),
    siglaPais: yup.string().optional()
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
    codigoIBGE: undefined,
    nome: undefined,
    pais: {
        id: undefined
    },
    uf: {
        id: undefined
    },
    latitude: undefined,
    longitude: undefined,
    capital: false
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
    CidadeService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cidade criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a cidade.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    delete formData.siglaPais;
    delete formData.siglaUF;
    CidadeService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cidade alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a cidade.', life: 5000 });
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
        formData.nome = undefined
    } else {
        await CidadeService.getById(props.id).then((data) => {
            delete data.siglaPais;
            delete data.siglaUf;
            _.assign(formData, data);
        });
    }
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Nova Cidade' : 'Alterar Cidade'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigoIBGE" label="Cód. IBGE" required autofocus v-model="formData.codigoIBGE" :errors="errors.value?.codigoIBGE" classContainer="col-12 md:col-4" />
                        <UWInput id="nome" label="Nome" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-4" />
                    </div>
                    <div class="p-fluid grid">
                        <div class="field col-12 md:col-12">
                            <UWSeletor id="seletorPais" label="País" v-model="formData.pais.id" :required="true" optionLabel="nome" optionValue="id" placeholder="Selecione o país" :service="PaisService" :erros="errors.value['pais.id']" />
                        </div>
                    </div>
                    <div class="p-fluid grid">
                        <div class="field col-12 md:col-12">
                            <UWSeletor id="seletorUf" label="UF" v-model="formData.uf.id" :required="true" optionLabel="nome" optionValue="id" placeholder="Selecione a UF" :service="UfService" :erros="errors.value['uf.id']" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <UWInput id="latitude" label="Latitude" v-model="formData.latitude" :errors="errors.value?.latitude" classContainer="col-12 md:col-4" />
                        <UWInput id="longitude" label="Longitude"  v-model="formData.longitude" :errors="errors.value?.longitude" classContainer="col-12 md:col-4" />
                    </div>
                    <div class="p-fluid grid">
                        <div class="col-12 md:col-4">
                            <div class="field-checkbox">
                                <Checkbox id="capital" v-model="formData.capital" :binary="true" />
                                <label for="capital">Capital</label>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
