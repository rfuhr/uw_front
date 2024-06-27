<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useContexto } from '@/stores';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { MovimentoCaixaBancoService, DepartamentoService, OperacaoCaixaBancoService, BancoService, AgenciaService, ContaService, FatoGeradorService, GrupoFinanceiroService, HistoricoPadraoService } from '@/service';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';    

const createSchema = () => {
    return yup.object().shape({
        dataMovimento: yup.date().required('Data de movimento é obrigatória.'),
        departamentoId: yup.number().required('Departamento é obrigatório.'),
        bancoId: yup.number().required('Banco é obrigatório.'),
        agenciaId: yup.number().required('Agência é obrigatória.'),
        contaId: yup.number().required('Conta é obrigatória.'),
        operacaoCaixaBancoId: yup.number().required('Operação é obrigatória.'),
        numeroDocumento: yup.number().test('digitaDocumento', 'Número do documento é obrigatório.', function (value) {
            return operacaoSelecionada.value.digitaDocumento ? value !== undefined : true;
        }),
        dataMovimentoBanco: yup.date().test('digitaDataMovimento', 'Data de movimento do banco é obrigatória.', function (value) {
            return operacaoSelecionada.value.digitaDataMovimento ? value !== undefined : true;
        }),
        dataVencimento: yup.date().test('digitaVencimento', 'Data de vencimento é obrigatória.', function (value) {
            return operacaoSelecionada.value.digitaVencimento ? value !== undefined : true;
        }),
        parceiroLocalId: yup.number().test('digitaParceiro', 'Parceiro é obrigatório.', function (value) {
            return operacaoSelecionada.value.digitaParceiro ? value !== undefined : true;
        }),
        fatoGeradorId: yup.number().test('digitaFatoGerador', 'Fato gerador é obrigatório.', function (value) {
            return operacaoSelecionada.value.digitaFatoGerador ? value !== undefined : true;
        }),
        historicoPadraoId: yup.number().test('digitaHistoricoPadrao', 'Histórico padrão é obrigatório.', function (value) {
            return operacaoSelecionada.value.digitaHistoricoPadrao ? value !== undefined : true;
        }),
        complementoHP: yup.string().test('digitaComplementoHp', 'Complemento do histórico é obrigatório.', function (value) {
            return operacaoSelecionada.value.digitaComplementoHp ? value !== undefined : true;
        }),
        valor: yup.number().required('Valor é obrigatório.')
    });
};

const router = useRouter();
const contextoStore = useContexto();
const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY, formatToUTC } = useFormatDate();

const formData = ref({
    dataMovimento: new Date(),
    empresaFilialId: null,
    departamentoId: null
});
const multiplosLancamentos = ref(false);
const operacaoSelecionada = ref({});
const contaSelecionada = ref({});
const fatoGeradorSelecionado = ref({});
const grupoFinanceiroSelecionado = ref({});
const historicoPadraoSelecionado = ref({});
const parceiroLocalSelecionado = ref({});
const seletorAgencia = ref(null);
const seletorConta = ref(null);
const seletorOperacao = ref(null);
const gravandoLancamento = ref(false);
const lancamentosEfetuados = ref([]);

const handleCancelar = () => {
    router.push({ path: '/financeiro/movimento/lancamento-caixa-banco' });
};

const onChangeOperacao = (value) => {
    if (value) {
        operacaoSelecionada.value = value;
        if (!value.digitaDocumento) formData.value.numeroDocumento = undefined;
        if (!value.digitaVencimento) formData.value.dataVencimento = undefined;
        if (!value.digitaDataMovimento) formData.value.dataMovimentoBanco = undefined;
        if (!value.digitaParceiro) formData.value.parceiroLocalId = undefined;
        else {
            if (value.parceiroLocalIdDefault !== null) formData.value.parceiroLocalId = value.parceiroLocalIdDefault;
        }
        if (!value.digitaFatoGerador) formData.value.fatoGeradorId = undefined;
        else {
            if (value.fatoGeradorIdDefault !== null) formData.value.fatoGeradorId = value.fatoGeradorIdDefault;
        }
        if (!value.digitaHistoricoPadrao) formData.value.historicoPadraoId = undefined;
        else {
            if (value.historicoPadraoIdDefault !== null) formData.value.historicoPadraoId = value.historicoPadraoIdDefault;
        }
        if (!value.digitaComplementoHp) formData.value.complementoHP = undefined;
    } else {
        operacaoSelecionada.value = {};
        formData.value.numeroDocumento = undefined;
        formData.value.dataVencimento = undefined;
        formData.value.dataMovimentoBanco = undefined;
        formData.value.parceiroLocalId = undefined;
        formData.value.fatoGeradorId = undefined;
        formData.value.historicoPadraoId = undefined;
        formData.value.complementoHP = undefined;
    }
};

