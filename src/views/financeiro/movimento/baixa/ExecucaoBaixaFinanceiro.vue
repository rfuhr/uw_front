<script setup>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import _ from 'lodash';
import * as yup from 'yup';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useContexto } from '@/stores';
import { TipoOperacaoFinanceiraService, TituloService, DepartamentoService, OperacaoAcessoriaFinanceiraService, BancoService, 
    AgenciaService, ContaService } from '@/service';

const emit = defineEmits(['doCancelar']);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: () => {}
});

const tituloSelecionadoSchema = yup.object().shape({
    nossoNumero: yup.string().required('Nosso Número é obrigatório'),
    valorMovimento: yup.number().required('Saldo Parcela é obrigatório'),
    valorBaixa: yup
        .number()
        .optional()
        .test('is-less-than-valorA', 'Valor da Baixa não pode ser maior que Saldo Parcela', function (value) {
            return value <= this.parent.valorMovimento;
        }),
    valorTotal: yup.number().optional().min(0, 'Valor Total da baixa deve ser maior ou igual a zero')
});

const createSchema = () => {
    return yup.object().shape({
        dataMovimento: yup.date().required('Data de movimento é obrigatória').max(new Date(), 'Data de Movimento deve ser menor que a data atual.'),
        departamentoId: yup.number().required('Departamento é obrigatório'),
        tipoOperacaoFinanceiraId: yup.number().required('Tipo de operação financeira é obrigatório'),
        titulosSelecionados: yup.array().of(tituloSelecionadoSchema).min(1, 'Selecione ao menos um título para baixa')
    });
};
const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY } = useFormatDate();
const { formatDocumento } = useFormatDocumentos();
const contextoStore = useContexto();
const formData = ref({
    dataMovimento: new Date(),
    departamentoId: null,
    tipoOperacaoFinanceiraId: null,
    titulosSelecionados: []
});
const dataInformaPrincipal = ref({
    valorBaixa: 0,
    valorSaldo: 0
});

const dataInformaJuros = ref([]);
const dataInformaDescontos = ref([]);

const op = ref();
const opJuros = ref();
const opDescontos = ref();
const tiposJuros = ref([]);
const tiposDescontos = ref([]);
const seletorAgencia = ref(null);
const seletorConta = ref(null);
const tipoOperacaoFinanceira = ref({});

const handleCancelar = () => {
    emit('doCancelar');
};

const handleBaixaTitulos = async () => {
    const baixaTituloRequest = montarBaixaTituloRequest();
    await TituloService.baixaTitulo(baixaTituloRequest)
        .then(() => {
            Swal.fire('Sucesso', 'Baixas realizadas com sucesso', 'success');
            emit('doCancelar');
        })
        .catch(() => {
            Swal.fire('Falha', 'Ocorreu uma falha no processo de baixa de título', 'error');
        })
        .finally(() => {});
};

const onSelectTitulo = (event) => {
    event.data.valorBaixa = event.data.valorMovimento;
    event.data.valorJuros = 0;
    event.data.valorDesconto = 0;
    event.data.valorTotal = event.data.valorBaixa + event.data.valorJuros - event.data.valorDesconto;
    event.data.juros = [];
    event.data.descontos = [];
};

const onRowUnselectTitulo = (event) => {
    event.data.valorBaixa = 0;
    event.data.valorJuros = 0;
    event.data.valorDesconto = 0;
    event.data.valorTotal = 0;
    event.data.juros = [];
    event.data.descontos = [];
};

const onSelectAllTitulo = (event) => {
    event.data.forEach((titulo) => {
        if (titulo.valorBaixa === 0) {
            titulo.valorBaixa = titulo.valorMovimento;
            titulo.valorJuros = 0;
            titulo.valorDesconto = 0;
            titulo.valorTotal = titulo.valorBaixa + titulo.valorJuros - titulo.valorDesconto;
            titulo.juros = [];
            titulo.descontos = [];
        }
    });
};

