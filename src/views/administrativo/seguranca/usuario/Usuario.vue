<script setup>
import { ref, reactive } from 'vue';
import { useDelete } from '@/composables/useDelete';
import { useRouter } from 'vue-router';
import { UsuarioService } from '@/service';

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
        size: '20%'
    },
    {
        label: 'Email',
        field: 'email',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '60%'
    }
]);

const openNew = () => {
    router.push({name: 'admin-seguranca-usuarios-novo'})
};

const openEdit = (selectId) => {
    router.push({name: 'admin-seguranca-usuarios-editar', params: {
        id: selectId
    }})
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão do usuário, ${dados.nome}, você não poderá reverter isso!`
    const textoSucesso = `O usuário, ${dados.nome}, foi excluído com sucesso.`
    const textoCancelado = "A exclusão do usuário não foi realizada :)"
    
    const result = await execute(UsuarioService, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="usuario" title="Usuários" :columns="columns" :service="UsuarioService" @openNew="openNew" @openEdit="openEdit($event)" @openDelete="openDelete" />
</template>
