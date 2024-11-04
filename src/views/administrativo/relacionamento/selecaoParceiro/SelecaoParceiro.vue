<script setup>
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { ParceiroLocalService } from '@/service';
const props = defineProps({
    visible: Boolean
});
const emit = defineEmits(['doVoltar']);

const createSchema = () => {
    return yup.object().shape({
        parceiroLocalId: yup.string().required('Parceiro é obrigatório ser selecionado')
    });
};

const { formatDocumento } = useFormatDocumentos();

const formData = ref({
    parceiroLocalId: '',
    dadosParceiroLocal: {}
});

const visibleDialog = ref(false);

const handleVoltar = () => {
    emit('doVoltar');
};

const confirmarParceiro = () => {
    visibleDialog.value = false;
    emit('doConfirmar', formData.value);
};

watch(
    () => props.visible,
    (value) => {
        visibleDialog.value = value;
    }
);

const changeParceiroLocal = (object) => {
    if (!object) {
        formData.value.dadosParceiroLocal = {};
        return;
    }

    ParceiroLocalService.getById(object.id).then((data) => {
        formData.value.dadosParceiroLocal = data;
        formData.value.dadosParceiroLocal.tipoPessoa = formData.value.dadosParceiroLocal.cpfCnpj.length === 11 ? 'J' : 'F';
        formData.value.dadosParceiroLocal.cpfCnpjFormatado = formatDocumento(formData.value.dadosParceiroLocal.cpfCnpj);
        if (formData.value.dadosParceiroLocal.enderecos) {
            formData.value.dadosParceiroLocal.enderecoCompleto = getEnderecoCompleto(formData.value.dadosParceiroLocal.enderecos[0]);
        }
    });
};

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const handleShow = () => {
    formData.value = {
        parceiroLocalId: '',
        dadosParceiroLocal: {}
    };
};

</script>

<template>
    <Dialog v-model:visible="visibleDialog" :style="{ width: '40%' }" header="Seleção de Parceiro" :modal="true" :closable="false" @show="handleShow">
        <UWForm :schema="createSchema()" :values="formData" visibleVoltar visibleConfirmar :visibleSave="false" :visibleCancel="false" @doVoltar="handleVoltar()" @doSubmit="confirmarParceiro">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Seleção do Parceiro" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWParceiroLocal id="parceiroLocal" classContainer="col-12 md:col-12" v-model="formData.parceiroLocalId" required label="Parceiro" :erros="errors.value?.parceiroLocalId" @changeObject="changeParceiroLocal" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Dados do Parceiro" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="cpfCnpj" :label="formData.dadosParceiroLocal.tipoPessoa === 'J' ? 'Cnpj' : 'Cpf'" uppercase disabled v-model="formData.dadosParceiroLocal.cpfCnpjFormatado" classContainer="col-12 md:col-4" />
                                <UWInput v-if="formData.dadosParceiroLocal.tipoPessoa === 'J'" id="nomeLocal" label="Filial" uppercase disabled v-model="formData.dadosParceiroLocal.nomeLocal" classContainer="col-12 md:col-8" />
                                <UWInput
                                    id="endereco"
                                    label="Endereço"
                                    uppercase
                                    disabled
                                    v-model="formData.dadosParceiroLocal.enderecoCompleto"
                                    classContainer="col-12"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