const onUnselectAllTitulo = () => {
    localModelValue.value.forEach((titulo) => {
        titulo.valorBaixa = 0;
        titulo.valorJuros = 0;
        titulo.valorDesconto = 0;
        titulo.valorTotal = 0;
        titulo.juros = [];
        titulo.descontos = [];
    });
};
const montarBaixaTituloRequest = () => {
    return {
        dataMovimento: formData.value.dataMovimento,
        departamentoId: formData.value.departamentoId,
        tipoOperacaoFinanceiraId: formData.value.tipoOperacaoFinanceiraId,
        observacao: formData.value.observacao,
        contaId: tipoOperacaoFinanceira.value.integracaoCaixaBanco !== 'N' ? formData.value.contaId : null,
        selecionados: formData.value.titulosSelecionados.map((titulo) => {
            return {
                parcial: titulo.parcial,
                tituloId: titulo.tituloId,
                parcelaFinanceiroId: titulo.parcelaFinanceiroId,
                movimentoFinanceiroId: titulo.movimentoFinanceiroId,
                valorBaixa: titulo.valorBaixa,
                valorJuros: titulo.valorJuros,
                valorDesconto: titulo.valorDesconto,
                valorTotal: titulo.valorTotal,
                juros: titulo.juros.filter((juro) => juro.valor > 0).map((juro) => {
                    return {
                        operacaoAcessoriaFinanceiraId: juro.operacaoAcessoriaFinanceiraId,
                        valor: juro.valor
                    };
                }),
                descontos: titulo.descontos.filter((desconto) => desconto.valor > 0).map((desconto) => {
                    return {
                        operacaoAcessoriaFinanceiraId: desconto.operacaoAcessoriaFinanceiraId,
                        valor: desconto.valor
                    };
                })
            };
        })
    };
};

const definirValorPrincipal = (event, movimentoFinanceiroId) => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === movimentoFinanceiroId);
    dataInformaPrincipal.value.movimentoFinanceiroId = movimentoFinanceiroId;
    dataInformaPrincipal.value.valorMovimento = parcela.valorMovimento;
    dataInformaPrincipal.value.valorBaixa = parcela.valorBaixa;
    op.value.toggle(event);
};

const blurAlterarValorBaixa = () => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === dataInformaPrincipal.value.movimentoFinanceiroId);
    parcela.valorBaixa = dataInformaPrincipal.value.valorBaixa;
    parcela.valorTotal = parcela.valorBaixa + parcela.valorJuros - parcela.valorDesconto;
    if (parcela.valorBaixa <= 0) {
        parcela.valorJuros = 0;
        parcela.valorDesconto = 0;
        _.remove(formData.value.titulosSelecionados, (obj) => obj.movimentoFinanceiroId === parcela.movimentoFinanceiroId);
        formData.value.titulosSelecionados = [...formData.value.titulosSelecionados];
    } else {
        parcela.parcial = true;
        if (!_.find(formData.value.titulosSelecionados, { movimentoFinanceiroId: parcela.movimentoFinanceiroId })) {
            formData.value.titulosSelecionados = [...formData.value.titulosSelecionados, parcela];
        }
    }
};

const definirValorJuros = (event, movimentoFinanceiroId) => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === movimentoFinanceiroId);
    if (!parcela.juros || parcela.juros.length === 0) parcela.juros = [];

    parcela.juros = tiposJuros.value.map((juro) => {
        const juroParcela = parcela.juros.find((juroParcela) => juroParcela.operacaoAcessoriaFinanceiraId === juro.id);
        return {
            movimentoFinanceiroId: movimentoFinanceiroId,
            operacaoAcessoriaFinanceiraId: juro.id,
            operacaoAcessoriaFinanceiraNome: juro.nome,
            valor: juroParcela ? juroParcela.valor : 0
        };
    });
    dataInformaJuros.value = parcela.juros;
    opJuros.value.toggle(event);
};

