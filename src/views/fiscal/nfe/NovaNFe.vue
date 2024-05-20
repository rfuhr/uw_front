<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import _ from 'lodash'
import 'vue3-form-wizard/dist/style.css';
import Swal from 'sweetalert2';
import { useRoute, useRouter } from 'vue-router';
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
import { NFeService } from '@/service';
import { useFormatDate } from '@/composables/useFormatDate';

const contextoStore = useContexto();
const { formatToUTC } = useFormatDate();

const router = useRouter();
const route = useRoute();

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
        departamento: {},
        enderecoEmitente: {}
    },
    destinatario: {
        outroLocalEntrega: false,
        localEntrega: {},
        dadosParceiroLocal: {},
        endereco: {}
    },
    itensNFe: {
        itens: []
    },
    transporte: {
        reboques: [],
        volumes: [],
    },
    financeiro: {
        pagamentos: []
    },
    informacoesAdicionais: {}
});
const nfeId = ref(0);
const identificacaoNFe = ref(null);
const destinatarioNFe = ref(null);
const produtosNFe = ref(null);
const transporteNFe = ref(null);
const financeiroNFe = ref(null);
const enviandoNfe = ref(false);

const actionsFinalizar = [
    { label: 'Salvar e Sair', icon: 'pi pi-times', command: () => salvarSair() }
];



const validFormIdentificacaoNFe = async () => {
    if (identificacaoNFe.value) {
        const valido = identificacaoNFe.value.validateForm();
        if (valido) {
            await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
            return valido;
        }
    } else {
        return true;
    }
};

const beforeChangeIdentificacao = async () => {
    return validFormIdentificacaoNFe();
};

const validDestinatarioNFe = async () => {
    if (destinatarioNFe.value) {
        const valido = destinatarioNFe.value.validateForm();
        if (valido) {
            await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
            return valido;
        }
    } else {
        return true;
    }
};

const beforeChangeTransporte = async () => {
    return validTransporteNFe();
};

const validTransporteNFe = async () => {
    if (transporteNFe.value) {
        const valido = transporteNFe.value.validateForm();
        if (valido) {
            await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
            return valido;
        }
    } else {
        return true;
    }
};

const beforeChangeDestinatario = async () => {
    return validDestinatarioNFe();
};

const validProdutosNFe = async () => {
    if (produtosNFe.value) {
        const valido = produtosNFe.value.validateForm();
        if (valido) {
            await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
            return valido;
        }
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

const validFinanceiroNFe = async () => {
    if (financeiroNFe.value) {
        const valido = financeiroNFe.value.validateForm();
        if (valido) {
            await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
            return valido;
        }
    } else {
        return true;
    }
};

const validFormInfoAdicionais = async () => {
    await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
    return true;
};

const beforeChangeInfoAdicionais = async () => {
    return validFormInfoAdicionais();
};

onMounted(async () => {
    nfeId.value = route.params.id || 0;

    if (nfeId.value > 0) {
        const cache = await NFeService.getCacheNFe(nfeId.value);
        if (cache) {
            updateFormData(formData, cache)
            destinatarioNFe.value.reloadSeletorDestinatario(formData.destinatario.destinatarioId);
        }
    } else {
        NFeService.iniciarNfe(contextoStore.contexto.empresaFilialId).then((data) => {
            formData.identificacaoNFe.regimeTributarioId = data.regimeTributarioId;
            formData.identificacaoNFe.tipoAmbiente = data.tipoAmbiente;
            formData.identificacaoNFe.tipoEmissao = data.tipoEmissao;
            formData.identificacaoNFe.serie = data.serie;
            formData.identificacaoNFe.numero = data.numero;
            formData.identificacaoNFe.chaveNFe = data.chaveNFe;
            formData.identificacaoNFe.enderecoEmitente = data.enderecoEmitente;
            formData.identificacaoNFe.nfeId = data.nfeId;
        });
    }
});

const dadosAuxiliaresItem = computed(() => {
    return {
        emitenteId: formData.identificacaoNFe.emitenteId,
        parceiroLocalEnderecoIdDestino: formData.destinatario.enderecoId,
        indicadorOperacao: formData.identificacaoNFe.indicadorOperacao,
        cfopId: formData.identificacaoNFe.cfopId,
        operacaoInternaId: formData.identificacaoNFe.operacaoInternaId,
        dataHoraEmissao: formData.identificacaoNFe.dataHoraEmissao,
        regimeTributarioId: formData.identificacaoNFe.regimeTributarioId,
        ufOrigemId: formData.identificacaoNFe.enderecoEmitente.ufId,
        ufDestinoId: formData.destinatario.endereco.ufId
    };
});

function updateFormData(formData, jsonParsed) {
    _.mergeWith(formData, jsonParsed, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
            // Se for um array, combine os arrays
            return srcValue;
        }
    });
}

