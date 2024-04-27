<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { SituacaoTributariaService as Service, TiposService } from '@/service';

const schema = yup.object().shape({
    nome: yup.string().required('Nome é obrigatório.').max(2000, 'Nome deve ter no máximo 4000 caracteres.'),
    codigo: yup.number().required('Código é obrigatório.'),
    tipoTributo: yup.string().required('Tipo de Tributo é obrigatório.'),
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

const tiposTributos = ref();

const formData = reactive({
    nome: undefined,
    codigo: undefined
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
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Situação Tributária criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Situação Tributária.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Situação Tributária alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Situação Tributária.', life: 5000 });
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
        formData.tipoTributo = undefined;
        formData.simplesNacional = false;
        formData.aliquotaZero = false;
        formData.requerMensagemFiscal = false;
        formData.destacaStSaida = false;
	    formData.destacaIcmsDesonerada = false;
	    formData.controlaImpostoRetido = false;
	    formData.destacaIcms = false;
	    formData.excluirIcmsBcPiscofins = false;
	    formData.naoExcluirIcmsEntrada = false;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

onMounted(async () => {
    await TiposService.getTipoTributo().then((data) => {
        tiposTributos.value = data;
    });
});

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '70%' }" :header="mode === 'create' ? 'Nova Situação Tributária' : 'Alterar Situação Tributária'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formSituacaoTributaria" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="codigo" label="Código" required autofocus v-model="formData.codigo" :errors="errors.value?.codigo" classContainer="col-12 md:col-4" />
                        <UWTextArea id="nome" label="Nome" rows="5" required v-model="formData.nome" :errors="errors.value?.nome" classContainer="col-12 md:col-12" />
                        <UWPickList id="tipoTributo" label="Tipo Tributo" v-model="formData.tipoTributo" optionLabel="name" optionValue="value" required :options="tiposTributos" classContainer="col-12 md:col-4" />
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.aliquotaZero"
                                        onLabel="Alíquota Zero"
                                        offLabel="Alíquota MAIOR que Zero"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.aliquotaZero, 'bg-red-100 border-white': !formData.aliquotaZero }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.controlaImpostoRetido"
                                        onLabel="Controla Imposto Retido"
                                        offLabel="NÃO Controla Imposto Retido"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.controlaImpostoRetido, 'bg-red-100 border-white': !formData.controlaImpostoRetido }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-6 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.destacaStSaida"
                                        onLabel="Destaca Substituição Tributária de Saída"
                                        offLabel="NÃO Destaca Substituição Tributária de Saída"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.destacaStSaida, 'bg-red-100 border-white': !formData.destacaStSaida }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-6 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.excluirIcmsBcPiscofins"
                                        onLabel="Excluir ICMS da Base Cálculo PIS COFINS"
                                        offLabel="NÃO Excluir ICMS da Base Cálculo PIS COFINS"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.excluirIcmsBcPiscofins, 'bg-red-100 border-white': !formData.excluirIcmsBcPiscofins }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.destacaIcms"
                                        onLabel="Destaca ICMS"
                                        offLabel="NÃO Destaca ICMS"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.destacaIcms, 'bg-red-100 border-white': !formData.destacaIcms }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>                        
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.destacaIcmsDesonerada"
                                        onLabel="Destaca ICMS Desonerada"
                                        offLabel="NÃO Destaca ICMS Desonerada"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.destacaIcmsDesonerada, 'bg-red-100 border-white': !formData.destacaIcmsDesonerada }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.naoExcluirIcmsEntrada"
                                        onLabel="NÃO Excluir ICMS da Entrada"
                                        offLabel="Excluir ICMS da Entrada"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.naoExcluirIcmsEntrada, 'bg-red-100 border-white': !formData.naoExcluirIcmsEntrada }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.requerMensagemFiscal"
                                        onLabel="Requer Mensagem Fiscal"
                                        offLabel="NÃO Requer Mensagem Fiscal"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.requerMensagemFiscal, 'bg-red-100 border-white': !formData.requerMensagemFiscal }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                        <div class="field md:col-4 pt-0">
                                <span class="p-float-label">
                                    <ToggleButton
                                        v-model="formData.simplesNacional"
                                        onLabel="Simples Nacional"
                                        offLabel="NÃO é Simples Nacional"
                                        onIcon="pi pi-lock"
                                        offIcon="pi pi-lock-open"
                                        class="w-full"
                                        aria-label="Do you confirm"
                                        :pt="{
                                            root: {
                                                class: [{ 'h-full': true, 'bg-green-100 border-white': formData.simplesNacional, 'bg-red-100 border-white': !formData.simplesNacional }]
                                            }
                                        }"
                                    />
                                </span>
                        </div>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
