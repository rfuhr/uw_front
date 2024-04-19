<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { FormWizard, TabContent } from 'vue3-form-wizard';
import IdentificacaoNFe from '@/views/fiscal/nfe/IdentificacaoNFe.vue';
import DestinatarioNFe from './DestinatarioNFe.vue';
import ProdutosNFe from './ProdutosNFe.vue';
import TotalizadoresNFe from './TotalizadoresNFe.vue';
import TransporteNFe from './TransporteNFe.vue';
import FinanceiroNFe from './FinanceiroNFe.vue';
import ResumoNFe from './ResumoNFe.vue';
import InformacoesAdicionaisNFe from './InformacoesAdicionaisNFe.vue';
import { useContexto } from '@/stores';
import { ConfigEmpresaService } from '@/service';

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
        autorizacoes: [],
        departamento: {}
    },
    destinatario: {
        outroLocalEntrega: false,
        localEntrega: {},
        dadosParceiroLocal: {}
    },
    itensNFe: {
        itens: []
    }, 
    transporte: {
        reboques: [],
        volumes: [],
        lacres: []
    },
    financeiro: {
        pagamentos: []
    }
});
const identificacaoNFe = ref(null);
const destinatarioNFe = ref(null);
const produtosNFe = ref(null);
const transporteNFe = ref(null);
const financeiroNFe = ref(null);

const configEmpresaNFe = ref(null);

function onComplete() {
    alert('Yay. Done!');
}

const onCancelar = async () => {
    const result = await Swal.fire({
        title: 'Você confirma a desistência da emissão da NF-e?',
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

const beforeChangeTransporte = async () => {
    return validTransporteNFe();
};

const validTransporteNFe = () => {
    if (transporteNFe.value) {
        return transporteNFe.value.validateForm();
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

const beforeChangeFinanceiro = async () => {
    return validFinanceiroNFe();
};

const validFinanceiroNFe = () => {
    if (financeiroNFe.value) {
        return financeiroNFe.value.validateForm();
    } else {
        return true;
    }
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
            <template #custom-buttons-right>
                <Button type="button" class="p-button-danger mr-6" outlined @click="onCancelar">Cancelar emissão</Button>
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
            <TabContent title="Totalizadores" icon="fa fa-list-ol"> 
                <TotalizadoresNFe v-model="formData.itensNFe"/>
            </TabContent>
            <TabContent title="Informações do Transporte" icon="fa fa-truck" :before-change="beforeChangeTransporte"> 
                <TransporteNFe ref="transporteNFe" v-model="formData.transporte"/>    
            </TabContent>
            <TabContent title="Dados do Faturamento" icon="fa fa-wallet" :before-change="beforeChangeFinanceiro"> 
                <FinanceiroNFe ref="financeiroNFe" v-model="formData.financeiro"/>    
            </TabContent>
            <TabContent title="Informações Adicionais" icon="fa fa-info"> 
                <InformacoesAdicionaisNFe v-model="formData.informacoesAdicionais"/>    
            </TabContent>
            <TabContent title="Finalizar" icon="fa fa-envelope-circle-check"> 
                <ResumoNFe v-model="formData"/>    
            </TabContent>
        </FormWizard>
    </UWPageBase>
</template>

<style></style>
