<script setup>
import { ref, reactive, onMounted } from 'vue';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { FormWizard, TabContent } from 'vue3-form-wizard';
import 'vue3-form-wizard/dist/style.css';
import IdentificacaoNFe from '@/views/fiscal/nfe/IdentificacaoNFe.vue';
import DestinatarioNFe from './DestinatarioNFe.vue';
import ProdutosNFe from './ProdutosNFe.vue';
import { useValidationsSchemaNFe } from './useValidationsSchemaNFe';
import { ConfigEmpresaService } from '@/service';
import { useContexto } from '@/stores';

const contextoStore = useContexto();

const router = useRouter();

const formData = reactive({
    identificacaoNFe: {
        dataHoraEmissao: new Date(),
        dataHoraSaidaEntrada: new Date(),
        modelo: 55,
        possuiDocumentoReferenciado: false,
        outroLocalRetirada: false,
        documentosReferenciados: []
    },
    itensNFe: []
});

const createSchemaIdentificacaoNFe = (dynamicFields) => {
    const schemaObject = {
        emitenteId: yup.string().required('Emitente é obrigatório.'),
        operacaoInternaId: yup.string().required('Operação Interna é obrigatória.')
    };
    Object.assign(schemaObject, dynamicFields);
    return yup.object().shape(schemaObject);
};

const createSchema = () => {
    const { createSchemaDataHoraSaidaEntrada } = useValidationsSchemaNFe(formData);

    return yup.object().shape({
        identificacaoNFe: createSchemaIdentificacaoNFe({
            dataHoraSaidaEntrada: createSchemaDataHoraSaidaEntrada(formData)
            // Adicione aqui outros campos dinâmicos, se necessário
        })
    });
};

const formNovaNFe = ref(null);
const configEmpresaNFe = ref(null);

function onComplete() {
    alert('Yay. Done!');
}

const onCancelar = async () => {
    const result = await Swal.fire({
        title: 'Você confirma a desistência da emissão da nfe?',
        text: 'Os dados preenchidos serão perdidos.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true
    });

    if (result.value) {
        router.push({ path: '/fiscal/gerenciador-nfe' });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
    } else {
        Swal.fire('Falha', 'Ocorreu uma falha no processo de desistência de emissão de nfe', 'error');
        return false;
    }
};

const validForm = () => {
      if (formNovaNFe.value) {
        return formNovaNFe.value.validateForm();
      } else {
        return true;
      }
    }

const beforeChangeIdentificacao = async () => {
    return validForm();
};

onMounted(async () => {
    ConfigEmpresaService.getConfigNFe(contextoStore.contexto.empresaFilialId).then((data) => {
        configEmpresaNFe.value = data;
        formData.identificacaoNFe.serie = data.serie
        formData.identificacaoNFe.tipoEmissao = data.tipoEmissao
    });
});

</script>

<template>
    <UWPageBase title="Emissão de NFe" subtitle="Para emissão da nfe, seguir as etapas.">
        <UWForm :schema="createSchema()" :values="formData" ref="formNovaNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <FormWizard @on-complete="onComplete" color="#094899" step-size="xs" nextButtonText="Próximo" backButtonText="Anterior" finishButtonText="Enviar NFe">
                    <template #custom-buttons-left>
                        <Button type="button" class="p-button-danger ml-6" @click="onCancelar">Cancelar emissão</Button>
                    </template>
                    <TabContent title="Identificação da Nota Final" icon="fa fa-file-invoice" :before-change="beforeChangeIdentificacao">
                        <IdentificacaoNFe v-model="formData.identificacaoNFe" :errors="errors" />
                    </TabContent>
                    <TabContent title="Destinatário" icon="fa fa-handshake">
                        <DestinatarioNFe />
                    </TabContent>
                    <TabContent title="Produtos" icon="fa fa-barcode">
                        <ProdutosNFe v-model="formData.itensNFe" />
                    </TabContent>
                    <TabContent title="Totalizadores" icon="fa fa-list-ol"> Yuhuuu! This seems pretty damn simple </TabContent>
                    <TabContent title="Informações do Transporte" icon="fa fa-truck"> Yuhuuu! This seems pretty damn simple </TabContent>
                    <TabContent title="Dados do Faturamento" icon="fa fa-wallet"> Yuhuuu! This seems pretty damn simple </TabContent>
                    <TabContent title="Informações Adicionais" icon="fa fa-info"> Yuhuuu! This seems pretty damn simple </TabContent>
                    <TabContent title="Finalizar" icon="fa fa-envelope-circle-check"> Yuhuuu! This seems pretty damn simple </TabContent>
                </FormWizard>
            </template>
        </UWForm>
    </UWPageBase>
</template>

<style>

</style>