const definirValorDesconto = (event, movimentoFinanceiroId) => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === movimentoFinanceiroId);
    if (!parcela.descontos || parcela.descontos.length === 0) parcela.descontos = [];

    parcela.descontos = tiposDescontos.value.map((desconto) => {
        const descontoParcela = parcela.descontos.find((descontoParcela) => descontoParcela.operacaoAcessoriaFinanceiraId === desconto.id);
        return {
            movimentoFinanceiroId: movimentoFinanceiroId,
            operacaoAcessoriaFinanceiraId: desconto.id,
            operacaoAcessoriaFinanceiraNome: desconto.nome,
            valor: descontoParcela ? descontoParcela.valor : 0
        };
    });
    dataInformaDescontos.value = parcela.descontos;
    opDescontos.value.toggle(event);
};

const temErro = (errors, str) => {
    let caminhoEncontrado = false;
    _.forEach(errors, (value) => {
        if (_.startsWith(value, str)) {
            caminhoEncontrado = true;
            return false;
        }
    });
    return caminhoEncontrado;
};

const rowClass = (data) => {
    return [{ 'bg-red-100': data.valorBaixa > data.valorMovimento || data.valorTotal < 0, 'bg-green-100': _.find(formData.value.titulosSelecionados, { movimentoFinanceiroId: data.movimentoFinanceiroId }) }];
};

const onKeyDown = (event, data) => {
    if (event.key === 'Enter') {
        blurAlterarValorBaixa(data);
        op.value.hide();
    }
};

const calcTotalJuros = computed({
    get: () => dataInformaJuros.value.reduce((acc, juro) => acc + juro.valor, 0) | 0
});

const blurAlterarValorJuros = (data) => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === data.movimentoFinanceiroId);
    parcela.juros = dataInformaJuros.value;
    parcela.valorJuros = calcTotalJuros.value;
    parcela.valorTotal = parcela.valorBaixa + parcela.valorJuros - parcela.valorDesconto;
    if (parcela.valorJuros <= 0) {
        parcela.valorJuros = 0;
        _.remove(formData.value.titulosSelecionados, (obj) => obj.movimentoFinanceiroId === parcela.movimentoFinanceiroId && obj.valorTotal <= 0);
        formData.value.titulosSelecionados = [...formData.value.titulosSelecionados];
    } else {
        parcela.parcial = parcela.valorBaixa !== parcela.valorMovimento;
        if (parcela.valorBaixa > 0)
            if (!_.find(formData.value.titulosSelecionados, { movimentoFinanceiroId: parcela.movimentoFinanceiroId })) {
                formData.value.titulosSelecionados = [...formData.value.titulosSelecionados, parcela];
            }
    }
};

const onKeyDownJuros = (event, data) => {
    if (event.key === 'Enter') {
        blurAlterarValorJuros(data);
        opJuros.value.hide();
    }
};

const calcTotalDescontos = computed({
    get: () => dataInformaDescontos.value.reduce((acc, desconto) => acc + desconto.valor, 0) | 0
});

const blurAlterarValorDescontos = (data) => {
    const parcela = localModelValue.value.find((item) => item.movimentoFinanceiroId === data.movimentoFinanceiroId);
    parcela.descontos = dataInformaDescontos.value;
    parcela.valorDesconto = calcTotalDescontos.value;
    parcela.valorTotal = parcela.valorBaixa + parcela.valorJuros - parcela.valorDesconto;
    if (parcela.valorDesconto <= 0) {
        parcela.valorDesconto = 0;
        _.remove(formData.value.titulosSelecionados, (obj) => obj.movimentoFinanceiroId === parcela.movimentoFinanceiroId && obj.valorTotal <= 0);
        formData.value.titulosSelecionados = [...formData.value.titulosSelecionados];
    } else {
        parcela.parcial = parcela.valorBaixa !== parcela.valorMovimento;
        if (parcela.valorBaixa > 0)
            if (!_.find(formData.value.titulosSelecionados, { movimentoFinanceiroId: parcela.movimentoFinanceiroId })) {
                formData.value.titulosSelecionados = [...formData.value.titulosSelecionados, parcela];
            }
    }
};

const onKeyDownDescontos = (event, data) => {
    if (event.key === 'Enter') {
        blurAlterarValorDescontos(data);
        opDescontos.value.hide();
    }
};

