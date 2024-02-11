<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { useRouter } from 'vue-router';
import { PerfilService } from '@/service';

const router = useRouter();
const { execute } = useDelete();
const crudlista = ref();

const columns = reactive([
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '80%'
    }
]);

const openNew = () => {
    router.push({name: 'admin-seguranca-perfis-novo'})
};

const openEdit = (selectId) => {
    router.push({name: 'admin-seguranca-perfis-editar', params: {
        id: selectId
    }})
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do perfil, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O perfil, ${dados.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do perfil não foi realizada :)"
    
    const result = await execute(PerfilService, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

</script>

<template>
    <UWPageCrud ref="crudlista" title="Perfis" :columns="columns" :service="PerfilService" @openNew="openNew" @openEdit="openEdit($event)" @openDelete="openDelete" />
</template>
