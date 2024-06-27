<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { MotivoEstornoFinanceiroService as Service } from '@/service';
import ManutencaoMotivoEstornoFinanceiro from './ManutencaoMotivoEstornoFinanceiro.vue';

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
        size: '50%'
    },
    {
        label: 'Sigla',
        field: 'sigla',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
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
    const textoConfirmacao = `Após a exclusão do motivo de estorno, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O motivo de estorno, ${dados.nome}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão do motivo de estorno não foi realizado :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="motivoestornofinanceiro" title="Motivo de Estorno" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoMotivoEstornoFinanceiro :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
