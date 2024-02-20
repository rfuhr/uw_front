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
	    formData.exigeAliquotaDesonerada = false;
	    formData.controlaImpostoRetido = false;
	    formData.excluirIcmsBaseCalculo = false;
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
                        <UWCheckBox id="aliquotaZero" label="Alíquota Zero" required v-model="formData.aliquotaZero" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="controlaImpostoRetido" label="Controla Imposto Retido" required v-model="formData.controlaImpostoRetido" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="destacaStSaida" label="Destaca Substituição Tributária de Saída" required v-model="formData.destacaStSaida" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="excluirIcmsBaseCalculo" label="Excluir ICMS da Base Cálculo" required v-model="formData.excluirIcmsBaseCalculo" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="excluirIcmsBcPiscofins" label="Excluir ICMS da Base Cálculo PIS COFINS" required v-model="formData.excluirIcmsBcPiscofins" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="exigeAliquotaDesonerada" label="Exige Alíquota Desonerada" required v-model="formData.exigeAliquotaDesonerada" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="naoExcluirIcmsEntrada" label="Não Excluir ICMS da Entrada" required v-model="formData.naoExcluirIcmsEntrada" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="requerMensagemFiscal" label="Requer Mensagem Fiscal" required v-model="formData.requerMensagemFiscal" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                        <UWCheckBox id="simplesNacional" label="Simples Nacional" required v-model="formData.simplesNacional" :errors="errors.value?.nome" classContainer="col-12 md:col-3" />
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
