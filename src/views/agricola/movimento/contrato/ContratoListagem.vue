<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ContratoAgricolaService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';

const router = useRouter();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();

const columns = reactive([
    {
        label: 'Contrato',
        field: 'id',
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
    // {
    //     label: 'Operação',
    //     field: 'operacaoInternaNome',
    //     tipoField: 'text',
    //     filter: true,
    //     matchMode: 'contains',
    //     placeholder: '',
    //     size: '20%',
    //     sortable: true,
    //     fieldFilter: 'operacaoInterna.nome'
    // },
    // {
    //     label: 'Parceiro',
    //     field: 'parceiroNome',
    //     tipoField: 'text',
    //     filter: true,
    //     matchMode: 'contains',
    //     placeholder: '',
    //     size: '25%',
    //     sortable: true,
    //     fieldFilter: 'parceiroLocal.parceiro.nomeRazaoSocial'
    // },
    // {
    //     label: 'Propriedade',
    //     field: 'parceiroLocalPropriedadeNome',
    //     tipoField: 'text',
    //     filter: true,
    //     matchMode: 'contains',
    //     placeholder: '',
    //     size: '20%',
    //     sortable: true,
    //     fieldFilter: 'parceiroLocalPropriedade.identificacao'
    // },
    // {
    //     label: 'Situação',
    //     field: 'situacaoNome',
    //     tipoField: 'text',
    //     filter: true,
    //     matchMode: 'contains',
    //     placeholder: '',
    //     size: '10%',
    //     sortable: true,
    //     fieldFilter: 'situacao',
    //     filterSeletor: true,
    //     filterValues: situacoesRomaneio
    // }
]);

const openNew = () => {
    router.push({name: 'agricola-movimento-contrato-novo'})
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="contrato" title="Contrato Agrícola" :columns="columns" :service="ContratoAgricolaService" 
    labelButtonNew="Novo Contrato" iconButtonNew="pi pi-plus"
    :showAcoes="true" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="id">
    </UWPageCrud>
</template>
