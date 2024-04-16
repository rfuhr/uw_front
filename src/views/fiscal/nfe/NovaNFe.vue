<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { FormWizard, TabContent } from 'vue3-form-wizard';
import 'vue3-form-wizard/dist/style.css';
import IdentificacaoNFe from '@/views/fiscal/nfe/IdentificacaoNFe.vue';
import DestinatarioNFe from './DestinatarioNFe.vue';
import ProdutosNFe from './ProdutosNFe.vue';
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
        documentosReferenciados: [],
        localRetirada: {},
        autorizarObterXml: false,
        autorizacoes: []
    },
    destinatario: {
        outroLocalEntrega: false,
        localEntrega: {}
    },
    itensNFe: {
        itens: []
    }
});
const identificacaoNFe = ref(null);
const destinatarioNFe = ref(null);
const produtosNFe = ref(null);

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

const validFormIdentificacaoNFe = () => {
    if (identificacaoNFe.value) {
        return identificacaoNFe.value.validateForm();
    } else {
        return true;
    }
};

const beforeChangeIdentificacao = async () => {
    return validFormIdentificacaoNFe();
};


const validDestinatarioNFe = () => {
    if (destinatarioNFe.value) {
        return destinatarioNFe.value.validateForm();
    } else {
        return true;
    }
};

const beforeChangeDestinatario = async () => {
    return validDestinatarioNFe();
};

const validProdutosNFe = () => {
    if (produtosNFe.value) {
        return produtosNFe.value.validateForm();
    } else {
        return true;
    }
};

const beforeChangeProdutos = async () => {
    return validProdutosNFe();
};

onMounted(async () => {
    ConfigEmpresaService.getConfigNFe(contextoStore.contexto.empresaFilialId).then((data) => {
        configEmpresaNFe.value = data;
        formData.identificacaoNFe.serie = data.serie;
        formData.identificacaoNFe.tipoEmissao = data.tipoEmissao;
    });
});

const dadosAuxiliaresItem = computed(() => {
    return {
        emitenteId: formData.identificacaoNFe.emitenteId, 
        parceiroLocalEnderecoIdDestino: formData.destinatario.enderecoId,
        indicadorOperacaoValue: formData.identificacaoNFe.indicadorOperacao,
        cfopId: formData.identificacaoNFe.cfopId,
        operacaoInternaId: formData.identificacaoNFe.operacaoInternaId,
        dataHoraEmissao: formData.identificacaoNFe.dataHoraEmissao,
    };
});

</script>

<template>
    <UWPageBase title="Emissão de NFe" subtitle="Para emissão da nfe, seguir as etapas.">
        <FormWizard @on-complete="onComplete" color="#094899" step-size="xs" nextButtonText="Próximo" backButtonText="Anterior" finishButtonText="Enviar NFe">
            <template #custom-buttons-left>
                <Button type="button" class="p-button-danger ml-6" @click="onCancelar">Cancelar emissão</Button>
            </template>
            <TabContent title="Identificação da Nota Final" icon="fa fa-file-invoice" :before-change="beforeChangeIdentificacao">
                <IdentificacaoNFe ref="identificacaoNFe" v-model="formData.identificacaoNFe"  />
            </TabContent>
            <TabContent title="Destinatário" icon="fa fa-handshake" :before-change="beforeChangeDestinatario">
                <DestinatarioNFe ref="destinatarioNFe" v-model="formData.destinatario"  />
            </TabContent>
            <TabContent title="Produtos" icon="fa fa-barcode" :before-change="beforeChangeProdutos">
                <ProdutosNFe ref="produtosNFe" v-model="formData.itensNFe" :dadosAuxiliares="dadosAuxiliaresItem"/>
            </TabContent>
            <TabContent title="Totalizadores" icon="fa fa-list-ol"> Yuhuuu! This seems pretty damn simple </TabContent>
            <TabContent title="Informações do Transporte" icon="fa fa-truck"> Yuhuuu! This seems pretty damn simple </TabContent>
            <TabContent title="Dados do Faturamento" icon="fa fa-wallet"> Yuhuuu! This seems pretty damn simple </TabContent>
            <TabContent title="Informações Adicionais" icon="fa fa-info"> Yuhuuu! This seems pretty damn simple </TabContent>
            <TabContent title="Finalizar" icon="fa fa-envelope-circle-check"> Yuhuuu! This seems pretty damn simple </TabContent>
        </FormWizard>
    </UWPageBase>
</template>

<style></style>
