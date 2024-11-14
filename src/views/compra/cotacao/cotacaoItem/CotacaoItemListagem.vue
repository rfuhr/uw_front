<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CotacaoMercadoriaService, TiposService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';

const router = useRouter();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const situacoesCotacao = ref([]);

const columns = reactive([
    {
        label: 'Cotação',
        field: 'numero',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equals',
        placeholder: '',
        size: '8%',
        sortable: true,
        fieldFilter: 'numero'
    },
    {
        label: 'Data Cotação',
        field: 'dataCotacao',
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
        field: 'situacaoCotacaoMercadoriaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        sortable: true,
        fieldFilter: 'situacaoCotacaoMercadoria',
        filterSeletor: true,
        filterValues: situacoesCotacao
    },
]);

const openNew = () => {
    router.push({name: 'compra-cotacao-cotacao-item-nova'})
};

const openView = (selectId) => {
    router.push({name: 'compra-cotacao-cotacao-item-visualizar', params: {
        id: selectId
    }})    
};

const openEdit = (selectId) => {
    router.push({name: 'compra-cotacao-cotacao-item-editar', params: {
        id: selectId
    }})    
};

onMounted(() => {
    TiposService.getSituacaoCotacaoMercadoria().then((response) => {
        situacoesCotacao.value = response.map(m => {
            return {
                label: m.name,
                value: m.value
            }
        })
    })
    .catch(() => {
        situacoesCotacao.value = []
    })
})

</script>

<template>
    <UWPageCrud ref="crudlista" tag="cotacaoitem" title="Cotação de Item" :columns="columns" :service="CotacaoMercadoriaService" 
    labelButtonNew="Nova Cotação" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="id">
    <template #tableActions="slotProps">
        <Button v-tooltip="'Visualizar cotacao'" icon="pi pi-eye" class="p-button-secundary p-button-sm mr-2" @click="openView(slotProps.data.id)" style="height: 24px; width: 24px;"/>
        <Button v-if="slotProps.data.situacaoCotacaoMercadoria === '1'" v-tooltip="'Editar cotação'" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.id)" style="height: 24px; width: 24px;"/>
    </template>
    </UWPageCrud>
</template>
