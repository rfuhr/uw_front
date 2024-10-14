<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import * as yup from 'yup';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';
import {
    DepartamentoService,
    TiposService,
    BalancaService,
    UsuarioService,
    GrupoOperacaoAgricolaService,
    OrigemProducaoAgricolaService,
    ItemClassificacaoAgricolaService,
    ClassificacaoAgricolaService,
    RomaneioAgricolaService,
    ItemService,
    ParceiroLocalService,
    OperacaoInternaService,
    ContratoAgricolaService
} from '@/service';
import UWSeletorItemAgricola from '@/components/seletores/item/UWSeletorItemAgricola.vue';
import UWSeletorRegraAtividadeParceiro from '@/components/seletores/regraAtividade/UWSeletorRegraAtividadeParceiro.vue';
import UWSeletorOIAgricolaValidoRomaneio from '@/components/seletores/operacaoInterna/UWSeletorOIAgricolaValidoRomaneio.vue';
import UWSeletorSubItemClassAgricolaRomaneio from '@/components/seletores/subItemClassificacaoAgricola/UWSeletorSubItemClassAgricolaRomaneio.vue';
import UWSeletorSafraAgricola from '@/components/seletores/safra/UWSeletorSafraAgricola.vue';
import { useConfirm } from 'primevue/useconfirm';

import InformaPesagemManual from './InformaPesagemManual.vue';
import VincularNotaFiscal from './VincularNotaFiscal.vue';
const confirm = useConfirm();

const route = useRoute();
const router = useRouter();
const contextoStore = useContexto();
const { formatDate, formatToDDMMYYYY } = useFormatDate();
const { formatNumber } = useFormatNumber();
const toast = useToast();

const getToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return today;
};

const createSchemaClassificacoes = (dados) => {
    if (dados && dados.length > 0 && validacaoFechamento.value === true) {
        return yup.array().test('custom-validation', 'Erro de validação personalizado', function (values) {
            const errors = [];

            for (let i = 0; i < values.length; i++) {
                const { subItemClassificacaoAgricolaId } = values[i];

                if (!subItemClassificacaoAgricolaId) errors.push(this.createError({ message: 'Sub. item é obrigatório ser informado.', path: `classificacoes[${i}].subItemClassificacaoId` }));
            }

            if (errors.length > 0) {
                throw new yup.ValidationError(errors);
            }

            return true;
        });
    }
    return yup.mixed().optional();
};

const createSchema = () => {
    return yup.object().shape({
        dataDocumento: yup.date().required('Data do romaneio é obrigatória').max(getToday(), 'Data do Romaneio deve ser menor que a data atual.'),
        origem: yup.string().required('Origem do romaneio é obrigatório'),
        balancaId: formData.value.origem === '1' ? yup.number().required('Balança deve ser informada') : yup.number(),
        pesagemId: formData.value.origem === '2' ? yup.number().required('Pesagem deve ser informada') : yup.number(),
        itemId: yup.number().required('Produto deve ser informado'),
        parceiroLocalId: yup.number().required('Parceiro deve ser informado'),
        parceiroLocalPropriedadeId: yup.number().required('Propriedade deve ser informada'),
        regraAtividadeId: yup.number().required('Regra de Atividade deve ser informada'),
        grupoOperacaoAgricolaId: yup.number().required('Grupo de Operação Agrícola deve ser informado'),
        operacaoInternaId: yup.number().required('Operação Interna deve ser informada'),
        origemProducaoAgricolaId: yup.number().required('Origem de Produção Agrícola deve ser informada'),
        pesoEntrada: validacaoFechamento.value === true ? yup.number().required('Peso de entrada é obrigatório').min(0.01, 'Peso de entrada deve ser maior que 0') : yup.number(),
        pesoSaida:
            validacaoFechamento.value === true
                ? formData.value.entrada === true
                    ? yup.number().max(formData.value.pesoEntrada, 'Peso de saída não pode ser maior que o peso de entrada.')
                    : yup.number().min(formData.value.pesoEntrada, 'Peso de saída não pode ser menor que o peso de entrada.')
                : yup.number(),
        safraId: produtoSelecionado.value && produtoSelecionado.value.informaSafraAgricola === true ? yup.number().required('Safra deve ser informada') : yup.number(),
        placa1: validacaoFechamento.value === true ? yup.string().required('Placa do veículo é obrigatória') : yup.string().nullable(),
        nomeMotorista: validacaoFechamento.value === true ? yup.string().required('Nome do motorista é obrigatório') : yup.string().nullable(),
        contatoMotorista: validacaoFechamento.value === true ? yup.string().required('Contato do motorista é obrigatório') : yup.string().nullable(),
        contratoAgricolaId: validacaoFechamento.value === true && contratos.value && contratos.value.length > 0 ? yup.number().required('Contrato Agrícola é obrigatório') : yup.number().nullable(),
        classificacoes: createSchemaClassificacoes(formData.value.classificacoes),
        notas:
            validacaoFechamento.value === true && operacaoInterna.value && operacaoInterna.value.operacaoInternaAgricola && operacaoInterna.value.operacaoInternaAgricola.exigeNotaEntrada
                ? yup
                      .array()
                      .min(1, 'Nota Fiscal é obrigatória')
                      .required('Nota Fiscal é obrigatória')
                : yup.array()
    });
};

