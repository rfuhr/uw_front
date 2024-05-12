<script setup>
import { ref, reactive } from 'vue';
import ManutencaoLocalEstoque from './ManutencaoLocalEstoque.vue';
import { useDelete } from '@/composables/useDelete';
import { LocalEstoqueService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '30%'
    },  
    {
        label: 'Tipo do Local',
        field: 'tipoLocalEstoqueNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%'
    },  
    {
        label: 'Filial Específica',
        field: 'filialEspecifica',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%'
    },    
    {
        label: 'Filial',
        field: 'empresaFilialNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%'
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
    const textoConfirmacao = `Após a exclusão do Local do Estoque, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O Local do Estoque, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do Local do Estoque não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="LocalEstoque" title="Local do Estoque" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoLocalEstoque :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
