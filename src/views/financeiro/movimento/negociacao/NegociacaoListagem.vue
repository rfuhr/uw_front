<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { NegociacaoService } from '@/service';
import { useFormatDate} from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';

const router = useRouter();
const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const { formatNumber } = useFormatNumber();

const columns = reactive([
    {
        label: 'Departamento',
        field: 'departamentoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '15%',
        sortable: true,
        fieldFilter: 'departamento.nome'
    },
    {
        label: 'Data Negociação',
        field: 'dataNegociacao',
        tipoField: 'date',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatToDDMMYYYY
    },
    {
        label: 'Parceiro',
        field: 'parceiroNomeRazaoSocial',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '30%',
        sortable: true,
        fieldFilter: 'parceiroLocal.parceiro.nomeRazaoSocial'
    },
    {
        label: 'Número',
        field: 'nossoNumero',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true
    },
    {
        label: 'Valor Negociado',
        field: 'valorTotalAtraso',
        tipoField: 'decimal',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatNumber
    },
    {
        label: 'Novo Valor',
        field: 'valorNegociadoPagar',
        tipoField: 'decimal',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatNumber
    }
]);

const openNew = () => {
    router.push({name: 'financeiro-movimento-negociacao-nova'})
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="negociacaofinanceira" title="Negociação de Títulos" :columns="columns" :service="NegociacaoService" 
    :showAcoes="false" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="nossoNumero"/>
</template>
