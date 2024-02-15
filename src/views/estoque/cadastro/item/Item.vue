<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { useRouter } from 'vue-router';
import { ItemService } from '@/service';

const router = useRouter();
const { execute } = useDelete();
const crudlista = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '55%',
        sortable: true
    },
    {
        label: 'SKU',
        field: 'sku',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        sortable: true
    }
]);

const openNew = () => {
    router.push({name: 'est-cadastro-item-novo'})
};

const openEdit = (selectId) => {
    router.push({name: 'est-cadastro-item-editar', params: {
        id: selectId
    }})
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do item, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O item, ${dados.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do item não foi realizada :)"
    
    const result = await execute(ItemService, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};


</script>

<template>
    <UWPageCrud ref="crudlista" tag="itemestoque" title="Item / Produto" :columns="columns" :service="ItemService" @openNew="openNew" @openEdit="openEdit($event)" @openDelete="openDelete" sortField="nome" />
</template>
