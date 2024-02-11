<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { useRouter } from 'vue-router';
import { ParceiroService } from '@/service';

const router = useRouter();
const { execute } = useDelete();
const crudlista = ref();

const columns = reactive([
    {
        label: 'Cnpj / Cpf',
        field: 'raizCnpjCpf',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '20%'
    },
    {
        label: 'Razão social',
        field: 'nomeRazaoSocial',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '60%'
    }
]);

const openNew = () => {
    router.push({name: 'admin-relacionamento-parceiros-novo'})
};

const openEdit = (selectId) => {
    router.push({name: 'admin-relacionamento-parceiros-editar', params: {
        id: selectId
    }})
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do parceiro, ${dados.nomeRazaoSocial}, você não poderá reverter isso!`
    const textoSucesso = `O parceiro, ${dados.nomeRazaoSocial}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do parceiro não foi realizada :)"
    
    const result = await execute(ParceiroService, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};


</script>

<template>
    <UWPageCrud ref="crudlista" tag="parceiro" title="Parceiros" :columns="columns" :service="ParceiroService" @openNew="openNew" @openEdit="openEdit($event)" @openDelete="openDelete" />
</template>
