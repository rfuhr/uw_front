<script setup>
import { ref, reactive } from 'vue';
import ManutencaoCidade from './ManutencaoCidade.vue';
import { useDelete } from '@/composables/useDelete';
import { CidadeService as Service } from '@/service';

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
        size: '40%',
        sortable: true
    },
    {
        label: 'Cód. IBGE',
        field: 'codigoIBGE',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true
    },
    {
        label: 'UF',
        field: 'siglaUF',
        fieldFilter: 'uf.sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortFilter: 'uf.sigla',
        sortable: true
    },
    {
        label: 'País',
        field: 'siglaPais',
        fieldFilter: 'pais.sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortFilter: 'pais.sigla',
        sortable: true
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
    const textoConfirmacao = `Após a exclusão da cidade, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A cidade, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da cidade não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="cidade" title="Cidades" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome"/>
    <ManutencaoCidade :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