const formData = ref({
    situacao: '1',
    origem: '1',
    pesoEntrada: 0,
    pesoSaida: 0,
    descontosAcrescimo: 0,
    pesoBruto: 0,
    pesoLiquido: 0,
    classificacoes: [],
    notas: []
});
const formRomaneio = ref();
const origensRomaneio = ref([]);
const temAutonomiaDataDocumento = ref(false);
const situacoesRomaneio = ref();
const validacaoFechamento = ref(false);
const visiblePesagemManual = ref(false);
const visibleVincularNotaFiscal = ref(false);
const tipoPesoManual = ref('entrada');
const operacaoInterna = ref();
const itensClassificacao = ref();
const produtoSelecionado = ref(undefined);
const realizandoCalculoAgricola = ref(false);
const mode = ref('novo');
const seletorParceiroLocal = ref(null);
const parceiroLocalSelecionado = ref();
const seletorOperacaoInterna = ref(null);
const seletorPropriedade = ref(null);
const seletorProduto = ref(null);
const notaVincular = ref(null);
const modeVincular = ref('novo');
const contratos = ref([]);

const itemsActionsPendente = [
    {
        label: 'Finalizar',
        icon: 'pi pi-lock',
        command: () => {
            handleSalvarFinalizar();
        }
    },
    {
        label: 'Inutilizar',
        icon: 'pi pi-times-circle',
        command: () => {
            handleInutilizar();
        }
    }
];

const itemsActionsAberto = [
    {
        label: 'Salvar',
        icon: 'pi pi-lock',
        command: () => {
            handleSalvar();
        }
    },
    {
        label: 'Inutilizar',
        icon: 'pi pi-times-circle',
        command: () => {
            handleInutilizar();
        }
    }
];

const situacaoRomaneio = computed(() => {
    if (situacoesRomaneio.value && situacoesRomaneio.value.length > 0) return situacoesRomaneio.value.find((s) => s.value === formData.value.situacao)?.name;
    else return '';
});

const visibleSafra = computed(() => {
    return produtoSelecionado.value && produtoSelecionado.value.informaSafraAgricola === true;
});

const exigeNotaEntrada = computed(() => {
    return operacaoInterna.value && operacaoInterna.value.operacaoInternaAgricola && operacaoInterna.value.operacaoInternaAgricola.exigeNotaEntrada;
});

const changeParceiroLocal = (objeto, carregamentoInicial) => {
    if (!carregamentoInicial) formData.value.parceiroLocalPropriedadeId = undefined;

    if (objeto) {
        parceiroLocalSelecionado.value = objeto;
        buscarContratos();
    } else {
        parceiroLocalSelecionado.value = undefined;
        contratos.value = [];
    }
};

const changeSafra = (objeto) => {
    if (objeto) {
        formData.value.safraId = objeto.id;
        buscarContratos();
    } else {
        formData.value.safraId = undefined;
        contratos.value = [];
    }
};

const execLancarPesagemManual = (tipoPesagem) => {
    tipoPesoManual.value = tipoPesagem;
    visiblePesagemManual.value = true;
};

const execVincularNotaFiscal = () => {
    modeVincular.value = 'novo';
    const idLine = Math.floor(Math.random() * 100) * -1;
    notaVincular.value = {
        idLine: idLine,
        itemId: formData.value.itemId,
        operacaoInternaId: formData.value.operacaoInternaId,
        operacaoInternaSigla: operacaoInterna.value.sigla
    };
    visibleVincularNotaFiscal.value = true;
};

const calcularPesoLiquido = async () => {
    if (operacaoInterna.value && operacaoInterna.value.naturezaOperacao) {
        if (operacaoInterna.value.naturezaOperacao.indicadorOperacao === 'S') {
            formData.value.pesoLiquido = formData.value.pesoSaida - formData.value.pesoEntrada;
        } else {
            formData.value.pesoLiquido = formData.value.pesoEntrada - formData.value.pesoSaida;
        }
    } else {
        formData.value.pesoLiquido = 0;
    }
    await calcularPesoFinal();
};

const pesoTara = computed(() => {
    if (operacaoInterna.value.naturezaOperacao.indicadorOperacao === 'S') return formData.value.pesoEntrada;
    else return formData.value.pesoSaida;
});

const calcularDescontosAcrescimos = () => {
    if (formData.value.classificacoes.length === 0) {
        formData.value.descontosAcrescimos = 0;
        return;
    }
    formData.value.descontosAcrescimos = formData.value.classificacoes.reduce((acc, c) => {
        if (c.valor !== null && c.indicadorDC !== 'N') {
            if (c.indicadorDC === 'C') {
                acc += c.valor;
            } else {
                acc -= c.valor;
            }
        }
        return acc;
    }, 0);
};

const calcularPesoFinal = async () => {
    calcularDescontosAcrescimos();
    formData.value.pesoFinal = formData.value.pesoLiquido + formData.value.descontosAcrescimos;
};

const closePesagemManual = async () => {
    visiblePesagemManual.value = false;
    await calcularPesoLiquido();
    await realizarCalculoAgricola(0);
    await calcularPesoFinal();
};

