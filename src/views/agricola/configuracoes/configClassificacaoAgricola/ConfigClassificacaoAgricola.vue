<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfigClassificacaoAgricola from './ManutencaoConfigClassificacaoAgricola.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfigClassificacaoAgricolaService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Produto',
        field: 'itemNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'item.nome'
    },
    {
        label: 'Tipo de Classificação',
        field: 'tipoClassificacaoAgricolaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'tipoClassificacaoAgricola.nome'
    },
    {
        label: 'Safra',
        field: 'safraNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'safra.nome'
    },
    {
        label: 'Faixa Inicial',
        field: 'faixaInicial',
        tipoField: 'equal',
        filter: true,
        matchMode: 'contains',
        size: '10%',
        sortable: true
    },
    {
        label: 'Faixa Final',
        field: 'faixaFinal',
        tipoField: 'decimal',
        filter: true,
        matchMode: 'equal',
        size: '10%',
        sortable: true
    },
    {
        label: 'Desconto',
        field: 'desconto',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },   
    {
        label: '% Desconto',
        field: 'percentualDesconto',
        tipoField: 'decimal',
        filter: true,
        matchMode: 'equal',
        size: '10%',
        sortable: true
    },
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
    const textoConfirmacao = `Após a exclusão da configuração de classificação, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Configuração de Classificação, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da Configuração de Classificação não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configclassificacaoagricola" title="Configuração de Classificação Agrícola" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfigClassificacaoAgricola :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
