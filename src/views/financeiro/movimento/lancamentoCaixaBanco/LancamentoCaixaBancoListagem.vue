<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MovimentoCaixaBancoService } from '@/service';
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
        label: 'Data Movimento',
        field: 'dataMovimento',
        tipoField: 'date',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatToDDMMYYYY
    },
    {
        label: 'Banco',
        field: 'bancoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'conta.agencia.banco.nome'
    },
    {
        label: 'Agência',
        field: 'agenciaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'conta.agencia.nome'
    },
    {
        label: 'Núm. Conta',
        field: 'contaNumero',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'conta.numero'
    },
    {
        label: 'Nome Conta',
        field: 'contaNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '10%',
        sortable: true,
        fieldFilter: 'conta.nome'
    },
    {
        label: 'NossoNumero',
        field: 'nossoNumero',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true
    },
    {
        label: 'Valor',
        field: 'valor',
        tipoField: 'decimal',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '10%',
        sortable: true,
        format: formatNumber
    },
    {
        label: 'D/C',
        field: 'indicadorDC',
        tipoField: 'text',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%',
        sortable: true,
        format: (value) => value === 'C' ? '<span style="color: blue; margin-left: 1rem">C</Badge>' : '<span style="color: red; margin-left: 1rem">D</span>'
    }
]);

const openNew = () => {
    router.push({name: 'financeiro-movimento-lancamento-caixa-banco-novo'})
};

</script>

<template>
    <UWPageCrud ref="crudlista" tag="movimentocaixabanco" title="Lançamentos de Caixa e Bancos" :columns="columns" :service="MovimentoCaixaBancoService" 
    :showAcoes="false" :showButtonEdit="false" :showButtonDelete="false"
    @openNew="openNew" sortField="nossoNumero"/>
</template>