const closeVincularNotaFiscal = async () => {
    if (modeVincular.value === 'novo') {
        formData.value.notas = formData.value.notas.filter((e) => e.idLine !== notaVincular.value.idLine);
    }
    visibleVincularNotaFiscal.value = false;
};

const confirmVincularNotaFiscal = (e) => {
    if (modeVincular.value === 'novo') {
        formData.value.notas = formData.value.notas.filter((e) => e.idLine !== notaVincular.value.idLine);
        formData.value.notas.push(e);
    } else {
        const index = formData.value.notas.findIndex((n) => n.idLine === e.idLine);
        if (index >= 0) {
            formData.value.notas[index] = e;
        }
    }
    visibleVincularNotaFiscal.value = false;
};

const handleCancelar = () => {
    router.push({ path: '/agricola/movimento/romaneio' });
};

const handleSalvar = async () => {
    validacaoFechamento.value = false;
    nextTick(() => {
        formRomaneio.value.handleSubmit();
    });
};

const handleSalvarFinalizar = async () => {
    validacaoFechamento.value = true;
    nextTick(() => {
        formRomaneio.value.handleSubmit();
    });
};

onMounted(async () => {
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
    formData.value.dataDocumento = new Date();
    formData.value.situacaoRomaneio = '1';
    UsuarioService.checkAutonomia(contextoStore.contexto.empresaId, contextoStore.contexto.empresaFilialId, 'ALTDTROMANEIO').then((data) => {
        temAutonomiaDataDocumento.value = data;
    });
    TiposService.getSituacaoRomaneio().then((data) => {
        situacoesRomaneio.value = data;
    });
    TiposService.getOrigemRomaneio().then((data) => {
        origensRomaneio.value = data;
    });
    const id = route.params.id || 0;
    if (id > 0) {
        mode.value = 'editar';
        await RomaneioAgricolaService.getById(id).then((data) => {
            _.assign(formData.value, data);
            nextTick(async () => {
                await seletorParceiroLocal.value.reload(formData.value.parceiroLocalId);
                await seletorOperacaoInterna.value.reload(formData.value.operacaoInternaId);
                await seletorPropriedade.value.reload(formData.value.parceiroLocalPropriedadeId);
                await seletorProduto.value.reload(formData.value.itemId);
                ItemService.getById(formData.value.itemId).then(async (data) => {
                    const classificacoes = formData.value.classificacoes;
                    formData.value.classificacoes = [];
                    await changeProduto(data);
                    if (classificacoes && classificacoes.length > 0) {
                        classificacoes.forEach((item) => {
                            if (formData.value.classificacoes.find((e) => e.itemClassificacaoAgricolaId === item.itemClassificacaoAgricolaId) === undefined) {
                                formData.value.classificacoes.push(item);
                            } else {
                                const itemClassificacao = formData.value.classificacoes.find((e) => e.itemClassificacaoAgricolaId === item.itemClassificacaoAgricolaId);
                                itemClassificacao.subItemClassificacaoAgricolaId = item.subItemClassificacaoAgricolaId;
                                itemClassificacao.baseCalculoAgricola = item.baseCalculoAgricola;
                                itemClassificacao.fatorCalculo = item.fatorCalculo;
                                itemClassificacao.indicadorDC = item.indicadorDC;
                                itemClassificacao.ordem = item.ordem;
                                itemClassificacao.tipoTaxaAgricola = item.tipoTaxaAgricola;
                                itemClassificacao.valor = item.valor;
                                itemClassificacao.valorBaseCalculo = item.valorBaseCalculo;
                                itemClassificacao.valorBaseCalculoComplementar = item.valorBaseCalculoComplementar;
                            }
                        });
                    }
                    _.sortBy(formData.value.classificacoes, ['gerado','ordem','itemClassificacaoAgricolaNome']);
                });
                ParceiroLocalService.getById(formData.value.parceiroLocalId).then((data) => {
                    changeParceiroLocal(data, true);
                });
                changeOperacaoInterna();
            });
            // seletorParceiroLocal.value.reload(data.parceiroLocalId);
            // calcularPesoLiquido();
        });
    }
});

const changeOperacaoInterna = async () => {
    if (formData.value.operacaoInternaId) {
        OperacaoInternaService.getById(formData.value.operacaoInternaId).then((data) => {
            operacaoInterna.value = data;
            formData.value.entrada = operacaoInterna.value.naturezaOperacao.indicadorOperacao === 'E';
            if (!operacaoInterna.value.operacaoInternaAgricola.exigeNotaEntrada) {
                formData.value.notas = [];
            }
        });
    } else {
        operacaoInterna.value = undefined;
        formData.value.notas = [];
    }
    calcularPesoLiquido();
};

const changeProduto = async (objeto, carregamentoInicial) => {
    if (objeto) {
        produtoSelecionado.value = objeto;
        if (!carregamentoInicial) {
            if (objeto.id !== formData.value.itemId) formData.value.classificacoes = [];
            await buscarItensClassificacao();
        }
        buscarContratos();
    } else {
        produtoSelecionado.value = undefined;
        formData.value.classificacoes = [];
        contratos.value = [];
    }
};

const changeDataDocumento = async () => {
    await buscarItensClassificacao();
};

