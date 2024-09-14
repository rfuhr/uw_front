<script setup>
import { ref, reactive } from 'vue';
import ManutencaoBalanca from './ManutencaoBalanca.vue';
import { useDelete } from '@/composables/useDelete';
import { BalancaService as Service } from '@/service';

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
        size: '40%'
    },
    {
        label: 'Filial',
        field: 'empresaFilialNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'empresaFilial.nome'
    },
    {
        label: 'Porta',
        field: 'porta',
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
    const textoConfirmacao = `Após a exclusão da Balança, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Balança, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da Balança não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="balanca" title="Balança" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoBalanca :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