const onComplete = async () => {
    const nfeRequest = montarNFeRequest();
    await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
    await NFeService.emitirNFe(nfeRequest).then((data) => {
        Swal.fire('Sucesso', 'NFe enviada com sucesso', 'success');
        router.push({ path: '/fiscal/gerenciador-nfe' });
    }).catch((error) => {
        Swal.fire('Falha', 'Ocorreu uma falha no processo de envio de nfe', 'error');
    }).finally(() => {
        enviandoNfe.value = false;
    });
}

const onCancelar = async () => {
    const result = await Swal.fire({
        title: 'Você confirma a desistência da emissão da NF-e?',
        text: 'A nfe ficará no status EM DIGITAÇÃO. Caso necessário, faça a inutilização do número.',
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

const salvarSair = async () => {
    await NFeService.saveCacheNFe({ nfeId: formData.identificacaoNFe.nfeId, cache: JSON.stringify(formData) });
    router.push({ path: '/fiscal/gerenciador-nfe' })
}

const montarNFeRequest = () => {
    const nfeRequest = {
        nfeId: formData.identificacaoNFe.nfeId,
        identificacaoNFeRequest: {...formData.identificacaoNFe, dataHoraEmissao: formatToUTC(formData.identificacaoNFe.dataHoraEmissao), 
            dataHoraSaidaEntrada: formatToUTC(formData.identificacaoNFe.dataHoraSaidaEntrada)
        },
        destinatarioNFeRequest: {...formData.destinatario},
        itensNFeRequest: {...formData.itensNFe},
        transporteNFeRequest: {...formData.transporte},
        financeiroNFeRequest: {...formData.financeiro},
        informacoesAdicionaisNFeRequest: {...formData.informacoesAdicionais}
    };

    return nfeRequest;

}

</script>

<template>
    <UWPageBase title="Emissão de NFe" subtitle="Para emissão da nfe, seguir as etapas.">
        <FormWizard color="#094899" step-size="xs" nextButtonText="Próximo" backButtonText="Anterior" >
            <template #custom-buttons-right>
                <Button class="px-3 py-12 mr-3" outlined severity="danger" @click="onCancelar">Sair da Emissão</Button>
            </template>
            <template #prev><Button class="px-6 py-12" severity="primary">Anterior</Button></template>
            <template #next><Button class="px-6 py-12" severity="primary">Próximo</Button></template>
            <template #finish>
                <SplitButton label="Enviar NFe" class="py-12" @click="onComplete" :model="actionsFinalizar" :loading="enviandoNfe" />
            </template>
            <TabContent title="Identificação da Nota Final" icon="fa fa-file-invoice" :before-change="beforeChangeIdentificacao">
                <IdentificacaoNFe ref="identificacaoNFe" v-model="formData.identificacaoNFe" />
            </TabContent>
            <TabContent title="Destinatário" icon="fa fa-handshake" :before-change="beforeChangeDestinatario">
                <DestinatarioNFe ref="destinatarioNFe" v-model="formData.destinatario" />
            </TabContent>
            <TabContent title="Produtos" icon="fa fa-barcode" :before-change="beforeChangeProdutos">
                <ProdutosNFe ref="produtosNFe" v-model="formData.itensNFe" :dadosAuxiliares="dadosAuxiliaresItem" />
            </TabContent>
            <TabContent title="Totalizadores" icon="fa fa-list-ol">
                <TotalizadoresNFe v-model="formData.itensNFe" />
            </TabContent>
            <TabContent title="Informações do Transporte" icon="fa fa-truck" :before-change="beforeChangeTransporte">
                <TransporteNFe ref="transporteNFe" v-model="formData.transporte" />
            </TabContent>
            <TabContent title="Dados do Faturamento" icon="fa fa-wallet" :before-change="beforeChangeFinanceiro">
                <FinanceiroNFe ref="financeiroNFe" v-model="formData.financeiro" />
            </TabContent>
            <TabContent title="Informações Adicionais" icon="fa fa-info" :before-change="beforeChangeInfoAdicionais">
                <InformacoesAdicionaisNFe v-model="formData.informacoesAdicionais" />
            </TabContent>
            <TabContent title="Finalizar" icon="fa fa-envelope-circle-check">
                <ResumoNFe v-model="formData" />
            </TabContent>
        </FormWizard>
    </UWPageBase>
</template>

<style></style>
