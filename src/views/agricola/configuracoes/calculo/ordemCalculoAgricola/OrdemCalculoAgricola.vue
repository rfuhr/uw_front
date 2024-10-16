<script setup>
import { ref, reactive } from 'vue';
import ManutencaoOrdemCalculoAgricola from './ManutencaoOrdemCalculoAgricola.vue';
import { useDelete } from '@/composables/useDelete';
import { OrdemCalculoAgricolaService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Produto',
        field: 'itemNome',
        tipoField: 'string',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        fieldFilter: 'item.nome'
    },  
    {
        label: 'Documento',
        field: 'identificacaoDocumentoAgricolaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        fieldFilter: 'identificacaoDocumentoAgricola.name'
    },
    {
        label: 'Tipo de Cálculo',
        field: 'tipoCalculoAgricolaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        fieldFilter: 'tipoCalculoAgricola.nome'
    },
    {
        label: 'Ordem',
        field: 'ordem',
        tipoField: 'number',
        filter: true,
        matchMode: 'equals',
        placeholder: '',
        size: '7%',
        fieldFilter: 'ordem'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        tipoField: 'maskDate',
        filter: false,
        placeholder: '',
        size: '8%',
        maskDate: 'dd/MM/yyyy'
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        filter: false,
        placeholder: '',
        size: '8%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'
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
    const textoConfirmacao = `Após a exclusão da ordem de cálculo, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A ordem de cálculo, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da ordem de cálculo não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="ordemcalculoagricola" title="Ordem de Cálculo do Desconto" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoOrdemCalculoAgricola :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
