<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SolicitacaoMercadoriaService, TiposService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';
import { useDelete } from '@/composables/useDelete';

const router = useRouter();
const { execute } = useDelete();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const situacoesSolicitacao = ref([]);

const columns = reactive([
    {
        label: 'Solicitação',
        field: 'numero',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equals',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'numero'
    },
    {
        label: 'Data Solicitação',
        field: 'dataSolicitacao',
        tipoField: 'date',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatToDDMMYYYY
    },
    {
        label: 'Situação',
        field: 'situacaoSolicitacaoMercadoriaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        sortable: true,
        fieldFilter: 'situacaoSolicitacaoMercadoria',
        filterSeletor: true,
        filterValues: situacoesSolicitacao
    },
    {
        label: 'Observação',
        field: 'observacao',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '50%',
        sortable: true,
        fieldFilter: 'observacao'
    }
]);

const openNew = () => {
    router.push({name: 'compra-solicitacao-solicitacao-item-nova'})
};

const openEdit = (selectId) => {
    router.push({name: 'compra-solicitacao-solicitacao-item-editar', params: {
        id: selectId
    }})    
};

const openView = (selectId) => {
    router.push({name: 'compra-solicitacao-solicitacao-item-visualizar', params: {
        id: selectId
    }})    
};

const openCancelar = async (dados) => {
    const textoConfirmacao = `Após a desistência da solicitação, de nº ${dados.numero}, você não poderá reverter isso!`
    const textoSucesso = `A solicitação, de nº ${dados.numero}, foi cancelada com sucesso.`
    const textoCancelado = "A desistência da solicitação não foi realizada."
    const title = "Você confirma a desistência da solicitação?"
    
    const result = await execute(SolicitacaoMercadoriaService, dados.id, textoConfirmacao, textoSucesso, textoCancelado, title);
    if (result) crudlista.value.reload();
};

onMounted(() => {
    TiposService.getSituacaoSolicitacaoMercadoria().then((response) => {
        situacoesSolicitacao.value = response.map(m => {
            return {
                label: m.name,
                value: m.value
            }
        })
    })
    .catch(() => {
        situacoesSolicitacao.value = []
    })
})
</script>

<template>
    <UWPageCrud ref="crudlista" tag="solicitacaoitem" title="Solicitação de Item" :columns="columns" :service="SolicitacaoMercadoriaService" 
    labelButtonNew="Nova Solicitação" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="id">
    <template #tableActions="slotProps">
        <Button v-tooltip="'Visualizar solicitação'" icon="pi pi-eye" class="p-button-secundary p-button-sm mr-2" @click="openView(slotProps.data.id)" style="height: 24px; width: 24px;"/>
        <Button v-if="slotProps.data.situacaoSolicitacaoMercadoria === '1'" v-tooltip="'Editar solicitação'" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.id)" style="height: 24px; width: 24px;"/>
        <Button v-if="slotProps.data.situacaoSolicitacaoMercadoria !== '5' && slotProps.data.situacaoSolicitacaoMercadoria !== '9'" v-tooltip="'Desistir da solicitação'" icon="pi pi-trash" class="p-button-danger p-button-sm mr-2" @click="openCancelar(slotProps.data)" style="height: 24px; width: 24px;"/>
    </template>
    </UWPageCrud>
</template>
