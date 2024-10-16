<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RomaneioAgricolaService, TiposService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';

const router = useRouter();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const situacoesRomaneio = ref();

const columns = reactive([
    {
        label: 'Romaneio',
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
        label: 'Data Documento',
        field: 'dataDocumento',
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
        filterValues: situacoesRomaneio
    }
]);

const openNew = () => {
    router.push({name: 'agricola-movimento-romaneio-novo'})
};

onMounted(() => {
    TiposService.getSituacaoRomaneio().then((response) => {
        situacoesRomaneio.value = response.map(m => {
            return {
                label: m.name,
                value: m.value
            }
        })
    })
    .catch(() => {
        situacoesRomaneio.value = []
    })
})

const openEdit = (selectId) => {
    router.push({name: 'agricola-movimento-romaneio-editar', params: {
        id: selectId
    }})
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="romaneio" title="Romaneio" :columns="columns" :service="RomaneioAgricolaService" 
    labelButtonNew="Novo Romaneio" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="dataDocumento">
    <template #tableActions="slotProps">
        <Button v-if="slotProps.data.situacao === '2'" v-tooltip="'Editar romaneio'" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.id)" style="height: 24px; width: 24px;"/>
    </template>
    </UWPageCrud>
</template>
