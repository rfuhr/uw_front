<script setup>
import { ref, reactive } from 'vue';
import ManutencaoClassificacaoFinanceira from './ManutencaoClassificacaoFinanceira.vue';
import { useDelete } from '@/composables/useDelete';
import { PlanoClassificacaoFinanceiraService as Service } from '@/service';

const { execute } = useDelete();
const visibleDialog = ref(false);
const mode = ref('create');
const idRegistro = ref(0);
const idRegistroSuperior = ref(null);
const crudlista = ref();
const contaSuperior = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Código...',
        size: '10%',
        sortable: true
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Nome...',
        size: '40%',
        sortable: true
    },
    {
        label: 'Nível',
        field: 'nivel',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equals',
        placeholder: 'Busca por Nível...',
        size: '15%',
        sortable: true
    },
    {
        label: 'Sintética',
        field: 'sintetica',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equals',
        placeholder: 'Selecione...',
        size: '10%',
        sortable: true,
        filterSeletor: true,
        filterValues: [
            { label: 'Analítica', value: false },
            { label: 'Sintética', value: true }
        ],
        format: (value) => getTemplate(value)
    }
]);

const getTemplate = (value) => {
    if (value) {
        return `
    <span class="p-tag surface-500">Sintética</span>
    `;
    } else {
        return `
    <span class="p-tag p-tag-success">Analítica</span>            
    `;
    }
};

const openNew = () => {
    mode.value = 'novaConta';
    visibleDialog.value = true;
    contaSuperior.value = null;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    idRegistro.value = selectId;
    visibleDialog.value = true;
};

const openAdicionar = (selectIdContaSuperior) => {
    mode.value = 'novaSubConta';
    idRegistroSuperior.value = selectIdContaSuperior;
    visibleDialog.value = true;
};

const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão da conta, ${dados.nome}, você não poderá reverter isso!`;
    const textoSucesso = `A conta, ${dados.nome}, foi excluido com sucesso.`;
    const textoCancelado = 'A exclusão da conta não foi realizada :)';

    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    visibleDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="planoclassificacaofinanceira" title="Classificação Financeira" labelButtonNew="Nova Conta" iconButtonNew="pi pi-tags" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome">
        <!-- <template #headerActions>
            <Button icon="pi pi-tags" label="Nova Conta" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="openAdicionar(slotProps.data.id)" />
        </template> -->
        <template #tableActions="slotProps">
            <Button icon="pi pi-tags" class="p-button-success p-button-sm mr-2" outlined @click="openAdicionar(slotProps.data.id)" />
        </template>
    </UWPageCrud>
    <ManutencaoClassificacaoFinanceira :idRegistro="idRegistro" :showDialog="visibleDialog" :mode="mode" :idRegistroSuperior="idRegistroSuperior" @closeDialog="closeDialog" />
</template>