const onChangeBanco = (value) => {
    if (value) {
        seletorAgencia.value.reload();
        seletorConta.value.reload();
        contaSelecionada.value = value;
    } else {
        formData.value.agenciaId = null;
        formData.value.contaId = null;
    }
};

const onChangeAgencia = (value) => {
    if (value) {
        seletorConta.value.reload();
        contaSelecionada.value = value;
    } else {
        formData.value.contaId = null;
    }
};

const onChangeConta = (value) => {
    if (!value) {
        formData.value.operacaoCaixaBancoId = null;
        onChangeOperacao(null);
        contaSelecionada.value = null;
        inicializarFormData();
        formData.value.operacaoCaixaBancoId = null;
    } else {
        contaSelecionada.value = value;
        formData.value.operacaoCaixaBancoId = null;
        inicializarFormData();
    }
};

const onChangeFatoGerador = (value) => {
    if (value) {
        fatoGeradorSelecionado.value = value;
    } else {
        fatoGeradorSelecionado.value = null;
    }
};

const onChangeGrupoFinanceiro = (value) => {
    if (value) {
        grupoFinanceiroSelecionado.value = value;
    } else {
        grupoFinanceiroSelecionado.value = null;
    }
};

const onChangeHistoricoPadrao = (value) => {
    if (value) {
        historicoPadraoSelecionado.value = value;
    } else {
        historicoPadraoSelecionado.value = null;
    }
};

const onChangeParceiroLocal = (value) => {
    if (value) {
        parceiroLocalSelecionado.value = value;
    } else {
        parceiroLocalSelecionado.value = null;
    }
};
const quantidadeLancamentos = computed(() => {
    return lancamentosEfetuados.value.length;
});

const somaValorDebito = computed(() => {
    return lancamentosEfetuados.value.reduce((acc, lancamento) => {
        return lancamento.indicadorDC === 'D' ? acc + lancamento.valor : acc;
    }, 0);
});

const somaValorCredito = computed(() => {
    return lancamentosEfetuados.value.reduce((acc, lancamento) => {
        return lancamento.indicadorDC === 'C' ? acc + lancamento.valor : acc;
    }, 0);
});

const salvarRegistro = async () => {
    gravandoLancamento.value = true;
    const lancamentoRequest = montarLancamentoRequest();
    await MovimentoCaixaBancoService.create(lancamentoRequest).then(() => {
        if (multiplosLancamentos.value) {
            const lancamentoEfetuado = { ...lancamentoRequest };
            lancamentoEfetuado.operacaoCaixaBancoNome = operacaoSelecionada.value.nome;
            lancamentoEfetuado.parceiroLocalNome = parceiroLocalSelecionado.value.nome || '';
            lancamentoEfetuado.fatoGeradorNome = fatoGeradorSelecionado.value.nome || '';
            lancamentoEfetuado.grupoFinanceiroNome = grupoFinanceiroSelecionado.value.nome || '';
            lancamentoEfetuado.historicoPadraoNome = historicoPadraoSelecionado.value.nome || '';
            lancamentosEfetuados.value.push(lancamentoEfetuado);
            
            inicializarFormData();
        } else {
            Swal.fire('Sucesso', 'Lançamento efetuado com sucesso', 'success');
            handleCancelar();
        }
    }).catch(() => {
        Swal.fire('Falha', 'Ocorreu uma falha no processo de lançamento de movimento', 'error');
    }).finally(() => {
        gravandoLancamento.value = false;
    });
};

const montarLancamentoRequest = () => {
    return {
        operacaoCaixaBancoId: formData.value.operacaoCaixaBancoId,
        contaId: formData.value.contaId,
        contaTransfId: null,
        dataMovimento: formatToUTC(formData.value.dataMovimento),
        numeroDocumento: formData.value.numeroDocumento,
        dataMovimentoBanco: formData.value.dataMovimentoBanco,
        dataVencimento: formData.value.dataVencimento,
        parceiroLocalId: formData.value.parceiroLocalId,
        fatoGeradorId: formData.value.fatoGeradorId,
        historicoPadraoId: formData.value.historicoPadraoId,
        complementoHP: formData.value.complementoHP,
        valor: formData.value.valor,
        indicadorDC: operacaoSelecionada.value.indicadorDC,
        compesado: false,
        grupoFinanceiroId: formData.value.grupoFinanceiroId,
        departamentoId: formData.value.departamentoId,
        nossoNumero: 1
    };
};

