<script setup>
import { ref, computed, onMounted, nextTick  } from 'vue';
import _ from 'lodash'
import * as yup from 'yup';
import Swal from 'sweetalert2'; 
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';
import { UsuarioService, BalancaService, OperacaoInternaService, ItemService, SafraService,
         TipoClassificacaoAgricolaService, ClassificacaoAgricolaService, PesagemService, TiposService
 } from '@/service';
import InformaPesagemManual from './InformaPesagemManual.vue'

const contextoStore = useContexto();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const { formatToUTC } = useFormatDate();

const getToday = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 59);
    return today;
}

const createSchema = () => {
    return yup.object().shape({
        balancaId: yup.number().required('Balança é obrigatória'),
        dataPesagem: yup.date().required('Data de pesagem é obrigatória').max(getToday(), 'Data de Pesagem deve ser menor que a data atual.'),
        operacaoInternaId: yup.number().required('Operação Interna deve ser informada'),
        parceiroLocalId: formData.value.temCadastro === true ? yup.number().required('Parceiro deve ser informado') : yup.number(),
        parceiroLocalPropriedadeId: formData.value.temCadastro === true ? yup.number().required('Propriedade deve ser informada') : yup.number(),
        itemId: yup.number().required('Produto deve ser informado'),
        safraId: informaSafra.value ? yup.number().required('Safra deve ser informada') : yup.string(),
        placa1: yup.string().required('Placa deve ser informada'),
        nomeMotorista: yup.string().required('Nome do motorista deve ser informado'),
        contatoMotorista: yup.string().required('Contato do motorista deve ser informado'),
        razaoSocialNome: formData.value.temCadastro === false ? yup.string().required('Razão Social / Nome deve ser informado') : yup.string(),
        nomePropriedade: formData.value.temCadastro === false ? yup.string().required('Nome da propriedade deve ser informada') : yup.string(),
        pesoEntrada: deveValidarPeso.value === true ? yup.number().required('Peso de entrada é obrigatório').min(0.01, 'Peso de entrada deve ser maior que 0') : yup.number(),
        pesoSaida: deveValidarPeso.value === true ? (formData.value.entrada === true ?
            yup.number().max(formData.value.pesoEntrada, 'Peso de saída não pode ser maior que o peso de entrada.')
            : yup.number().min(formData.value.pesoEntrada, 'Peso de saída não pode ser menor que o peso de entrada.')) : yup.number(),
        pesoLiquido: deveValidarPeso.value === true ?yup.number().required('Peso líquido deve ser informado').min(0, 'Peso líquido deve ser maior que 0') : yup.string(),          
        pesoBruto: deveValidarPeso.value === true ?yup.number().required('Peso bruto deve ser informado').min(0, 'Peso bruto deve ser maior que 0') : yup.string(),            
    });
};

const formData = ref({
    situacao: '1',
    temCadastro: true,
    pesoEntrada: 0,
    pesoSaida: 0,
    pesoBruto: 0,
    descontos: 0,
    pesoLiquido: 0,
    classificacoes: []
});

const temAutonomiaDataPesagem = ref(false);
const visiblePesagemManual = ref(false)
const tipoPesoManual = ref('entrada')
const operacaoInterna = ref();
const formPesagem = ref(null)
const deveValidarPeso = ref(false);
const recalculandoClassificacao = ref(false);
const itemSelecionado = ref(undefined);
const mode = ref('create');
const pesagemId = ref(0);
const submiting = ref(false);
const situacoesPesagem = ref();
const seletorParceiroLocal = ref();
const finalizar = ref(false);

const opcoesSalvarCreate = [
    {
        label: 'Salvar e Finalizar',
        loading: submiting.value,
        command: () => { salvarRegistroFinalizar() }
    },
    {
        label: 'Recalcular Descontos',
        disabled: (itemSelecionado.value && itemSelecionado.value.usaClassificacaoAgricola === false),
        command: async () => {
            await recalcularClassificacoes();
        }
    },
    {
        label: 'Cancelar Pesagem',
        disabled: true,
        command: () => {
        }
    },
];