const buscarItensClassificacao = async () => {
    realizandoCalculoAgricola.value = true;
    await ItemClassificacaoAgricolaService.buscarParaRomaneio(formData.value.itemId, formatDate(formData.value.dataDocumento, 'yyyy-MM-dd')).then((data) => {
        itensClassificacao.value = data;
        if (itensClassificacao.value && itensClassificacao.value.length > 0) {
            formData.value.classificacoes = itensClassificacao.value.map((i) => {
                return {
                    grupoClassificacaoAgricolaId: i.grupoClassificacaoAgricolaId,
                    grupoClassificacaoAgricolaNome: i.grupoClassificacaoAgricolaNome,
                    itemClassificacaoAgricolaId: i.id,
                    itemClassificacaoAgricolaNome: i.nome,
                    subItemClassificacaoAgricolaId: undefined,
                    baseCalculoAgricola: undefined,
                    fatorCalculo: undefined,
                    indicadorDC: 'N',
                    ordem: undefined,
                    tipoTaxaAgricola: undefined,
                    valor: undefined,
                    valorBaseCalculo: undefined,
                    valorBaseCalculoComplementar: undefined,
                    gerado: false
                };
            });
            _.sortBy(formData.value.classificacoes, ['gerado', 'ordem','itemClassificacaoAgricolaNome']);
        }
        realizandoCalculoAgricola.value = false;
    });
};

const changeSubItemClassificacaoAgricola = async (itemClassificacao) => {
    itemClassificacao = {
        ...itemClassificacao,
        baseCalculoAgricola: undefined,
        fatorCalculo: undefined,
        indicadorDC: 'N',
        ordem: undefined,
        tipoTaxaAgricola: undefined,
        valor: undefined,
        valorBaseCalculo: undefined,
        valorBaseCalculoComplementar: undefined
    };

    const idsPresentes = _.map(formData.value.classificacoes, 'subItemClassificacaoAgricolaId');
    formData.value.classificacoes = _.filter(formData.value.classificacoes, item => 
      item.gerado === false || (item.gerado === true && !_.isNil(item.subItemId) && _.includes(idsPresentes, item.subItemId))
    );

    await realizarCalculoAgricola(itemClassificacao.itemClassificacaoAgricolaId);
};

const realizarCalculoAgricola = async (itemClassificacaoAgricolaIdCalcular) => {
    const payload = {
        itemId: formData.value.itemId,
        operacaoInternaId: formData.value.operacaoInternaId,
        grupoOperacaoAgricolaId: formData.value.grupoOperacaoAgricolaId,
        regraAtividadeId: formData.value.regraAtividadeId,
        dataBase: formatDate(formData.value.dataDocumento, 'yyyy-MM-dd'),
        calcularGrupo: false,
        pesoBruto: formData.value.pesoBruto,
        pesoTara: pesoTara.value,
        pesoLiquido: formData.value.pesoLiquido,
        itemClassificacaoAgricolaCalcularId: itemClassificacaoAgricolaIdCalcular,
        itensClassificacao: formData.value.classificacoes
            .filter((f) => f.subItemClassificacaoAgricolaId && f.subItemClassificacaoAgricolaId > 0)
            .map((e) => {
                return {
                    itemClassificacaoAgricolaId: e.itemClassificacaoAgricolaId,
                    subItemClassificacaoAgricolaId: e.subItemClassificacaoAgricolaId,
                    baseCalculoAgricola: e.baseCalculoAgricola,
                    valorBaseCalculo: e.valorBaseCalculo,
                    valorBaseCalculoComplementar: e.valorBaseCalculoComplementar,
                    valor: e.valor,
                    indicadorDC: e.indicadorDC,
                    ordem: e.ordem,
                    fatorCalculo: e.fatorCalculo,
                    tipoTaxaAgricola: e.tipoTaxaAgricola
                };
            })
    };
    try {
        realizandoCalculoAgricola.value = true;
        const data = await ClassificacaoAgricolaService.realizarCalculoAgricola(payload);

        data.itensClassificacao.forEach((item) => {
            const itemClassificacao = formData.value.classificacoes.find((e) => e.itemClassificacaoAgricolaId === item.itemClassificacaoAgricolaId &&
                                                                                e.subItemClassificacaoAgricolaId === item.subItemClassificacaoAgricolaId);
            if (itemClassificacao) {
                itemClassificacao.baseCalculoAgricola = item.baseCalculoAgricola;
                itemClassificacao.fatorCalculo = item.fatorCalculo;
                itemClassificacao.indicadorDC = item.indicadorDC;
                itemClassificacao.ordem = item.ordem;
                itemClassificacao.tipoTaxaAgricola = item.tipoTaxaAgricola;
                itemClassificacao.valor = item.valor;
                itemClassificacao.valorBaseCalculo = item.valorBaseCalculo;
                itemClassificacao.valorBaseCalculoComplementar = item.valorBaseCalculoComplementar;
                itemClassificacao.gerado = item.gerado
            } else {
                formData.value.classificacoes.push({
                    itemClassificacaoAgricolaId: item.itemClassificacaoAgricolaId,
                    itemClassificacaoAgricolaNome: item.itemClassificacaoAgricolaNome,
                    subItemClassificacaoAgricolaId: item.subItemClassificacaoAgricolaId,
                    subItemClassificacaoAgricolaNome: item.subItemClassificacaoAgricolaNome,
                    grupoClassificacaoAgricolaId: item.grupoClassificacaoAgricolaId,
                    grupoClassificacaoAgricolaNome: item.grupoClassificacaoAgricolaNome,
                    baseCalculoAgricola: item.baseCalculoAgricola,
                    fatorCalculo: item.fatorCalculo,
                    indicadorDC: item.indicadorDC,
                    ordem: item.ordem,
                    tipoTaxaAgricola: item.tipoTaxaAgricola,
                    valor: item.valor,
                    valorBaseCalculo: item.valorBaseCalculo,
                    valorBaseCalculoComplementar: item.valorBaseCalculoComplementar,
                    gerado: item.gerado
                });
            }
            _.sortBy(formData.value.classificacoes, ['gerado', 'ordem','itemClassificacaoAgricolaNome']);
        });
        realizandoCalculoAgricola.value = false;
        calcularPesoFinal();
        formRomaneio.value.validateForm();
    } catch (error) {
        realizandoCalculoAgricola.value = false;
        formRomaneio.value.validateForm();
    }
};

