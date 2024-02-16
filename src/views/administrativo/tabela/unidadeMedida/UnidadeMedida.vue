<script setup>
import { ref, reactive } from 'vue';
import ManutencaoUnidadeMedida from './ManutencaoUnidadeMedida.vue';
import { useDelete } from '@/composables/useDelete';
import { UnidadeMedidaService as Service } from '@/service'

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
        size: '50%',
        sortable: true
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true
    },
    {
        label: 'Grandeza de Medida',
        field: 'grandezaMedida',
        tipoField: 'enum',
        fieldFilter: 'grandezaMedida',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true
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
    const textoConfirmacao = `Após a exclusão da unidade de medida, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `A unidade de medida, ${dados.nome}, foi excluída com sucesso.`
    const textoCancelado = "A exclusão da unidade de medida não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="unidademedida" title="Unidade de Medida" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" sortField="nome"/>
    <ManutencaoUnidadeMedida :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