const opcoesSalvarEdit = [
    {
        label: 'Salvar',
        loading: submiting.value,
        command: () => { salvarRegistroSemFinalizar() }
    },
    {
        label: 'Recalcular Descontos',
        disabled: (itemSelecionado.value && itemSelecionado.value.usaClassificacaoAgricola === false),
        command: async () => {
            await recalcularClassificacoes();
        }
    },
    {
        label: 'Cancelar Pesagem',
        disabled: true,
        command: () => {
        }
    },
];

const situacaoPesagem = computed(() => {
    if (situacoesPesagem.value && situacoesPesagem.value.length > 0)
        return situacoesPesagem.value.find(s => s.value === formData.value.situacao)?.name;
    else
        return '';
});

const changeParceiroLocal = () => {
    formData.value.parceiroLocalPropriedadeId = undefined;
};

const execLancarPesagemManual = (tipoPesagem) => {
    tipoPesoManual.value = tipoPesagem;
    visiblePesagemManual.value = true;
}

const calcularPesoBruto = async () => {
    if (operacaoInterna.value && operacaoInterna.value.naturezaOperacao) {
        if (operacaoInterna.value.naturezaOperacao.indicadorOperacao === 'S') {
            formData.value.pesoBruto = formData.value.pesoSaida - formData.value.pesoEntrada;
        } else {
            formData.value.pesoBruto = formData.value.pesoEntrada - formData.value.pesoSaida;
        }
    } else {
        formData.value.pesoBruto = 0;
    }
    await calcularPesoLiquido();
}

const calcularDescontos = () => {
    formData.value.descontos = formData.value.classificacoes.reduce((acc, c) => acc + c.desconto, 0);
}
const calcularPesoLiquido = async () => {
    calcularDescontos();
    formData.value.pesoLiquido = formData.value.pesoBruto - formData.value.descontos
}

const closePesagemManual = async () => {
    visiblePesagemManual.value = false;
    calcularPesoBruto();
    await recalcularClassificacoes();
}

onMounted(() => {
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
    UsuarioService.checkAutonomia(contextoStore.contexto.empresaId, contextoStore.contexto.empresaFilialId, 'ALTDTPESAGEM').then((data) => {
        temAutonomiaDataPesagem.value = data;
    });
    TiposService.getSituacaoPesagem().then((data) => {
        situacoesPesagem.value = data;
    });
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
    formData.value.dataPesagem = new Date();

    itemSelecionado.value = undefined
    pesagemId.value = route.params.id || 0;
    if (pesagemId.value > 0) {
        mode.value = 'edit';
        nextTick(() => {
        PesagemService.getById(pesagemId.value).then((data) => {
            _.assign(formData.value, data);
             if (formData.value.classificacoes && formData.value.classificacoes.length > 0)
                formData.value.classificacoes.sort((a, b) => a.tipoClassificacaoAgricolaCodigo - b.tipoClassificacaoAgricolaCodigo);
            seletorParceiroLocal.value.reload(formData.value.parceiroLocalId);

        });
        })
    } else {
        mode.value = 'create';
    }
});

const changeOperacaoInterna = (objeto) => {
    operacaoInterna.value = objeto
    formData.value.entrada = operacaoInterna.value.naturezaOperacao.indicadorOperacao === 'E'
}

const salvarPrincipal = () => {
    deveValidarPeso.value = mode.value !== 'create';
    finalizar.value = mode.value !== 'create';
    nextTick(() => {
        formPesagem.value.handleSubmit();
    })
}

const salvarRegistroFinalizar = () => {
    deveValidarPeso.value = true;
    finalizar.value = true;
    nextTick(() => {
        formPesagem.value.handleSubmit();
    })
}

const salvarRegistroSemFinalizar = () => {
    deveValidarPeso.value = false;
    finalizar.value = false;
    nextTick(() => {
        formPesagem.value.handleSubmit();
    })
}

