<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfiguracaoFiscal from './ManutencaoConfiguracaoFiscal.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfiguracaoFiscalService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'ID',
        field: 'id',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'Regime Tributário',
        field: 'regimeTributarioNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%'
    },    
    {
        label: 'UF Orig',
        field: 'ufOrigemSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'UF Dest',
        field: 'ufDestinoSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Ent/Sai',
        field: 'entradaSaida',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Origem',
        field: 'origemCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Gr.Tribut.',
        field: 'grupoTributacaoCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'Clas.Oper.',
        field: 'classificacaoOperacaoCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'Oper.Int.',
        field: 'operacaoInternaSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%'
    }, 
    {
        label: 'CFOP',
        field: 'cfopCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },
    {
        label: 'NCM',
        field: 'ncmCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Item',
        field: 'itemCodigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '8%'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        tipoField: 'maskDate',
        filter: false,
        placeholder: '',
        size: '10%',
        maskDate: 'dd/MM/yyyy'
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        filter: false,
        placeholder: '',
        size: '10%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'
    }       
]);

const openNew = () => {
    mode.value = 'create';
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão da Configuração Fiscal, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Configuração Fiscal, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão da Configuração Fiscal não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configuraçãofiscal" title="Configuração Fiscal" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfiguracaoFiscal :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
