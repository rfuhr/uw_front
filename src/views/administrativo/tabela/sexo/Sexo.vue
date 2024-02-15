<script setup>
import { ref, reactive } from 'vue';
import ManutencaoSexo from './ManutencaoSexo.vue';
import { useDelete } from '@/composables/useDelete';
import { SexoService as Service } from '@/service';

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
        placeholder: 'Busca por Nome...',
        size: '80%',
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
    const textoConfirmacao = `Após a exclusão do sexo, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O sexo, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do sexo não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="sexo" title="Sexo" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome"/>
    <ManutencaoSexo :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
