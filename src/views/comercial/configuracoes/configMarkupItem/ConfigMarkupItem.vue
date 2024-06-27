<script setup>
import { ref, reactive } from 'vue';
import ManutencaoConfigMarkupItem from './ManutencaoConfigMarkupItem.vue';
import { useDelete } from '@/composables/useDelete';
import { ConfigMarkupItemService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Identificador',
        field: 'id',
        tipoField: 'integer',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%'
    },
    {
        label: 'Item',
        field: 'itemNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '45%'
    },
    {
        label: 'Início Vigência',
        field: 'dataInicioVigencia',
        filter: false,
        placeholder: '',
        size: '15%',
        tipoField: 'maskDate',
        maskDate: 'dd/MM/yyyy'        
    },
    {
        label: 'Final Vigência',
        field: 'dataFinalVigencia',
        filter: false,
        placeholder: '',
        size: '15%',
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
    const textoConfirmacao = `Após a exclusão da Configuração do Mark Up do Item, ${dados.codigo}, você não poderá reverter isso!`
    const textoSucesso = `A Configuração do Mark Up do Item foi excluída com sucesso.`
    const textoCancelado = "A exclusão da Configuração do Mark Up do Item não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="configMarkupItem" title="Configuração do Mark Up do Item" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoConfigMarkupItem :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
