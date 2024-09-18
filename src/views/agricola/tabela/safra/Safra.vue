<script setup>
import { ref, reactive } from 'vue';
import ManutencaoSafra from './ManutencaoSafra.vue';
import { useDelete } from '@/composables/useDelete';
import { SafraService as Service } from '@/service';

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
    const textoConfirmacao = `Após a exclusão da Safra, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A Safra, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da Safra não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="safra" title="Safra" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoSafra :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
