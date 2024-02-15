<script setup>
import { ref, reactive } from 'vue';
import ManutencaoMotivoDesoneracao from './ManutencaoMotivoDesoneracao.vue';
import { useDelete } from '@/composables/useDelete';
import { MotivoDesoneracaoService as Service } from '@/service';

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
        size: '20%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '60%'
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
    const textoConfirmacao = `Após a exclusão do Motivo de Desoneração, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O Motivo de Desoneração, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do Motivo de Desoneração não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="motivodesoneracao" title="Motivo de Desoneração" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoMotivoDesoneracao :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