const inicializarFormData = () => {
    formData.value.dataMovimento = new Date();
    formData.value.numeroDocumento = undefined;
    formData.value.dataMovimentoBanco = undefined;
    formData.value.dataVencimento = undefined;
    formData.value.parceiroLocalId = undefined;
    formData.value.fatoGeradorId = undefined;
    formData.value.grupoFinanceiroId = undefined;
    formData.value.historicoPadraoId = undefined;
    formData.value.complementoHP = undefined;
    formData.value.valor = undefined;
};

onMounted(() => {
    inicializarFormData();
});

</script>

<template>
    <UWPageBase title="Lançamentos de Caixa e Bancos" subtitle="Realizar lançamentos de movimentações para caixas e bancos">
        <UWForm :schema="createSchema()" :values="formData" ref="formLancamentoCaixaBanco" @doSubmit="salvarRegistro" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-10">
                        <UWFieldSet title="Identificação do Lançamento" class="h-full">
                            <div class="formgrid grid">
                                <UWCalendar id="dataMovimento" label="Data de Movimento" dateFormat="dd/mm/yy" disabled required v-model="formData.dataMovimento" :errors="errors.value?.dataMovimento" classContainer="col-12 md:col-2" />
                                <!-- <UWSeletor
                                    :id="empresaFilial"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.empresaFilialId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    disabled
                                    label="Filial"
                                    :service="EmpresaFilialService"
                                    placeholder="Selecione a filial"
                                    :erros="errors.value?.empresaFilialId"
                                    :columnsFilters="[{ field: 'empresa', value: contextoStore.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                /> -->
                                <UWSeletor
                                    :id="departamento"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                    :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWSeletor
                                    id="banco"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.bancoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Banco"
                                    :service="BancoService"
                                    placeholder="Selecione o banco"
                                    :erros="errors.value?.bancoId"
                                    @changeObject="onChangeBanco"
                                />
                                <UWSeletor
                                    id="agencia"
                                    ref="seletorAgencia"
                                    classContainer="col-12 md:col-2"
                                    v-model="formData.agenciaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
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
                                    classContainer="col-12 md:col-2"
                                    v-model="formData.contaId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
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
                    <div class="col-2">
                        <UWFieldSet title="Configuração" class="h-full flex flex-column justify-content-center bg-red-50 border-solid">
                            <div class="formgrid grid">
                                <UWCheckBox label="Múltiplos lançamentos" v-model="multiplosLancamentos" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div :class="[multiplosLancamentos ? 'col-10' : 'col-12']">
                        <UWFieldSet title="Dados do Lançamento" class="h-full flex flex-column">
                            <div class="formgrid grid">
                                <UWSeletor
                                    :id="operacao"
                                    ref="seletorOperacao"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.operacaoCaixaBancoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    :disabled="!formData.contaId"
                                    label="Operação"
                                    :service="OperacaoCaixaBancoService"
                                    placeholder="Selecione a operação"
                                    :erros="errors.value?.operacaoCaixaBancoId"
                                    @changeObject="onChangeOperacao"
                                    :columnsFilters="[{ field: 'tipoContaCxBco', value: contaSelecionada.tipoContaCxBcoId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'tipoContaCxBco.id' }]"
                                />
                                <UWInput
                                    id="documento"
                                    label="Documento"
                                    uppercase
                                    v-model="formData.numeroDocumento"
                                    :required="operacaoSelecionada.digitaDocumento"
                                    :disabled="!operacaoSelecionada.digitaDocumento"
                                    :errors="errors.value?.numeroDocumento"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWCalendar
                                    id="dataMovimentoBanco"
                                    label="Data de Movimento do Banco"
                                    dateFormat="dd/mm/yy"
                                    :required="operacaoSelecionada.digitaDataMovimento"
                                    :disabled="!operacaoSelecionada.digitaDataMovimento"
                                    v-model="formData.dataMovimentoBanco"
                                    :errors="errors.value?.dataMovimentoBanco"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWCalendar
                                    id="dataVencimento"
                                    label="Data de Vencimento"
                                    dateFormat="dd/mm/yy"
                                    :required="operacaoSelecionada.digitaVencimento"
                                    :disabled="!operacaoSelecionada.digitaVencimento"
                                    v-model="formData.dataVencimento"
                                    :errors="errors.value?.dataVencimento"
                                    classContainer="col-12 md:col-2"
                                />
                                <UWParceiroLocal
                                    id="parceiroLocal"
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.parceiroLocalId"
                                    :required="operacaoSelecionada.digitaParceiro"
                                    :disabled="!operacaoSelecionada.digitaParceiro"
                                    label="Parceiro"
                                    :erros="errors.value?.parceiroLocalId"
                                    @changeObject="onChangeParceiroLocal"
                                />
                                <UWSeletor
                                    v-model="formData.fatoGeradorId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Fato Gerador"
                                    :required="operacaoSelecionada.digitaFatoGerador"
                                    :disabled="!operacaoSelecionada.digitaFatoGerador"
                                    :service="FatoGeradorService"
                                    placeholder="Selecione o fato gerador"
                                    :erros="errors.value?.fatoGeradorId"
                                    classContainer="col-12 md:col-4"
                                    @changeObject="onChangeFatoGerador"
                                />
                                <UWSeletor
                                    v-model="formData.grupoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Grupo Financeiro"
                                    :service="GrupoFinanceiroService"
                                    placeholder="Selecione o grupo financeiro"
                                    :erros="errors.value?.grupoFinanceiroId"
                                    classContainer="col-12 md:col-4"
                                    @changeObject="onChangeGrupoFinanceiro"
                                />
                                <UWSeletor
                                    v-model="formData.historicoPadraoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Histórico Padrão"
                                    :required="operacaoSelecionada.digitaHistoricoPadrao"
                                    :disabled="!operacaoSelecionada.digitaHistoricoPadrao"
                                    :service="HistoricoPadraoService"
                                    placeholder="Selecione o histórico padrão"
                                    :erros="errors.value?.historicoPadraoId"
                                    classContainer="col-12 md:col-4"
                                    @changeObject="onChangeHistoricoPadrao"
                                />
                                <UWInput
                                    id="complementoHP"
                                    label="Complemento Histórico"
                                    uppercase
                                    v-model="formData.complementoHP"
                                    :required="operacaoSelecionada.digitaComplementoHp"
                                    :disabled="!operacaoSelecionada.digitaComplementoHp"
                                    :errors="errors.value?.complementoHP"
                                    classContainer="col-12 md:col-4"
                                />
                                <div class="field col-12 md:col-4">
                                    <div class="p-inputgroup">
                                        <span class="p-float-label">
                                            <InputNumber id="valor" mode="currency" currency="BRL" locale="pt-Br" v-model="formData.valor" :class="{ 'text-700': true, 'w-full': true, 'p-invalid': errors.value?.valor }" />
                                            <label for="valor" v-required>Valor</label>
                                        </span>
                                        <span :class="['p-inputgroup-addon', 'text-white', {'bg-blue-600': operacaoSelecionada.indicadorDC === 'C'}, {'bg-red-600': operacaoSelecionada.indicadorDC === 'D'}]">
                                            <span>{{ operacaoSelecionada.indicadorDC }}</span>
                                        </span>
                                    </div>
                                    <span v-if="errors.value?.valor">
                                        <span v-for="(error, index) of errors.value?.valor" :key="index">
                                            <small class="p-error">{{ error }}</small>
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </UWFieldSet>
                    </div>
                    <div v-if="multiplosLancamentos" class="col-2">
                        <UWFieldSet title="Resumo" class="h-full flex flex-column justify-content-center bg-gray-100 border-solid">
                            <div class="formgrid grid">
                                <UWInteger id="quantidade" disabled label="Quantidade de Lançamentos" v-model="quantidadeLancamentos" classContainer="col-12 md:col-12" />
                                <UWCurrency id="valorDebitos" disabled label="Valor Débito" v-model="somaValorDebito" classContainer="col-12 md:col-12" />
                                <UWCurrency id="valorCreditos" disabled label="Valor Crédito" v-model="somaValorCredito" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div v-if="multiplosLancamentos" class="col-12">
                        <UWFieldSet title="Lançamentos Efetuados" class="h-full flex flex-column">
                            <div class="formgrid grid">
                                <DataTable :value="lancamentosEfetuados" :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 15]" :scrollable="true" :scrollHeight="'200px'"
                                    style="width: 100%;">
                                    <Column field="operacaoCaixaBancoNome" header="Operação" sortable></Column>
                                    <Column field="numeroDocumento" header="Documento" sortable></Column>
                                    <Column field="dataMovimentoBanco" header="Data Movimento Banco" sortable>
                                        <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataMovimentoBanco) }}</div> </template
                                    ></Column>
                                    <Column field="dataVencimento" header="Data Vencimento" sortable>
                                        <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div> </template
                                    >
                                    </Column>
                                    <Column field="parceiroLocalNome" header="Parceiro" sortable></Column>
                                    <Column field="fatoGeradorNome" header="Fato Gerador" sortable></Column>
                                    <Column field="grupoFinanceiroNome" header="Grupo Financeiro" sortable></Column> 
                                    <Column field="historicoPadraoNome" header="Histórico Padrão" sortable></Column>
                                    <Column field="complementoHP" header="Complemento HP" sortable></Column>
                                    <Column field="valor" header="Valor" sortable>
                                        <template #body="slotProps">
                                        <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valor, 2) }}</div> </template
                                    >
                                    </Column>
                                    <Column field="indicadorDC" header="DC" sortable></Column>
                                </DataTable>
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>
