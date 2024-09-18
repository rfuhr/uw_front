<script setup>
import { ref, reactive } from 'vue';
import ManutencaoParametroFinanceiro from './ManutencaoParametroFinanceiro.vue';
import { useDelete } from '@/composables/useDelete';
import { ParametroFinanceiroService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Tipo Título',
        field: 'tipoTituloSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        fieldFilter: 'tipoTitulo.sigla'
    },
    {
        label: 'Característica Movimento',
        field: 'caracteristicaMovimentoFinanceiroSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        fieldFilter: 'caracteristicaMovimentoFinanceiro.sigla'
    },
    {
        label: 'Carteira Financeira',
        field: 'carteiraFinanceiraSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        fieldFilter: 'carteiraFinanceira.sigla'
    },
    {
        label: 'Fato Gerador',
        field: 'fatoGeradorSigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        fieldFilter: 'fatoGerador.sigla'
    },
    {
        label: 'Op. Movimento',
        field: 'operacaoMovimentoFinanceiroNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'operacaoMovimentoFinanceiro.nome'
    },
    {
        label: 'Op. Acessória',
        field: 'operacaoAcessoriaFinanceiraNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'operacaoAcessoriaFinanceira.nome'
    },
    {
        label: 'D/C',
        field: 'indicadorDC',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '8%',
        fieldFilter: 'indicadorDC'
    },
    {
        label: 'Conta',
        field: 'planoClassificacaoFinanceiraCodigo',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'planoClassificacaoFinanceira.codigo'
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
    const textoConfirmacao = `Após a exclusão do parâmetro financeiro, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O parâmetro financeiro, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do parâmetro financeiro não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="parametrofinanceiro" title="Parâmetro Financeiro" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoParametroFinanceiro :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