const salvarRegistro = () => {
    if (mode.value === 'novo') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const criarRegistro = () => {
    const payload = { ...formData.value };

    if (validacaoFechamento.value) payload.situacao = '3';
    payload.dataDocumento = formatDate(payload.dataDocumento, 'yyyy-MM-dd');

    RomaneioAgricolaService.create(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Romaneio agrícola salvo com sucesso', life: 5000 });
            router.push({ path: '/agricola/movimento/romaneio' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível salvar o romaneio agrícola.', life: 5000 });
        });
};

const alterarRegistro = () => {
    const payload = { ...formData.value };
    if (validacaoFechamento.value) payload.situacao = '3';
    RomaneioAgricolaService.update(payload)
        .then(() => {
            const msg = validacaoFechamento.value ? 'Romaneio agrícola finalizado com sucesso' : 'Romaneio agrícola salvo com sucesso';
            toast.add({ severity: 'success', summary: 'Sucesso', detail: msg, life: 5000 });
            router.push({ path: '/agricola/movimento/romaneio' });
        })
        .catch(() => {
            const msg = validacaoFechamento.value ? 'Não foi possível finalizar o romaneio agrícola.' : 'Não foi possível salvar o romaneio agrícola.';
            toast.add({ severity: 'error', summary: 'Falha', detail: msg, life: 5000 });
        });
};

const handleInutilizar = () => {
    const romaneioAgricolaId = formData.value.id;
    RomaneioAgricolaService.cancelar(romaneioAgricolaId)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Romaneio agrícola inutilizado com sucesso', life: 5000 });
            router.push({ path: '/agricola/movimento/romaneio' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível inutilizado o romaneio agrícola.', life: 5000 });
        });
};

const temErro = (errors, str) => {
    let caminhoEncontrado = false;
    _.forEach(errors, (value, key) => {
        // Verifica se o caminho base está contido no caminho atual
        if (_.startsWith(key, str)) {
            caminhoEncontrado = true;
            return false; // Sai do loop forEach assim que encontrar um caminho válido
        }
    });
    return caminhoEncontrado;
};

const handleDeleteNota = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            formData.value.notas = formData.value.notas.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Nota removida com sucesso', life: 5000 });
        },
        reject: () => {}
    });
};

const handleEditNota = (data) => {
    modeVincular.value = 'editar';
    notaVincular.value = data;
    visibleVincularNotaFiscal.value = true;
};

const disabledClassificacao = computed(() => {
    return !operacaoInterna.value
});

const disabledContrato = computed(() => {
    return !contratos.value || contratos.value.length === 0;
});

const buscarContratos = async () => {
    const parceiroId = parceiroLocalSelecionado.value ? parceiroLocalSelecionado.value.parceiroId : 0;
    const itemId = formData.value.itemId || 0;
    const safraId = formData.value.safraId || 0;
    await ContratoAgricolaService.buscarParaSelecaoRomaneio(parceiroId, itemId, safraId).then((data) => {
        contratos.value = data;
    });
};

const onRowSelectContrato = (event) => {
    if (event.data) {
        formData.value.contratoAgricolaId = event.data.contratoId;
    }
};

const onRowUnselectContrato = () => {
    formData.value.contratoAgricolaId = undefined;
};


