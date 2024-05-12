<script setup>
import { ref, computed } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { PlanoClassificacaoItemService } from '@/service';

const mascaraParaRegex = (mascara) => {
    return new RegExp(
        '^' +
            mascara
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escapa caracteres especiais
                .replace(/9/g, '\\d') // Substitui '9' por '\d' para números
                .replace(/#/g, '[\\d#]') + // Substitui '#' por '[\\d#]' para aceitar números e '#'
            '$'
    );
};

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    idRegistro: {
        type: Number,
        default: 0
    },
    idRegistroSuperior: {
        type: Number,
        default: 0
    }
});
const emit = defineEmits(['closeDialog']);

const formData = ref({});
const tiposConta = ref([
    { name: 'Analítica', value: false },
    { name: 'Sintética', value: true }
]);
const contaSuperior = ref();

const mascara = '99.99.999.999';

const getNivelConta = () => {
    return contaSuperior.value ? contaSuperior.value?.nivel + 1 : 1;
};

const getMascaraParaConta = () => {
    const nivelConta = getNivelConta();
    const pontos = mascara.split('.');
    let mascaraParaConta = '';

    for (let i = 0; i < nivelConta; i++) {
        if (i < pontos.length) {
            mascaraParaConta += pontos[i] + '.';
        }
    }

    return mascaraParaConta.slice(0, -1);
};

const createSchema = () => {
    return yup.object().shape({
        nome: yup.string().required('Nome é obrigatório.').max(120, 'Nome deve ter no máximo 120 caracteres.'),
        codigo: yup
            .string()
            .required('Código é obrigatório.')
            .max(30, 'Código deve ter no máximo 30 caracteres.')
            .matches(mascaraParaRegex(getMascaraParaConta()), 'Código inválido.'),
            // .test('is-raiz', 'Estrutura do código não compatível com conta superior.', (value) => {
            //     return value === '' || value.startsWith(formData.value?.contaSuperiorCodigo);
            // }),
        nivel: yup.number().required('Nível é obrigatório.'),
        sintetica: yup.boolean().required('Tipo de Conta é obrigatório.'),
        contaSuperiorId: formData.value.nivel > 1 ? yup.number().required('Conta Superior é obrigatória.') : yup.number().notRequired()
    });
};

const toast = useToast();

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const getHeaderDialog = () => {
    if (props.mode === 'novaConta') return 'Nova Conta';
    if (props.mode === 'novaSubConta') return 'Nova Conta Análitica';
    if (props.mpde === 'edit') return 'Alterar Conta';
};

const hideDialog = () => {
    emit('closeDialog');
};

const nivelConta = computed(() => {
    return getNivelConta();
});

const showModal = async () => {
    formData.value.codigo = '';
    formData.value.nome = null;
    formData.value.sintetica = true;
    formData.value.nivel = 1;
    formData.value.contaSuperiorId = null;
    if (props.mode === 'novaConta') {
        formData.value.id = null;
    } else if (props.mode === 'novaSubConta') {
        await PlanoClassificacaoItemService.getById(props.idRegistroSuperior).then((data) => {
            contaSuperior.value = { ...data };
            formData.value.contaSuperiorId = data.id;
            formData.value.contaSuperiorNome = data.nome;
            formData.value.contaSuperiorCodigo = data.codigo;
            formData.value.sintetica = false;
            formData.value.nivel = data.nivel + 1;
        });
    } else {
        await PlanoClassificacaoItemService.getById(props.idRegistro).then((data) => {
            _.assign(formData.value, data);
        });
    }
};

const salvarRegistro = async () => {
    if (props.mode === 'novaConta' || props.mode === 'novaSubConta') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    PlanoClassificacaoItemService.create(formData.value)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a conta.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.value.id = props.idRegistro;
    PlanoClassificacaoItemService.update(formData.value)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a conta.', life: 5000 });
        });
};
</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '40%' }" :header="getHeaderDialog()" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="createSchema()" :values="formData" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Identificação da Conta" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12">
                                    <UWFieldSet title="Conta Superior" class="h-full" color="var(--green-100)" v-if="mode === 'novaSubConta'">
                                        <div class="field col-12">
                                            <div class="p-fluid formgrid grid">
                                                <UWInput id="codigoSuperior" disabled v-model="formData.contaSuperiorCodigo" classContainer="col-12 md:col-3" />
                                                <UWInput id="nomeSuperior" disabled v-model="formData.contaSuperiorNome" classContainer="col-12 md:col-9" />
                                            </div>
                                        </div>
                                    </UWFieldSet>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <div class="p-inputgroup">
                                        <div class="p-float-label">
                                            <InputMask id="codigo" :mask="getMascaraParaConta()" label="Código" required v-model="formData.codigo" :class="{ 'w-full': true, 'p-invalid': errors.value?.codigo }" />
                                            <label for="codigo" v-required="required">Código</label>
                                        </div>
                                        <Button icon="pi pi-bolt" severity="help" @click.stop="getLista()" />
                                    </div>
                                    <span v-if="errors.value?.codigo">
                                        <span v-for="(error, index) of errors.value?.codigo" :key="index">
                                            <small class="p-error">{{ error }}</small>
                                        </span>
                                    </span>
                                </div>
                                <!-- <UWInputMask id="codigo" mask="99" label="Código" required v-model="formData.codigo" :errors="errors.value?.nome" classContainer="col-12 md:col-9" /> -->
                                <UWInput id="nome" label="Nome da Conta" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-9" />
                                <UWInput id="nivel" label="Nível" disabled v-model="nivelConta" classContainer="col-12 md:col-3" />
                                <UWPickList
                                    id="tipoConta"
                                    disabled
                                    label="Tipo da Conta"
                                    v-model="formData.sintetica"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="tiposConta"
                                    :errors="errors.value?.sintetica"
                                    classContainer="col-12 md:col-4"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
