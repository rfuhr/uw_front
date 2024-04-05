<script setup>
import { ref, reactive } from 'vue';
import ManutencaoOperacaoInterna from './ManutencaoOperacaoInterna.vue';
import { useDelete } from '@/composables/useDelete';
import { OperacaoInternaService as Service } from '@/service'

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '50%',
        sortable: true
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true
    },
    {
        label: 'Natureza da Operacao',
        field: 'naturezaOperacao.nome',
        tipoField: 'text',
        fieldFilter: 'naturezaOperacao.nome',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '30%',
        sortFilter: 'naturezaOperacao.nome',
        sortable: true
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
    const textoConfirmacao = `Após a exclusão da operação interna, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A operação interna, ${dados.nome}, foi excluída com sucesso.`
    const textoCancelado = "A exclusão da operação interna não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="operacaointerna" title="Operação Interna" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome"/>
    <ManutencaoOperacaoInterna :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
