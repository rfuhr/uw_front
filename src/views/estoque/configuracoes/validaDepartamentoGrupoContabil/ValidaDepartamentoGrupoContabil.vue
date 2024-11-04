<script setup>
import { ref, reactive } from 'vue';
import ManutencaoValidaDepartamentoGrupoContabil from './ManutencaoValidaDepartamentoGrupoContabil.vue';
import { useDelete } from '@/composables/useDelete';
import { ValidaDepartamentoGrupoContabilService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Departamento',
        field: 'departamentoNome',
        tipoField: 'string',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'departamento.nome'
    },  
    {
        label: 'Grupo Contábil',
        field: 'grupoContabilNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        fieldFilter: 'grupoContabil.nome'
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
    const textoConfirmacao = `Após a exclusão da validação, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A validação, ${dados.nome}, foi excluida com sucesso.`
    const textoCancelado = "A exclusão da validação não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="validadepartamentogrupocontabil" title="Validação Departamento x Grupo Contábil" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoValidaDepartamentoGrupoContabil :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
