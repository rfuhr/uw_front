<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { CertificadoService as Service, EmpresaService, TiposService } from '@/service';

const schema = yup.object().shape({
    empresaId: yup.number().required('Empresa é obrigatório.'),
    tipoCertificado: yup.string().required('Tipo de certificado é obrigatório ser informado.'),
    senha: yup.string().required('Senha é obrigatória ser informada.'),
    dataValidade: yup.date().required('Data de Validade é obrigatório.'),
    // nomeArquivo: yup.string().required('Arquivo é obrigatório ser informado.'),
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
const tiposCertificados = ref([]);
const fileInput = ref(null);
const arquivo = ref();

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
    const formPost = new FormData();
    formPost.append('file', arquivo.value);
    formPost.append('dadosRequest', JSON.stringify(formData));

    Service.upload(formPost)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Certificado criado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o certificado.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Certificado alterado com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o certificado.', life: 5000 });
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

onMounted(async () => {
    TiposService.getTipoCertificado().then((data) => {
        tiposCertificados.value = data;
    });
});

const handleFileChange = (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        arquivo.value = files[0];
        // formData.nomeArquivo = files[0].name;
      }
    };

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="mode === 'create' ? 'Novo Certificado' : 'Alterar Certificado'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formCertificado" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWSeletor classContainer="col-12 col-md-12" v-model="formData.empresaId" label="Empresa" optionLabel="nome" optionValue="id" :service="EmpresaService" placeholder="Selecione a empresa" :erros="errors.value?.empresaId" />
                        <UWPickList
                            id="tipoCertificado"
                            label="Tipo de Certificado"
                            v-model="formData.tipoCertificado"
                            optionLabel="name"
                            optionValue="value"
                            :options="tiposCertificados"
                            classContainer="col-12 md:col-4"
                            :errors="errors.value?.tipoCertificado"
                        />
                        <UWInput id="senha" label="Senha" required v-model="formData.senha" :errors="errors.value?.senha" classContainer="col-12 md:col-4" />
                        <UWCalendar id="dataValidade" label="Data de Validade" required v-model="formData.dataValidade" :errors="errors.value?.dataValidade" classContainer="col-12 md:col-4" />
                        <div class="field col-12">
                            <span>
                                <InputText ref="fileInput" id="arquivo" type="file" :class="{ 'w-full': true, 'p-invalid': errors.value?.arquivo }" @input="handleFileChange" />
                            </span>
                            <span v-if="errors.value?.nomeArquivo">
                                <span v-for="(error, index) of errors.value?.nomeArquivo" :key="index">
                                    <small class="p-error">{{ error }}</small>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <code>{{ formData }}</code>
            </template>
        </UWForm>
    </Dialog>
</template>
