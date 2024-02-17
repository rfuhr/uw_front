<script setup>
import { ref, reactive } from 'vue';
import ManutencaoSituacaoTributaria from './ManutencaoSituacaoTributaria.vue';
import { useDelete } from '@/composables/useDelete';
import { SituacaoTributariaService as Service } from '@/service';

const { execute } = useDelete();
const crudDialog = ref(false);
const mode = ref('create');
const id = ref(0);
const crudlista = ref();

const columns = reactive([
    {
        label: 'Tipo Tributo',
        field: 'tipoTributo',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '7%'
    },
    {
        label: 'Código',
        field: 'codigo',
        tipoField: 'integer',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '7%'
    },
    {
        label: 'Nome',
        field: 'nome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '25%'
    },
    {
        label: 'Alíquota Zero',
        field: 'aliquotaZero',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Controla Imposto Retido',
        field: 'controlaImpostoRetido',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Destaca ST Saída',
        field: 'destacaStSaida',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Excluir ICMS da Base Cálculo',
        field: 'excluirIcmsBaseCalculo',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Excluir ICMS da BC PIS COFINS',
        field: 'excluirIcmsBcPiscofins',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Exige Alíquota Desonerada',
        field: 'exigeAliquotaDesonerada',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Não Excluir ICMS Entrada',
        field: 'naoExcluirIcmsEntrada',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Requer Mensagem Fiscal',
        field: 'requerMensagemFiscal',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
    {
        label: 'Simples Nacional',
        field: 'simplesNacional',
        tipoField: 'boolean',
        filter: true,
        matchMode: 'equal',
        placeholder: '',
        size: '5%'
    },    
]);

const openNew = () => {
    mode.value = 'create';
    crudDialog.value = true;
};

const openEdit = (selectId) => {
    mode.value = 'edit';
    id.value = selectId;
    crudDialog.value = true;
};


const openDelete = async (dados) => {
    const textoConfirmacao = `Após a exclusão da Situação Tributária, ${dados.codigo}, você não poderá reverter isso!`
    const textoSucesso = `A Situação Tributária, ${dados.codigo}, foi excluido com sucesso.`
    const textoCancelado = "A exclusão da Situação Tributária não foi realizada :)"
    
    const result = await execute(Service, dados.id, textoConfirmacao, textoSucesso, textoCancelado);
    if (result) crudlista.value.reload();
};

const closeDialog = () => {
    crudDialog.value = false;
    if (crudlista.value) crudlista.value.reload();
};
</script>

<template>
    <UWPageCrud ref="crudlista" tag="situacaotributaria" title="Situação Tributária" :columns="columns" :service="Service" @openNew="openNew" @openEdit="openEdit" @openDelete="openDelete" />
    <ManutencaoSituacaoTributaria :id="id" :showDialog="crudDialog" :mode="mode" @closeDialog="closeDialog" />
</template>
