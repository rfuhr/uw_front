<script setup>
import { ref, reactive } from 'vue';
import ManutencaoMelhoriaAgricola from './ManutencaoMelhoriaAgricola.vue';
import { useDelete } from '@/composables/useDelete';
import { MelhoriaAgricolaService as Service } from '@/service';

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
        size: '15%',
        fieldFilter: 'item.nome'
    },  
    {
        label: 'Item Principal',
        field: 'itemClassificacaoAgricolaPrincipalNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'itemClassificacaoAgricolaPrincipal.nome'
    },
    {
        label: 'Sub. Item Principal',
        field: 'subItemClassificacaoAgricolaPrincipalNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'subItemClassificacaoAgricolaPrincipal.nome'
    },
    {
        label: 'Item Secundário',
        field: 'itemClassificacaoAgricolaSecundarioNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'itemClassificacaoAgricolaSecundario.nome'
    },
    {
        label: 'Sub. Item Secundário',
        field: 'subItemClassificacaoAgricolaSecundarioNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        fieldFilter: 'subItemClassificacaoAgricolaSecundario.nome'
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
    const textoConfirmacao = `Após a exclusão da melhoria agrícola, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A melhoria agrícola, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da melhoria agrícola não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="melhoriaagricola" title="Melhoria Agrícola" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoMelhoriaAgricola :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