const changeTemCadastro = () => {
    if (formData.value.temCadastro) {
        formData.value.razaoSocialNome = undefined
        formData.value.nomePropriedade = undefined
    } else {
        formData.value.parceiroLocalId = undefined
        formData.value.parceiroLocalPropriedadeId = undefined
    }
}

const changeProduto = (item) => {
    if (item) {
        itemSelecionado.value = item;
    } else {
        itemSelecionado.value = undefined;
    }
    buscarTiposAgricolasConfigurados(formData.value.itemId, formData.value.safraId);
}

const changeSafra = () => {
    buscarTiposAgricolasConfigurados(formData.value.itemId, formData.value.safraId);
}

const buscarTiposAgricolasConfigurados = (produtoId, safraId) => {
    if (produtoId && safraId) {
        TipoClassificacaoAgricolaService.findByTiposConfigurados(produtoId, safraId).then((result) => {
            if (result && result.length > 0) {
                formData.value.classificacoes = result.map(c => {
                    return {
                        tipoClassificacaoAgricolaId: c.id,
                        tipoClassificacaoAgricolaCodigo: c.codigo,
                        tipoClassificacaoAgricolaNome: c.nome,
                        valor: 0,
                        desconto: 0,
                        percentualDesconto: 0
                    };
                });
            } else {
                formData.value.classificacoes = [];
            }
        }).catch(() => {
            formData.value.classificacoes = [];
        })
    } else {
        formData.value.classificacoes = [];
    }
}

const changeValorClassificacao = async (classificacao) => {
    const request = {
        produtoId: formData.value.itemId,
        safraId: formData.value.safraId,
        tipoClassificacaoAgricolaId: classificacao.tipoClassificacaoAgricolaId,
        pesoBaseCalculo: formData.value.pesoBruto,
        valor: classificacao.valor
    }
    recalculandoClassificacao.value = true;
    const response = await ClassificacaoAgricolaService.recalcular(request);
    classificacao.desconto = response.quantidadeDesconto || 0;
    classificacao.percentualDesconto = response.percentualDesconto || 0;
    await calcularPesoLiquido();
    recalculandoClassificacao.value = false;
}

const recalcularClassificacoes = async () => {
    recalculandoClassificacao.value = true;
    const request = formData.value.classificacoes.map(c => {
        return {
            produtoId: formData.value.itemId,
            safraId: formData.value.safraId,
            tipoClassificacaoAgricolaId: c.tipoClassificacaoAgricolaId,
            pesoBaseCalculo: formData.value.pesoBruto,
            valor: c.valor
        }
    })

    const response = await ClassificacaoAgricolaService.recalcularAll(request);
    response.forEach(element => {
        const c = formData.value.classificacoes.find(f => f.tipoClassificacaoAgricolaId === element.tipoClassificacaoAgricolaId);
        c.desconto = element.quantidadeDesconto;
        c.percentualDesconto = element.percentualDesconto;
    });
    await calcularPesoLiquido()
    recalculandoClassificacao.value = false;
}

const salvarRegistro = async () => {
    if (pesagemId.value === 0) {
        criarRegistro();
    } else {
        if (finalizar.value) {
            const result = await Swal.fire({
                title: 'Você confirma o fechamento?',
                text: 'Caso confirme, a pesagem será finalizada automáticamente após o salvamento.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Desistir',
                cancelButtonColor: "red",
                reverseButtons: true
            });

            if (result.value) {
                alterarRegistro();
            }
        } else {
            alterarRegistro();
        }
    }
};

const montarRequest = () => {
    const { dataPesagem, ...rest } = formData.value;
    return {
        ...rest,
        dataPesagem: formatToUTC(dataPesagem),
        situacao: finalizar.value ? '2' : '1'
    };
}

const criarRegistro = () => {
    submiting.value = true;
    const request = montarRequest();
    PesagemService.create(request)
        .then(() => {
            submiting.value = false;
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pesagem criada com sucesso', life: 5000 });
            router.push({ path: '/agricola/movimento/pesagem' });
        })
        .catch(() => {
            submiting.value = false;
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a pesagem.', life: 5000 });
        });
};