</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <UWPageBase title="Lançamento de Romaneio" subtitle="Registrar informações de romaneio agrícola">
        <UWForm :schema="createSchema()" :values="formData" ref="formRomaneio" :visibleSave="false" @doSubmit="salvarRegistro" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="temErro(errors?.value, 'classificacoes[')">Atenção! Existem classificações com pendências nas informações informadas.</Message>
                <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="errors?.value?.notas">Atenção! Deve ser informada nota de entrada para o romaneio.</Message>
                <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="errors?.value?.contratoAgricolaId">Atenção! Deve ser selecionado um contrato agrícola.</Message>
                <TabView>
                    <TabPanel header="Dados Principais">
                        <div class="grid nested-grid">
                            <div class="col-12">
                                <UWFieldSet title="Identificação do Romaneio" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInteger id="numero" label="Número" disabled v-model="formData.numero" classContainer="col-12 md:col-1" />
                                        <UWCalendar
                                            id="dataDocumento"
                                            label="Data do Romaneio"
                                            dateFormat="dd/mm/yy"
                                            :disabled="!temAutonomiaDataDocumento"
                                            required
                                            v-model="formData.dataDocumento"
                                            :errors="errors.value?.dataDocumento"
                                            classContainer="col-12 md:col-2"
                                            @change="changeDataDocumento"
                                        />
                                        <UWSeletor
                                            id="departamento"
                                            :classContainer="{ 'col-12': true, 'md:col-3': formData.origem === '1', 'md:col-5': formData.origem === '2' }"
                                            v-model="formData.departamentoId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            label="Departamento"
                                            :service="DepartamentoService"
                                            placeholder="Selecione o departamento"
                                            :erros="errors.value?.departamentoId"
                                            :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                        />
                                        <UWPickList id="origem" label="Origem" required v-model="formData.origem" optionLabel="name" optionValue="value" :options="origensRomaneio" classContainer="col-12 md:col-2" :errors="errors.value?.origem" />
                                        <UWSeletor
                                            v-if="formData.origem === '1'"
                                            label="Balança"
                                            classContainer="col-12 md:col-2"
                                            v-model="formData.balancaId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            :service="BalancaService"
                                            placeholder="Selecione a balanca"
                                            :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                            :erros="errors.value?.balancaId"
                                        />
                                        <UWInput id="situacao" label="Situação" disabled v-model="situacaoRomaneio" classContainer="col-12 md:col-2" />
                                        <UWParceiroLocal
                                            id="parceiroLocal"
                                            ref="seletorParceiroLocal"
                                            classContainer="col-12 md:col-5"
                                            v-model="formData.parceiroLocalId"
                                            required
                                            label="Parceiro"
                                            @changeObject="changeParceiroLocal"
                                            :erros="errors.value?.parceiroLocalId"
                                        />
                                        <UWPropriedades
                                            id="propriedade"
                                            ref="seletorPropriedade"
                                            :parceiroLocalId="formData.parceiroLocalId"
                                            classContainer="col-12 md:col-5"
                                            v-model="formData.parceiroLocalPropriedadeId"
                                            required
                                            label="Propriedade"
                                            :erros="errors.value?.parceiroLocalPropriedadeId"
                                        />
                                        <UWSeletorRegraAtividadeParceiro
                                            classContainer="col-12 md:col-2"
                                            label="Regra de Atividade"
                                            v-model="formData.regraAtividadeId"
                                            :parceiroId="(parceiroLocalSelecionado && parceiroLocalSelecionado.parceiroId) || 0"
                                            required
                                            optionLabel="nome"
                                            optionValue="id"
                                            placeholder="Selecione a regra de atividade"
                                            :erros="errors.value?.regraAtividadeId"
                                        />
                                        <UWSeletor
                                            label="Grupo de Operação"
                                            classContainer="col-12 md:col-3"
                                            v-model="formData.grupoOperacaoAgricolaId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            :service="GrupoOperacaoAgricolaService"
                                            placeholder="Selecione o grupo de operação"
                                            :erros="errors.value?.grupoOperacaoAgricolaId"
                                        />
                                        <UWSeletorOIAgricolaValidoRomaneio
                                            label="Operação Interna"
                                            ref="seletorOperacaoInterna"
                                            classContainer="col-12 md:col-3"
                                            v-model="formData.operacaoInternaId"
                                            :itemId="formData.itemId"
                                            :grupoOperacaoAgricolaId="formData.grupoOperacaoAgricolaId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            placeholder="Selecione a operação interna"
                                            @change="changeOperacaoInterna"
                                            :erros="errors.value?.operacaoInternaId"
                                        />
                                        <UWSeletor
                                            label="Origem de Produção"
                                            classContainer="col-12 md:col-2"
                                            v-model="formData.origemProducaoAgricolaId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            :service="OrigemProducaoAgricolaService"
                                            placeholder="Selecione a origem de produção"
                                            :erros="errors.value?.origemProducaoAgricolaId"
                                        />
                                        <UWSeletorItemAgricola
                                            classContainer="col-12 md:col-4"
                                            ref="seletorProduto"
                                            label="Produto"
                                            v-model="formData.itemId"
                                            required
                                            optionLabel="nome"
                                            optionValue="id"
                                            placeholder="Selecione o item"
                                            :erros="errors.value?.itemId"
                                            @changeObject="changeProduto"
                                        />
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-12">
                                <UWFieldSet title="Dados da Pesagem" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWPeso
                                            id="pesoEntrada"
                                            label="Peso Entrada"
                                            disabled
                                            v-model="formData.pesoEntrada"
                                            :errors="errors.value?.pesoEntrada"
                                            classContainer="col-12 md:col-2"
                                            @lancarPesagemManual="execLancarPesagemManual('entrada')"
                                            :pesagemManual="formData.pesoEntradaManual"
                                            :habilitaCapturaAutomatica="false"
                                            :habilitaPesoManual="formData.operacaoInternaId !== undefined && formData.operacaoInternaId !== null"
                                        />
                                        <UWPeso
                                            id="pesoSaida"
                                            label="Peso Saída"
                                            disabled
                                            v-model="formData.pesoSaida"
                                            :errors="errors.value?.pesoSaida"
                                            classContainer="col-12 md:col-2"
                                            @lancarPesagemManual="execLancarPesagemManual('saida')"
                                            :pesagemManual="formData.pesoSaidaManual"
                                            :habilitaCapturaAutomatica="false"
                                            :habilitaPesoManual="formData.operacaoInternaId !== undefined && formData.operacaoInternaId !== null"
                                        />
                                        <UWInteger id="pesoLiquido" label="Peso Líquido" disabled v-model="formData.pesoLiquido" classContainer="col-12 md:col-2" />
                                        <UWInteger id="descontos" label="Descontos / Acréscimos" disabled v-model="formData.descontosAcrescimos" classContainer="col-12 md:col-2" />
                                        <UWInteger id="pesoFinal" label="Peso Final" disabled v-model="formData.pesoFinal" classContainer="col-12 md:col-2" />
                                        <UWSeletorSafraAgricola
                                            classContainer="col-12 md:col-2"
                                            label="Safra"
                                            v-model="formData.safraId"
                                            required
                                            v-if="visibleSafra === true"
                                            optionLabel="nome"
                                            optionValue="id"
                                            placeholder="Selecione a safra"
                                            :erros="errors.value?.safraId"
                                            @changeObject="changeSafra"
                                        />
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-7">
                                <UWFieldSet title="Dados do Transporte" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInput id="placa" label="Placa" required="opcional" v-model="formData.placa1" :errors="errors.value?.placa1" classContainer="col-12 md:col-2" />
                                        <UWInput id="placa2" label="Placa 2" v-model="formData.placa2" classContainer="col-12 md:col-2" />
                                        <UWInput id="placa3" label="Placa 3" v-model="formData.placa3" classContainer="col-12 md:col-2" />
                                        <UWInput id="nomeMotorista" required="opcional" label="Nome do Motorista" v-model="formData.nomeMotorista" :errors="errors.value?.nomeMotorista" classContainer="col-12 md:col-3" />
                                        <UWInput id="contatoMotorista" required="opcional" label="Contato do Motorista" v-model="formData.contatoMotorista" :errors="errors.value?.contatoMotorista" classContainer="col-12 md:col-3" />
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-5">
                                <UWFieldSet title="Observações" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInput id="observacao" label="" uppercase v-model="formData.observacao" :errors="errors.value?.observacao" classContainer="col-12 md:col-12 h-full" />
                                    </div>
                                </UWFieldSet>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel header="Classificações" :disabled="disabledClassificacao">
                        <DataTable :value="formData.classificacoes" size="small" tableStyle="min-width: 50rem" :loading="realizandoCalculoAgricola">
                            <Column header="#" headerStyle="width:3rem">
                                <template #body="slotProps">
                                    {{ slotProps.index + 1 }}
                                </template>
                            </Column>
                            <Column field="grupoClassificacaoAgricolaNome" header="Grupo de Classificação" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWInput id="grupoClassificacaoAgricolaId" v-model="slotProps.data.grupoClassificacaoAgricolaNome" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="itemClassificacaoAgricolaNome" header="Item de Classificação" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWInput id="grupoClassificacaoAgricolaId" v-model="slotProps.data.itemClassificacaoAgricolaNome" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="subItemClassificacaoAgricolaId" header="Sub. Item Classificação" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWSeletorSubItemClassAgricolaRomaneio
                                            classContainer="w-full"
                                            :requerid="validacaoFechamento"
                                            :disabled="slotProps.data.gerado"
                                            :label="!slotProps.data.subItemClassificacaoAgricolaId ? 'Sub. Item Classificação' : ''"
                                            v-model="slotProps.data.subItemClassificacaoAgricolaId"
                                            :itemId="formData.itemId"
                                            :itemClassificacaoAgricolaId="slotProps.data.itemClassificacaoAgricolaId"
                                            :dataRomaneio="formData.dataDocumento"
                                            optionLabel="nome"
                                            optionValue="id"
                                            @change="changeSubItemClassificacaoAgricola(slotProps.data)"
                                            :erros="_.get(errors.value, `classificacoes[${slotProps.index}].subItemClassificacaoId`, null)"
                                        />
                                    </div>
                                </template>
                            </Column>
                            <Column field="indicadorDC" header="D/C" style="width: 50px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWInput id="grupoClassificacaoAgricolaId" v-model="slotProps.data.indicadorDC" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="valorBaseCalculo" header="Base de Cálculo" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWDecimal id="grupoClassificacaoAgricolaId" v-model="slotProps.data.valorBaseCalculo" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="valor" header="Valor" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWDecimal id="grupoClassificacaoAgricolaId" v-model="slotProps.data.valor" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="ordem" header="Ordem" style="width: 50px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWInput id="grupoClassificacaoAgricolaId" v-model="slotProps.data.ordem" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="fatorCalculo" header="Taxa" style="min-width: 50px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWDecimal id="grupoClassificacaoAgricolaId" v-model="slotProps.data.fatorCalculo" disabled />
                                    </div>
                                </template>
                            </Column>
                            <Column field="tipoTaxaAgricola" header="Tipo Taxa" style="min-width: 100px">
                                <template #body="slotProps">
                                    <div class="flex align-items-center gap-2">
                                        <UWInput id="grupoClassificacaoAgricolaId" v-model="slotProps.data.tipoTaxaAgricola" disabled />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel header="Contratos" :disabled="disabledContrato">
                        <DataTable v-model:selection="formData.contratoAgricola" :value="contratos" selectionMode="single" dataKey="contratoId" 
                            size="small" tableStyle="min-width: 50rem" scrollable scrollHeight="400px"
                            @rowSelect="onRowSelectContrato" @rowUnselect="onRowUnselectContrato">
                            <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                            <Column field="departamentoSigla" header="Departamento" style="min-width: 8%" />
                            <Column field="contratoNumero" header="Contrato" style="min-width: 8%" />
                            <Column field="parceiroNome" header="Parceiro" style="max-width: 20%" />
                            <Column field="parceiroLocalNome" header="Local Parceiro" style="min-width: 15%" />
                            <Column field="operacaoInternaSigla" header="Operação Interna" style="min-width: 10%" />
                            <Column field="contratoSaldo" header="Saldo" style="min-width: 7%">
                                <template #body="slotProps">
                                    <div class="w-full text-center">{{ formatNumber(slotProps.data.contratoSaldo, 0) }}</div>
                                </template>
                            </Column>
                            <Column field="contratoDataDocumento" header="Data do Documento" style="min-width: 8%">
                                <template #body="slotProps">
                                    <div class="w-full text-center">{{ formatToDDMMYYYY(slotProps.data.contratoDataDocumento) }}</div>
                                </template>
                            </Column>
                            <Column field="grupoOperacaoAgricolaNome" header="Grupo de Operação" style="min-width: 10%" />
                            <Column field="contratoObservacao" header="Observação" style="min-width: 200px" />
                        </DataTable>
                    </TabPanel>
                    <TabPanel v-if="exigeNotaEntrada" header="Nota de Entrada">
                        <div class="grid nested-grid">
                            <div class="col-12">
                                <UWFieldSet title="Notas de entrada vinculadas" class="h-full">
                                    <Toolbar>
                                        <template v-slot:start>
                                            <div>
                                                <Button label="Vincular Nota" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="execVincularNotaFiscal()" />
                                            </div>
                                        </template>
                                    </Toolbar>
                                    <DataTable :value="formData.notas" size="small" tableStyle="min-width: 50rem; max-width: 100%" class="col-12">
                                        <Column header="#" headerStyle="width:3rem">
                                            <template #body="slotProps">
                                                {{ slotProps.index + 1 }}
                                            </template>
                                        </Column>
                                        <Column field="numeroNota" header="Número" style="min-width: 100px" />
                                        <Column field="serie" header="Série" style="min-width: 100px" />
                                        <Column field="dataEmissao" header="Data de Emissão" style="min-width: 100px">
                                            <template #body="slotProps">
                                                <div class="w-full text-center">{{ formatToDDMMYYYY(slotProps.data.dataEmissao) }}</div>
                                            </template>
                                        </Column>

                                        <Column field="tipoDocumentoSigla" header="Tipo de Documento" style="min-width: 100px" />
                                        <Column field="chaveNFe" header="Chave NFe" style="min-width: 100px" />
                                        <Column field="operacaoInternaSigla" header="Operação Interna" style="min-width: 100px" />
                                        <Column field="cfopCodigo" header="Cfop" style="min-width: 100px" />
                                        <Column field="quantidade" header="Quantidade" style="min-width: 100px">
                                            <template #body="slotProps">
                                                <div class="w-full text-center">{{ formatNumber(slotProps.data.quantidade, 0) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="valorUnitario" header="Valor Unitário" style="min-width: 100px">
                                            <template #body="slotProps">
                                                <div class="w-full text-center">{{ formatNumber(slotProps.data.valorUnitario, 0) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="valorTotal" header="Valor Total" style="min-width: 100px">
                                            <template #body="slotProps">
                                                <div class="w-full text-center">{{ formatNumber(slotProps.data.valorTotal, 0) }}</div>
                                            </template>
                                        </Column>
                                        <Column header="" style="width: 6%">
                                            <template #body="slotProps">
                                                <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEditNota(slotProps.data)" />
                                                <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDeleteNota($event, slotProps.data)" />
                                            </template>
                                        </Column>
                                    </DataTable>
                                </UWFieldSet>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
                <ProgressBar v-if="realizandoCalculoAgricola" mode="indeterminate" style="height: 6px"></ProgressBar>
            </template>
            <template #buttonsRight>
                <SplitButton v-if="formData.situacao === '1'" label="Salvar" icon="pi pi-check" menuButtonIcon="pi pi-cog" :model="itemsActionsPendente" @click="handleSalvar" />
                <SplitButton v-if="formData.situacao === '2'" label="Finalizar" icon="pi pi-check" menuButtonIcon="pi pi-cog" :model="itemsActionsAberto" @click="handleSalvarFinalizar" />
            </template>
        </UWForm>
        <InformaPesagemManual id="informaPesagemManual" v-model="formData" :showDialog="visiblePesagemManual" @closeDialog="closePesagemManual" :tipo-peso="tipoPesoManual" />
        <VincularNotaFiscal id="vincularNotaFiscal" v-model="notaVincular" :showDialog="visibleVincularNotaFiscal" @closeDialog="closeVincularNotaFiscal" @confirmDialog="confirmVincularNotaFiscal" />
    </UWPageBase>
</template>