onMounted(() => {
    OperacaoAcessoriaFinanceiraService.getJuros()
        .then((response) => {
            tiposJuros.value = response;
        })
        .catch(() => {});
    OperacaoAcessoriaFinanceiraService.getDescontos()
        .then((response) => {
            tiposDescontos.value = response;
        })
        .catch(() => {});
});

const rowStyle = (data) => {
    if (data.tipoTituloSigla === 'PAG') {
        return { color: 'var(--red-600)' };
    }
    if (data.tipoTituloSigla === 'REC') {
        return { color: 'var(--blue-600)' };
    }
};

const quantidadeReceber = computed({
    get: () => localModelValue.value.filter((item) => item.tipoTituloSigla === 'REC').length
});

const quantidadePagar = computed({
    get: () => localModelValue.value.filter((item) => item.tipoTituloSigla === 'PAG').length
});

const quantidadeReceberSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'REC').length
});

const quantidadePagarSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'PAG').length
});

const valorPrincipalReceber = computed({
    get: () => localModelValue.value.filter((item) => item.tipoTituloSigla === 'REC').reduce((acc, item) => acc + item.valorMovimento, 0)
});

const valorPrincipalPagar = computed({
    get: () => localModelValue.value.filter((item) => item.tipoTituloSigla === 'PAG').reduce((acc, item) => acc + item.valorMovimento, 0)
});

const valorPrincipalReceberSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'REC').reduce((acc, item) => acc + item.valorBaixa, 0)
});

const valorPrincipalPagarSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'PAG').reduce((acc, item) => acc + item.valorBaixa, 0)
});

const valorJurosReceberSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'REC').reduce((acc, item) => acc + item.valorJuros, 0)
});

const valorJurosPagarSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'PAG').reduce((acc, item) => acc + item.valorJuros, 0)
});

const valorDescontoReceberSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'REC').reduce((acc, item) => acc + item.valorDesconto, 0)
});

const valorDescontoPagarSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'PAG').reduce((acc, item) => acc + item.valorDesconto, 0)
});

const valorTotalReceberSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'REC').reduce((acc, item) => acc + item.valorTotal, 0)
});

const valorTotalPagarSelecionado = computed({
    get: () => formData.value.titulosSelecionados.filter((item) => item.tipoTituloSigla === 'PAG').reduce((acc, item) => acc + item.valorTotal, 0)
});