const alterarRegistro = () => {
    submiting.value = true;
    const request = montarRequest();
    PesagemService.update(request)
        .then(() => {
            submiting.value = false;
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Pesagem alterada com sucesso', life: 5000 });
            router.push({ path: '/agricola/movimento/pesagem' });
        })
        .catch(() => {
            submiting.value = false;
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a pesagem.', life: 5000 });
        });
};

const informaSafra = computed(() => {
    return itemSelecionado.value && itemSelecionado.value.informaSafraAgricola;
});

const handleCancelar = () =>{
    router.push({ path: '/agricola/movimento/pesagem' });
}


</script>

<template>
    <UWPageBase title="Lançamento de Pesagem" subtitle="Registrar informações da pesagem agrícola">
        <UWForm :schema="createSchema()" :values="formData" ref="formPesagem" :visibleSave="false" 
                @doSubmit="salvarRegistro" @doCancel="handleCancelar">
            <template #errors="{ errors }">
                <TabView class="col-12">
                    <TabPanel header="Dados Principais" class="col-12">
                        <div class="grid nested-grid col-12">
                            <div class="col-12">
                                <UWFieldSet title="Identificação da Pesagem" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInteger id="numero" label="Número" disabled v-model="formData.id" classContainer="col-12 md:col-2" />
                                        <UWSeletor
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
                                        <UWCalendar
                                            id="dataPesagem"
                                            label="Data da Pesagem"
                                            dateFormat="dd/mm/yy"
                                            :disabled="!temAutonomiaDataPesagem"
                                            required
                                            v-model="formData.dataPesagem"
                                            :errors="errors.value?.dataPesagem"
                                            classContainer="col-12 md:col-2"
                                        />
                                        <UWSeletor
                                            id="operacaoInterna"
                                            classContainer="col-12 md:col-4"
                                            v-model="formData.operacaoInternaId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            label="Operação Interna"
                                            :service="OperacaoInternaService"
                                            placeholder="Selecione a operação interna"
                                            @changeObject="changeOperacaoInterna"
                                            :erros="errors.value?.operacaoInternaId"
                                            :columnsFilters="[{ field: 'caracteristicaAgricola', value: true, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'caracteristicaAgricola' }]"
                                        />
                                        <UWInput id="situacao" label="Situação" disabled v-model="situacaoPesagem" classContainer="col-12 md:col-2" />
                                        <div class="field md:col-2 pt-0">
                                            <span class="p-float-label">
                                                <ToggleButton v-model="formData.temCadastro" onLabel="Informar Cadastro" offLabel="Sem Cadastro" onIcon="pi pi-lock" offIcon="pi pi-lock-open" class="w-full" 
                                                    :onchange="changeTemCadastro()"
                                                />
                                            </span>
                                        </div>
                                        <UWParceiroLocal
                                            v-if="formData.temCadastro"
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
                                            v-if="formData.temCadastro"
                                            id="propriedade"
                                            ref="seletorPropriedade"
                                            :parceiroLocalId="formData.parceiroLocalId"
                                            classContainer="col-12 md:col-5"
                                            v-model="formData.parceiroLocalPropriedadeId"
                                            required
                                            label="Propriedade"
                                            :erros="errors.value?.parceiroLocalPropriedadeId"
                                        />
                                        <UWInput v-if="!formData.temCadastro" id="razaoSocialNome" label="Razão Social / Nome" required v-model="formData.razaoSocialNome" :errors="errors.value?.razaoSocialNome" classContainer="col-12 md:col-5" />
                                        <UWInput v-if="!formData.temCadastro" id="nomePropriedade" label="Propriedade" required v-model="formData.nomePropriedade" :errors="errors.value?.nomePropriedade" classContainer="col-12 md:col-5" />
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-12">
                                <UWFieldSet title="Dados da Pesagem" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWSeletor
                                            :classContainer="{'col-12':true, 'md:col-3': informaSafra, 
                                                              'md:col-5': !informaSafra}"
                                            label="Produto"
                                            v-model="formData.itemId"
                                            required
                                            optionLabel="nome"
                                            optionValue="id"
                                            :service="ItemService"
                                            placeholder="Selecione o item"
                                            :erros="errors.value?.itemId"
                                            @changeObject="changeProduto"
                                            :columnsFilters="[{ field: 'informaPesagemAgricola', value: true, matchMode: 'equal', tipoField: 'boolean', fieldFilter: 'informaPesagemAgricola' }]"
                                        />
                                        <UWSeletor classContainer="col-12 md:col-2" label="safra" v-model="formData.safraId" 
                                                   :required="informaSafra" 
                                                   v-if="informaSafra"
                                                   optionLabel="nome" optionValue="id" 
                                                   :service="SafraService" placeholder="Selecione a safra" @change="changeSafra" :erros="errors.value?.safraId" />
                                        <UWPeso id="pesoEntrada" label="Peso Entrada" disabled v-model="formData.pesoEntrada" :errors="errors.value?.pesoEntrada" classContainer="col-12 md:col-2" 
                                                @lancarPesagemManual="execLancarPesagemManual('entrada')"  :pesagemManual="formData.pesoEntradaManual"
                                                :habilitaCapturaAutomatica="false"
                                        />
                                        <UWPeso id="pesoSaida" label="Peso Saída" disabled v-model="formData.pesoSaida" :errors="errors.value?.pesoSaida" classContainer="col-12 md:col-2" 
                                                @lancarPesagemManual="execLancarPesagemManual('saida')"  :pesagemManual="formData.pesoSaidaManual"
                                                :habilitaCapturaAutomatica="false"
                                        />
                                        <UWInteger id="pesoBruto" label="Peso Bruto" disabled v-model="formData.pesoBruto" :errors="errors.value?.pesoBruto" classContainer="col-12 md:col-1" />
                                        <UWInteger id="descontos" label="Descontos" disabled v-model="formData.descontos" :errors="errors.value?.pesoBruto" classContainer="col-12 md:col-1" />
                                        <UWInteger id="pesoLiquido" label="Peso Líquido" disabled v-model="formData.pesoLiquido" :errors="errors.value?.pesoBruto" classContainer="col-12 md:col-1" />
                                    </div>
                                </UWFieldSet>
                            </div>
                            <div class="col-7">
                                <UWFieldSet title="Dados do Transporte" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInput id="placa" label="Placa" required v-model="formData.placa1" :errors="errors.value?.placa1" classContainer="col-12 md:col-2" />
                                        <UWInput id="placa2" label="Placa 2" v-model="formData.placa2"  classContainer="col-12 md:col-2" />
                                        <UWInput id="placa3" label="Placa 3" v-model="formData.placa3"  classContainer="col-12 md:col-2" />
                                        <UWInput id="nomeMotorista" label="Nome do Motorista" required v-model="formData.nomeMotorista" :errors="errors.value?.nomeMotorista" classContainer="col-12 md:col-3" />
                                        <UWInput id="contatoMotorista" label="Contato do Motorista" required v-model="formData.contatoMotorista" :errors="errors.value?.contatoMotorista" classContainer="col-12 md:col-3" />
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
                    <TabPanel v-if="itemSelecionado && itemSelecionado.usaClassificacaoAgricola" header="Classificação" class="col-12">
                        <div class="grid nested-grid col-12">
                            <!-- <div class="col-12"> -->
                                <!-- <UWFieldSet title="Lançamento da Classificação" class="h-full"> -->
                                    <!-- <div class="p-fluid formgrid grid"> -->
                                        <DataTable ref="dtClassificacao" :value="formData.classificacoes" scrollable scrollHeight="15em" stripedRows responsiveLayout="scroll" dataKey="id" size="small" 
                                                    :loading="recalculandoClassificacao"
                                                    class="col-12">
                                            <template #empty> Nenhum tipo de classificação disponível. </template>
                                            <!-- <template #header>
                                                <div class="flex flex-wrap align-items-center justify-content-end gap-2">
                                                    <Button label="Adicionar Parcela" icon="pi pi-plus" text @click="adicionarParcela" />
                                                </div>
                                            </template> -->
                                            <Column field="tipoClassificacaoAgricolaCodigo" header="Código" style="width: 10%">
                                                    <template #body="slotProps">
                                                        <UWInput
                                                            class="w-full"
                                                            disabled
                                                            v-model="slotProps.data.tipoClassificacaoAgricolaCodigo"
                                                        />
                                                    </template>
                                            </Column>
                                            <Column field="tipoClassificacaoAgricolaNome" header="Nome" style="width: 35%">
                                                    <template #body="slotProps">
                                                        <UWInput
                                                            class="w-full"
                                                            disabled
                                                            v-model="slotProps.data.tipoClassificacaoAgricolaNome"
                                                        />
                                                    </template>
                                                    ></Column
                                                >
                                            <Column field="valor" header="Valor" style="width: 15%">
                                                    <template #body="slotProps">
                                                        <UWInteger
                                                            class="w-full"
                                                            v-model="slotProps.data.valor"
                                                            @change="changeValorClassificacao(slotProps.data)"
                                                        />
                                                    </template>
                                                    ></Column
                                                >
                                                <Column field="percentualDesconto" header="% Desconto" style="width: 10%">
                                                    <template #body="slotProps">
                                                        <UWInteger
                                                            class="w-full"
                                                            disabled
                                                            v-model="slotProps.data.percentualDesconto"
                                                        />
                                                    </template>
                                                    ></Column
                                                >
                                                <Column field="desconto" header="Desconto" style="width: 15%">
                                                    <template #body="slotProps">
                                                        <UWInteger
                                                            class="w-full"
                                                            disabled
                                                            v-model="slotProps.data.desconto"
                                                        />
                                                    </template>
                                                ></Column
                                                >                                                
                                        </DataTable>                                        
                                    <!-- </div> -->
                                <!-- </UWFieldSet> -->
                            <!-- </div> -->
                        </div>
                    </TabPanel>
                    <!-- <TabPanel header="Nota Fiscal" class="col-12">
                        <div class="col-12">
                                <UWFieldSet title="Dados da Nota" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWInteger id="numeroNota" label="Número da Nota" v-model="formData.numeroNota" :errors="errors.value?.numeroNota" classContainer="col-12 md:col-3" />
                                        <UWCalendar id="dataPesagem" label="Data da Nota" dateFormat="dd/mm/yy" v-model="formData.dataNota" :errors="errors.value?.dataNota" classContainer="col-12 md:col-3" />
                                        <UWDecimal id="pesoNota" label="Peso da Nota" v-model="formData.pesoNota" :errors="errors.value?.pesoNota" classContainer="col-12 md:col-3" />
                                        <UWCurrency id="valorUnitNota" label="Valor Unitário" v-model="formData.valorNota" :errors="errors.value?.valorNota" classContainer="col-12 md:col-3" />
                                    </div>
                                </UWFieldSet>
                            </div>                        
                    </TabPanel> -->
                </TabView>
                <ProgressBar v-if="recalculandoClassificacao" mode="indeterminate" />
            </template>
            <template #buttonsRight>
                <SplitButton :label="mode === 'create' ? 'Salvar' : 'Salvar e Finalizar'" :loading="submiting" :disabled="recalculandoClassificacao" 
                             @click="salvarPrincipal" :model="mode === 'create' ? opcoesSalvarCreate : opcoesSalvarEdit" />
            </template>
        </UWForm>
        <InformaPesagemManual id="informaPesagemManual" v-model="formData" :showDialog="visiblePesagemManual" @closeDialog="closePesagemManual" :tipo-peso="tipoPesoManual"/>
    </UWPageBase>
</template>
