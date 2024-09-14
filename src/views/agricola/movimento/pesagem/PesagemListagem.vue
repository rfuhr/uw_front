<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDelete } from '@/composables/useDelete';
import { PesagemService, TiposService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';
import Swal from 'sweetalert2';

const router = useRouter();
const { execute } = useDelete();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const situacoesPesagem = ref();

const columns = reactive([
    {
        label: 'Ticket',
        field: 'id',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equals',
        placeholder: '',
        size: '8%',
        sortable: true,
        fieldFilter: 'id'
    },
    {
        label: 'Data Pesagem',
        field: 'dataPesagem',
        tipoField: 'date',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatToDDMMYYYY
    },
    {
        label: 'Operação',
        field: 'operacaoInternaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'operacaoInterna.nome'
    },
    {
        label: 'Parceiro',
        field: 'parceiroNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%',
        sortable: true,
        fieldFilter: 'parceiroLocal.parceiro.nomeRazaoSocial'
    },
    {
        label: 'Propriedade',
        field: 'parceiroLocalPropriedadeNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '20%',
        sortable: true,
        fieldFilter: 'parceiroLocalPropriedade.identificacao'
    },
    {
        label: 'Situação',
        field: 'situacaoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'situacao',
        filterSeletor: true,
        filterValues: situacoesPesagem,
        // format: (value) => getTemplate(value)
    }
]);

const openNew = () => {
    router.push({name: 'agricola-movimento-pesagem-nova'})
};

onMounted(() => {
    TiposService.getSituacaoPesagem().then((response) => {
        situacoesPesagem.value = response.map(m => {
            return {
                label: m.name,
                value: m.value
            }
        })
    })
    .catch(() => {
        situacoesPesagem.value = []
    })
})

const openEdit = (selectId) => {
    router.push({name: 'agricola-movimento-pesagem-editar', params: {
        id: selectId
    }})
};

const openDelete = async (id) => {
    const textoConfirmacao = `Após o cancelamento da pesagem, nº ${id}, você não poderá reverter isso!`
    const textoSucesso = `A pesagem, nº ${id}, foi excluída com sucesso.`
    const textoCancelado = "A exclusão da pesagem não foi realizada :)"
    
    const result = await execute(PesagemService, id, textoConfirmacao, textoSucesso, textoCancelado, 'Você confirma o cancelamento?');
    if (result) crudlista.value.reload();
};

const finalizar = async(id) => {
    const result = await Swal.fire({
        title: 'Você confirma o fechamento?',
        text: 'Caso confirme, a pesagem será finalizada automáticamente após o salvamento.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Não',
        cancelButtonColor: "red",
        reverseButtons: true
    });

    if (result.value) {
        await PesagemService.finalizar(id);
        crudlista.value.reload();
    }            
}

</script>

<template>
    <UWPageCrud ref="crudlista" tag="pesagem" title="Pesagem" :columns="columns" :service="PesagemService" 
    labelButtonNew="Nova Pesagem" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="dataPesagem">
    <template #tableActions="slotProps">
        <Button v-if="slotProps.data.situacao === '1'" v-tooltip="'Editar pesagem'" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.id)" style="height: 24px; width: 24px;"/>
        <Button v-if="slotProps.data.situacao !== '9'" v-tooltip="'Cancelar pesagem'" icon="pi pi-times" class="p-button-danger p-button-sm mr-2" @click="openDelete(slotProps.data.id)" style="height: 24px; width: 24px;"/>
        <Button v-if="slotProps.data.situacao === '1'" v-tooltip="'Finalizar pesagem'" icon="pi pi-lock" class="p-button-success p-button-sm mr-2" @click="finalizar(slotProps.data.id)" style="height: 24px; width: 24px;"/>
    </template>
    </UWPageCrud>
</template>
