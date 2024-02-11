<script setup>
import { ref, reactive } from 'vue';
import ManutencaoPais from './ManutencaoPais.vue';
import { useDelete } from '@/composables/useDelete';
import { PaisService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlistapais = ref();


const columns = reactive([
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Nome...',
        size: '40%'
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Sigla...',
        size: '10%'
    },
    {
        label: 'Código IBGE',
        field: 'codigoIBGE',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Cód. IBGE...',
        size: '20%'
    },
    {
        label: 'Código SisComex',
        field: 'codigoIBGE',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: 'Busca por Cód. SisComex...',
        size: '20%'
    }
]);

const openNew = () => {
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do país, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O país, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do país não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlistapais.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlistapais.value) crudlistapais.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlistapais" tag="pais" title="Países" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoPais :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