const onChangeBanco = (value) => {
    if (value) {
        seletorAgencia.value.reload();
        seletorConta.value.reload();
    } else {
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};

const onChangeAgencia = (value) => {
    if (value) {
        seletorConta.value.reload();
    } else {
        formData.value.contaId = null;
    }
};

const  onChangeTipoOperacaoFinanceira = async (value) => {
    if (value) {
        tipoOperacaoFinanceira.value = value;
    } else {
        tipoOperacaoFinanceira.value = {};
    }
};

</script>

<template>
    <UWPageBase title="Baixa de Títulos">
        <UWForm :schema="createSchema()" :values="formData" ref="formBaixa" @doSubmit="handleBaixaTitulos" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-9">
                        <UWFieldSet title="Informações da baixa">
                            <div class="p-fluid formgrid grid">
                                <UWCalendar id="dataMovimento" label="Data de Movimento" dateFormat="dd/mm/yy" disabled required v-model="formData.dataMovimento" :errors="errors.value?.dataMovimento" classContainer="col-12 md:col-2" />
                                <UWSeletor
                                    :id="departamento"
                                    classContainer="col-12 md:col-5"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWSeletor
                                    id="tipoTitulo"
                                    classContainer="col-12 md:col-5"
                                    v-model="formData.tipoOperacaoFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo de Operação Financeira"
                                    :service="TipoOperacaoFinanceiraService"
                                    placeholder="Selecione o tipo de operação"
                                    :columnsFilters="[{ field: 'selecionaBaixa', value: true, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'selecionaBaixa' }]"
                                    :erros="errors.value?.tipoOperacaoFinanceiraId"
                                    @changeObject="onChangeTipoOperacaoFinanceira"
                                />
                                <UWSeletor
                                    id="banco"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.bancoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N'"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N'"
                                    label="Banco"
                                    :service="BancoService"
                                    placeholder="Selecione o banco"
                                    :erros="errors.value?.bancoId"
                                    @changeObject="onChangeBanco"
                                />
                                <UWSeletor
                                    id="agencia"
                                    ref="seletorAgencia"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.agenciaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N'"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N'"
                                    label="Agência"
                                    :service="AgenciaService"
                                    placeholder="Selecione a agência"
                                    :columnsFilters="[{ field: 'banco', value: formData.bancoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'banco.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeAgencia"
                                />
                                <UWSeletor
                                    id="conta"
                                    ref="seletorConta"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.contaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    :required="tipoOperacaoFinanceira.integracaoCaixaBanco !== 'N'"
                                    :disabled="!tipoOperacaoFinanceira.integracaoCaixaBanco || tipoOperacaoFinanceira.integracaoCaixaBanco === 'N'"
                                    label="Conta"
                                    :service="ContaService"
                                    placeholder="Selecione a conta"
                                    :columnsFilters="[{ field: 'agencia', value: formData.agenciaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'agencia.id' }]"
                                    :erros="errors.value?.agenciaId"
                                    @changeObject="onChangeConta"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-3">
                        <UWFieldSet title="Observação" class="h-full">
                            <div class="h-full col-12">
                                <!-- <UWTextArea id="observacao" label="Observação" v-model="formData.observacao" :errors="errors.value?.observacao" classContainer="h-full col-12 md:col-12" style="height: 100%"/> -->
                                <TextArea id="observacao" v-model="formData.observacao" class="w-full h-full" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12" v-if="errors.value?.titulosSelecionados || temErro(errors?.value, 'Valor da Baixa não pode ser maior que Saldo Parcela') || temErro(errors?.value, 'Valor Total da baixa deve ser maior ou igual a zero')">
                        <Message class="col-12 p-0 m-0" :closable="false" severity="error" v-if="errors.value?.titulosSelecionados">{{ errors.value?.titulosSelecionados }}</Message>
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'Valor da Baixa não pode ser maior que Saldo Parcela')"
                            >Atenção! Existem títulos selecionados com valor de baixa maior que saldo da parcela.</Message
                        >
                        <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'Valor Total da baixa deve ser maior ou igual a zero')"
                            >Atenção! Existem títulos selecionados com valor de total menor que 0.</Message
                        >
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Títulos a serem baixados">
                            <DataTable
                                :value="localModelValue"
                                v-model:selection="formData.titulosSelecionados"
                                paginator
                                :rows="10"
                                :rowClass="rowClass"
                                :rowStyle="rowStyle"
                                dataKey="movimentoId"
                                showGridlines
                                size="small"
                                stripedRows
                                @rowSelect="onSelectTitulo"
                                @rowUnselect="onRowUnselectTitulo"
                                @rowSelectAll="onSelectAllTitulo"
                                @rowUnselectAll="onUnselectAllTitulo"
                            >
                                <template #empty> Sem títulos selecionados para baixa. </template>
                                <Column selectionMode="multiple" headerStyle="width: 3rem" headerClass="columnHeaderItem"></Column>
                                <Column field="tipoTituloSigla" header="Tipo" sortable headerClass="columnHeaderItem" />
                                <Column field="valorBaixa" header="Baixa" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <Button :label="formatNumber(slotProps.data.valorBaixa, 2)" :style="rowStyle(slotProps.data)" link class="buttonValores" @click="(event) => definirValorPrincipal(event, slotProps.data.movimentoFinanceiroId)" />
                                        <OverlayPanel ref="op">
                                            <div class="flex flex-column gap-3">
                                                <div>
                                                    <span class="font-medium text-900 block mb-2">Informe o valor principal</span>
                                                    <div class="flex flex-column gap-2">
                                                        <UWCurrency label="Saldo da Parcela" disabled v-model="dataInformaPrincipal.valorMovimento" />
                                                        <UWCurrency label="Valor da Baixa" v-model="dataInformaPrincipal.valorBaixa" @blur="blurAlterarValorBaixa(slotProps.data)" @keydown="(event) => onKeyDown(event, slotProps.data)" />
                                                    </div>
                                                </div>
                                            </div>
                                        </OverlayPanel>
                                    </template>
                                </Column>
                                <Column field="valorJuros" header="Juros" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <Button :label="formatNumber(slotProps.data.valorJuros, 2)" link :style="rowStyle(slotProps.data)" class="buttonValores" @click="(event) => definirValorJuros(event, slotProps.data.movimentoFinanceiroId)" />
                                        <OverlayPanel ref="opJuros">
                                            <div class="flex flex-col gap-3">
                                                <div>
                                                    <span class="font-medium text-900 block mb-2">Informe os Juros</span>
                                                    <div class="flex flex-column gap-2">
                                                        <div v-for="dataInforma in dataInformaJuros" :key="dataInforma.operacaoAcessoriaFinanceiraId">
                                                            <UWCurrency
                                                                :label="dataInforma.operacaoAcessoriaFinanceiraNome"
                                                                v-model="dataInforma.valor"
                                                                @blur="blurAlterarValorJuros(dataInforma)"
                                                                @keydown="(event) => onKeyDownJuros(event, dataInforma)"
                                                            />
                                                        </div>
                                                        <UWCurrency v-if="dataInformaJuros.length > 1" label="Total de Juros" disabled v-model="calcTotalJuros" />
                                                    </div>
                                                </div>
                                            </div>
                                        </OverlayPanel>
                                    </template>
                                </Column>
                                <Column field="valorDesconto" header="Desconto" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <Button
                                            :label="formatNumber(slotProps.data.valorDesconto, 2)"
                                            link
                                            :style="rowStyle(slotProps.data)"
                                            class="buttonValores"
                                            @click="(event) => definirValorDesconto(event, slotProps.data.movimentoFinanceiroId)"
                                        />
                                        <OverlayPanel ref="opDescontos">
                                            <div class="flex flex-col gap-3">
                                                <div>
                                                    <span class="font-medium text-900 block mb-2">Informe os Descontos</span>
                                                    <div class="flex flex-column gap-2">
                                                        <div v-for="dataInforma in dataInformaDescontos" :key="dataInforma.operacaoAcessoriaFinanceiraId">
                                                            <UWCurrency
                                                                :label="dataInforma.operacaoAcessoriaFinanceiraNome"
                                                                v-model="dataInforma.valor"
                                                                @blur="blurAlterarValorDescontos(dataInforma)"
                                                                @keydown="(event) => onKeyDownDescontos(event, dataInforma)"
                                                            />
                                                        </div>
                                                        <UWCurrency v-if="dataInformaDescontos.length > 1" label="Total de Descontos" disabled v-model="calcTotalDescontos" />
                                                    </div>
                                                </div>
                                            </div>
                                        </OverlayPanel>
                                    </template>
                                </Column>
                                <Column field="valorTotal" header="Total" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorTotal | 0, 2) }}</div>
                                    </template>
                                </Column>
                                <Column field="valorMovimento" header="Saldo" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorMovimento, 2) }}</div>
                                    </template>
                                </Column>
                                <Column field="siglaCarteira" header="Carteira" sortable headerClass="columnHeaderItem" />
                                <Column field="parceiroLocalCpfCnpj" header="Parceiro" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatDocumento(slotProps.data.parceiroLocalCpfCnpj) }}</div>
                                    </template>
                                </Column>
                                <Column field="empresaFilialSigla" header="Filial" sortable headerClass="columnHeaderItem" />
                                <Column field="departamentoSigla" header="Depto" sortable headerClass="columnHeaderItem" />
                                <Column field="nossoNumero" header="Nosso Número" sortable headerClass="columnHeaderItem" />
                                <Column field="numeroParcela" header="Parcela" sortable headerClass="columnHeaderItem" />
                                <Column field="documento" header="Documento" sortable headerClass="columnHeaderItem" />
                                <Column field="dataVencimento" header="Vencimento" sortable headerClass="columnHeaderItem">
                                    <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div>
                                    </template>
                                </Column>
                                <Column field="caracteristicaMovimentoSigla" header="Carac. Mov." sortable headerClass="columnHeaderItem" />
                            </DataTable>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <div class="grid nested-grid">
                            <div class="col-8">
                                <UWFieldSet title="Resumo" class="h-full">
                                    <div class="formgrid grid">
                                        <div class="container">
                                            <div class="summary">
                                                <table class="summary-table">
                                                    <thead>
                                                        <tr>
                                                            <th></th>
                                                            <th colspan="2">Selecionados</th>
                                                            <th colspan="2">Marcados para Baixa</th>
                                                        </tr>
                                                        <tr>
                                                            <th></th>
                                                            <th>Receber</th>
                                                            <th>Pagar</th>
                                                            <th>Receber</th>
                                                            <th>Pagar</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Quantidade</td>
                                                            <td class="receber">{{ formatNumber(quantidadeReceber, 0) }}</td>
                                                            <td class="pagar">{{ formatNumber(quantidadePagar, 0) }}</td>
                                                            <td class="receber">{{ formatNumber(quantidadeReceberSelecionado, 0) }}</td>
                                                            <td class="pagar">{{ formatNumber(quantidadePagarSelecionado, 0) }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Valor Principal</td>
                                                            <td class="receber">{{ formatNumber(valorPrincipalReceber, 2) }}</td>
                                                            <td class="pagar">{{ formatNumber(valorPrincipalPagar, 2) }}</td>
                                                            <td class="receber">{{ formatNumber(valorPrincipalReceberSelecionado, 2) }}</td>
                                                            <td class="pagar">{{ formatNumber(valorPrincipalPagarSelecionado, 2) }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Acréscimos</td>
                                                            <td class="receber tracejado"></td>
                                                            <td class="pagar tracejado"></td>
                                                            <td class="receber">{{ formatNumber(valorJurosReceberSelecionado, 2) }}</td>
                                                            <td class="pagar">{{ formatNumber(valorJurosPagarSelecionado, 2) }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Descontos</td>
                                                            <td class="receber tracejado"></td>
                                                            <td class="pagar tracejado"></td>
                                                            <td class="receber">{{ formatNumber(valorDescontoReceberSelecionado, 2) }}</td>
                                                            <td class="pagar">{{ formatNumber(valorDescontoPagarSelecionado, 2) }}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td class="receber tracejado"></td>
                                                            <td class="pagar tracejado"></td>
                                                            <td class="receber">{{ formatNumber(valorTotalReceberSelecionado, 2) }}</td>
                                                            <td class="pagar">{{ formatNumber(valorTotalPagarSelecionado, 2) }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-4">
                                <UWFieldSet title="Legenda" class="h-full flex flex-column justify-content-start">
                                    <div class="formgrid grid"></div>
                                    <div class="formgrid grid">
                                        <div class="col-12 md:col-12 flex justify-content-end gap-2">
                                            <div class="legend">
                                                <ul>
                                                    <li class="receber">Contas a Receber</li>
                                                    <li class="pagar">Contas à Pagar</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </UWFieldSet>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>

<style>
.columnHeaderItem .p-column-title {
    text-align: center;
    width: 100%;
}
.buttonValores.p-button {
    text-align: right;
    width: 100%;
    padding: 0 0.6rem;
    text-decoration: underline;
}

.container {
    display: flex;
    width: 100%;
    font-size: 1rem;
    line-height: 0.6rem;
}
.summary {
    padding: 10px;
}
.summary {
    flex: 3;
}
.legend {
    flex: 1;
}
.summary-table {
    width: 100%;
    border-collapse: collapse;
}
.summary-table th,
.summary-table td {
    border: 1px solid rgb(218, 215, 215);
    text-align: center;
    padding: 5px;
}
.summary-table th {
    background-color: rgb(167, 189, 247);
}
.receber {
    color: var(--blue-600);
}
.pagar {
    color: var(--orange-600);
}
.tracejado {
    /* width: 100%; */
    height: 100%;
    /* background-color: rgb(218, 215, 215); */
    background: repeating-linear-gradient(135deg, rgb(218, 215, 215), rgb(218, 215, 215) 1px, transparent 1px, transparent 2px);
}
</style>
