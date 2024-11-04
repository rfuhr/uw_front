<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { CotacaoMercadoriaService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';

const router = useRouter();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();

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
    }
]);

const openNew = () => {
    router.push({name: 'compra-cotacao-cotacao-item-nova'})
};

const openView = (selectId) => {
    router.push({name: 'compra-cotacao-cotacao-item-visualizar', params: {
        id: selectId
    }})    
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="cotacaoitem" title="Cotação de Item" :columns="columns" :service="CotacaoMercadoriaService" 
    labelButtonNew="Nova Cotação" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="id">
    <template #tableActions="slotProps">
        <Button v-tooltip="'Visualizar cotacao'" icon="pi pi-eye" class="p-button-secundary p-button-sm mr-2" @click="openView(slotProps.data.id)" style="height: 24px; width: 24px;"/>
    </template>
    </UWPageCrud>
</template>
