<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import * as yup from 'yup';
import { useRoute, useRouter } from 'vue-router';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';
import { useToast } from 'primevue/usetoast';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';
import { CotacaoMercadoriaService, SolicitacaoMercadoriaService, DepartamentoService } from '@/service';
import SelecaoParceiro from '@/views/administrativo/relacionamento/selecaoParceiro/SelecaoParceiro.vue';

const createSchema = () => {
    return yup.object().shape({
        parceiros: yup.array().min(1).required('Deve ser informado ao menos um parceiro'),
        temItemSelecionado: yup.boolean().oneOf([true], 'Deve ser informado ao menos um item para cotação').required('Deve ser informado ao menos um item para cotação')
    });
};

const itemsActions = [
    {
        label: 'Apenas Salvar',
        icon: 'pi pi-lock',
        command: () => {
            handleApenasSalvar();
        }
    },
    {
        label: 'Desistir',
        icon: 'pi pi-times-circle',
        disabled: () => mode.value === 'nova',
        command: () => {
            handleDesistir();
        }
    }
];

const route = useRoute();
const router = useRouter();
const { formatDocumento } = useFormatDocumentos();
const toast = useToast();
const contextoStore = useContexto();
const { formatDate, formatToDDMMYYYY } = useFormatDate();
const selectedSolicitacao = ref(null);
const selectedSolicitacaoItens = ref([]);
const formData = ref({
    // parceiros: [],
    // solicitacoes: undefined
});
const formCotacaoItem = ref();
const seletorDepartamento = ref();

const mode = ref('nova');
const visibleSelecaoParceiro = ref(false);
const expandedRows = ref({});

const handleCancelar = () => {
    router.push({ path: '/compra/cotacao/cotacao-item' });
};

const adicionarParceiro = () => {
    visibleSelecaoParceiro.value = true;
};

const handleVoltarSelecao = () => {
    visibleSelecaoParceiro.value = false;
};

const jaExisteParceiro = (parceiroLocalId) => {
    return formData.value.parceiros.some((parceiro) => parceiro.parceiroLocalId === parceiroLocalId);
};

const handleConfirmarSelecao = (parceiro) => {
    visibleSelecaoParceiro.value = false;
    if (!formData.value.parceiros) formData.value.parceiros = [];
    if (jaExisteParceiro(parceiro.dadosParceiroLocal.id)) {
        toast.add({ severity: 'error', summary: 'Falha', detail: 'Parceiro já adicionado a listagem', life: 5000 });
    } else {
        formData.value.parceiros.push({ parceiroLocalId: parceiro.dadosParceiroLocal.id, ...parceiro.dadosParceiroLocal });
    }
};

const getEnderecoCompleto = (objetoEndereco) => {
    return `${objetoEndereco.endereco}, ${objetoEndereco.numero}, ${objetoEndereco.bairro}, ${objetoEndereco.cidadeNome} - ${objetoEndereco.ufSigla}, ${objetoEndereco.paisNome}, CEP: ${objetoEndereco.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
};

const handleDeleteParceiro = (parceiroLocalId) => {
    formData.value.parceiros = formData.value.parceiros.filter((parceiro) => parceiro.parceiroLocalId !== parceiroLocalId);
};

const buscarSolicitacoesEmAberto = async () => {
    await SolicitacaoMercadoriaService.buscarSolicitacoesPendentesParaCotacao(formData.value.departamentoSolicitadoId).then((response) => {
            formData.value.solicitacoes = response;
            if (formData.value.solicitacoes && formData.value.solicitacoes.length > 0) {
                selectedSolicitacao.value = formData.value.solicitacoes[0];
            }
    });    
}
const changeDepartamento = async (departamento) => {
    if (departamento) {
        console.log('changeDepartamento');
        await buscarSolicitacoesEmAberto();
    } else {
        formData.value.solicitacoes = [];
        selectedSolicitacao.value = null;
        selectedSolicitacaoItens.value = [];
    }
};

const itensDaSolicitacaoSelecionada = computed(() => {
    return selectedSolicitacao.value ? selectedSolicitacao.value.itens : [];
});

const getNomeItem = (solicitacaoItem) => {
    if (solicitacaoItem.itemId) {
        return `${solicitacaoItem.itemNome}`;
    }
    if (solicitacaoItem.itemSimplificadoId) {
        return `${solicitacaoItem.itemSimplificadoNome}`;
    }
};

const selectItem = () => {
    nextTick(() => {
        if (selectedSolicitacaoItens.value && selectedSolicitacaoItens.value.length > 0) {
            formData.value.temItemSelecionado = true;
        }
    });
};

const unSelectItem = () => {
    nextTick(() => {
        if (!selectedSolicitacaoItens.value || selectedSolicitacaoItens.value.length === 0) {
            formData.value.temItemSelecionado = false;
        }
    });
};

const selectAllItens = (event) => {
    const updatedSelection = [...selectedSolicitacaoItens.value, ...event.data];
    nextTick(() => {
        selectedSolicitacaoItens.value = updatedSelection;
        if (selectedSolicitacaoItens.value && selectedSolicitacaoItens.value.length > 0) {
            formData.value.temItemSelecionado = true;
        }
    });
};

const unSelectAllItens = () => {
    if (selectedSolicitacao.value) {
        const idSolicitacao = selectedSolicitacao.value.id;

        const updatedSelection = selectedSolicitacaoItens.value.filter((item) => item.solicitacaoMercadoriaId !== idSolicitacao);
        nextTick(() => {
            selectedSolicitacaoItens.value = updatedSelection;
            if (!selectedSolicitacaoItens.value || selectedSolicitacaoItens.value.length === 0) {
                formData.value.temItemSelecionado = false;
            }
        });
    }
};

onMounted(async () => {
    const id = route.params.id || 0;
    if (id > 0) {
        mode.value = 'editar';
        await CotacaoMercadoriaService.getById(id).then(async (data) => {
            
            formData.value.id = data.id;
            formData.value.numero = data.numero;
            formData.value.dataCotacao = data.dataCotacao;
            formData.value.situacaoCotacaoMercadoria = data.situacaoCotacaoMercadoria;
            formData.value.departamentoSolicitadoId = data.departamentoCotacaoId;
            formData.value.parceiros = [];
            formData.value.solicitacoes = [];
            
            await buscarSolicitacoesEmAberto();

            data.parceiros.forEach((parceiro) => {
                formData.value.parceiros.push({
                    id: parceiro.id,
                    cotacaoMercadoriaId: parceiro.cotacaoMercadoriaId,
                    parceiroLocalId: parceiro.parceiroLocal.id,
                    cpfCnpj: parceiro.parceiroLocal.cpfCnpj,
                    nomeRazaoSocial: parceiro.parceiroLocal.nomeRazaoSocial,
                    nomeLocal: parceiro.parceiroLocal.nomeLocal,
                    enderecos: parceiro.parceiroLocal.enderecos
                });
                parceiro.itens.forEach((item) => {
                    let solicitacao = formData.value.solicitacoes.find((solicitacao) => solicitacao.id === item.solicitacaoMercadoriaId);
                    if (!solicitacao) {
                        solicitacao = {
                            id: item.solicitacaoMercadoriaId,
                            numero: item.solicitacaoMercadoriaNumero,
                            dataSolicitacao: item.solicitacaoMercadoriaDataSolicitacao,
                            departamentoSolicitanteSigla: item.solicitacaoMercadoriaDepartamentoSolicitanteSigla,
                            itens: []
                        };
                        formData.value.solicitacoes.push(solicitacao);
                    }
                    let itemSolicitacao = solicitacao.itens.find((it) => it.id === item.solicitacaoMercadoriaItemId);
                    if (!itemSolicitacao) {
                        itemSolicitacao = {
                            id: item.solicitacaoMercadoriaItemId,
                            solicitacaoMercadoriaId: item.solicitacaoMercadoriaId,
                            itemId: item.itemId,
                            itemSimplificadoId: item.itemSimplificadoId,
                            itemNome: item.itemNome,
                            itemSimplificadoNome: item.itemSimplificadoNome,
                            quantidadeSolicitada: item.solicitacaoMercadoriaItemQuantidadeSolicitada, 
                            previsaoDiasUtilizacao: item.solicitacaoMercadoriaItemPrevisaoDiasUtilizacao,
                            urgenciaSolicitacaoMercadoria: item.solicitacaoMercadoriaItemUrgenciaSolicitacao,
                            departamentoEntregaSigla: item.solicitacaoMercadoriaItemDepartamentoEntregaSigla,
                            observacao: item.solicitacaoMercadoriaItemObservacao,
                            usuarioSolicitacaoNome: item.solicitacaoMercadoriaItemUsuarioSolicitacaoNome
                        }
                        solicitacao.itens.push(itemSolicitacao);

                        nextTick(() => {
                            const updatedSelection = [...selectedSolicitacaoItens.value, itemSolicitacao];
                            selectedSolicitacaoItens.value = updatedSelection;
                            if (selectedSolicitacaoItens.value && selectedSolicitacaoItens.value.length > 0) {
                                formData.value.temItemSelecionado = true;
                            }
                        });

                    }
                });
            });

            

            if (formData.value.solicitacoes && formData.value.solicitacoes.length > 0) {
                selectedSolicitacao.value = formData.value.solicitacoes[0];
            }
        });
    } else {
        mode.value = 'nova';
    }
});

const onRowSelect = (event) => {
    console.log('onRowSelect', event);
    console.log('onRowSelect de', selectedSolicitacaoItens.value);
};

const getSolicitacaoPeloId = (id) => {
    return formData.value.solicitacoes.find((solicitacao) => solicitacao.id === id);
};

const itensSelecionadosAgrupados = computed(() => {
    const agrupados = {};

    // Itera sobre os itens selecionados e agrupa por itemId ou itemSimplificadoId
    selectedSolicitacaoItens.value.forEach((item) => {
        // Verifica qual identificador usar
        if (!item.itemId && !item.itemSimplificadoId) {
            return;
        }
        let idItemAgrupado = null;
        if (item.itemId) {
            idItemAgrupado = item.itemId;
        } else if (item.itemSimplificadoId) {
            idItemAgrupado = 'Simpl_' + item.itemSimplificadoId
        }
        const quantidade = item.quantidadeSolicitada || 0; // Ajuste conforme sua estrutura

        if (!agrupados[idItemAgrupado]) {
            // Se o item não estiver no objeto de agrupamento, inicializa
            agrupados[idItemAgrupado] = {
                id: idItemAgrupado,
                idItem: item.itemId,
                idItemSimplificado: item.itemSimplificadoId,
                itemNome: item.itemNome || item.itemSimplificadoNome, // Adiciona todos os detalhes do item
                quantidade: quantidade, // Inicializa a quantidade,
                solicitacoes: []
            };
            agrupados[idItemAgrupado].solicitacoes.push({
                id: item.solicitacaoMercadoriaId,
                numero: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).numero,
                departamentoSolicitante: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).departamentoSolicitanteSigla,
                dataSolicitacao: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).dataSolicitacao,
                quantidadeSolicitada: item.quantidadeSolicitada,
                previsaoDiasUtilizacao: item.previsaoDiasUtilizacao,
                urgenciaSolicitacaoMercadoria: item.urgenciaSolicitacaoMercadoria,
                departamentoEntrega: item.departamentoEntregaSigla,
                observacao: item.observacao,
                solicitante: item.usuarioSolicitacaoNome
            });
        } else {
            // Se já existe, soma a quantidade
            agrupados[idItemAgrupado].quantidade += quantidade;
            agrupados[idItemAgrupado].solicitacoes.push({
                id: item.solicitacaoMercadoriaId,
                numero: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).numero,
                departamentoSolicitante: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).departamentoSolicitanteSigla,
                dataSolicitacao: getSolicitacaoPeloId(item.solicitacaoMercadoriaId).dataSolicitacao,
                quantidadeSolicitada: item.quantidadeSolicitada,
                previsaoDiasUtilizacao: item.previsaoDiasUtilizacao,
                urgenciaSolicitacaoMercadoria: item.urgenciaSolicitacaoMercadoria,
                departamentoEntrega: item.departamentoEntregaSigla,
                observacao: item.observacao,
                solicitante: item.usuarioSolicitacaoNome
            });
        }
    });

    // Converte o objeto de agrupamento de volta para um array
    return Object.values(agrupados);
});

const handleConfirmar = async () => {
    nextTick(() => {
        formData.value.situacaoCotacaoMercadoria = '2';
        formCotacaoItem.value.handleSubmit();
    });
};

const salvarRegistro = () => {
    if (mode.value === 'nova') {
        criarRegistro();
    }
    if (mode.value === 'editar') {
        alterarRegistro();
    }
};

const montarRequest = () => {
    const payload = {
        id: formData.value.id,
        departamentoCotacaoId: formData.value.departamentoSolicitadoId,
        dataCotacao: formatDate(new Date(), 'yyyy-MM-dd'),
        numero: formData.value.numero,
        situacaoCotacaoMercadoria: formData.value.situacaoCotacaoMercadoria || '1',
        parceiros: []
    };
    formData.value.parceiros.forEach((parceiro) => {
        payload.parceiros.push({
            id: parceiro.id,
            parceiroLocalId: parceiro.parceiroLocalId,
            itens: selectedSolicitacaoItens.value.map((item) => {
                return {
                    itemId: item.itemId,
                    itemSimplificadoId: item.itemSimplificadoId,
                    quantidade: item.quantidadeSolicitada,
                    solicitacaoMercadoriaItemId: item.id,
                    status: '1'
                };
            })
        });
    });
    return payload;
};

const criarRegistro = () => {
    const payload = montarRequest();

    CotacaoMercadoriaService.create(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cotação de item salva com sucesso', life: 5000 });
            router.push({ path: '/compra/cotacao/cotacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível salvar a cotação de item.', life: 5000 });
        });
};

const alterarRegistro = () => {
    const payload = montarRequest();
    CotacaoMercadoriaService.update(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Cotação de item salva com sucesso', life: 5000 });
            router.push({ path: '/compra/cotacao/cotacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível salvar a cotação de item', life: 5000 });
        });
};

const handleApenasSalvar = async () => {
    nextTick(() => {
        formData.value.situacaoCotacaoMercadoria = '1';
        formCotacaoItem.value.handleSubmit();
    });
};

const handleDesistir = () => {
    const cotacaoMercadoriaItemId = formData.value.id;
    CotacaoMercadoriaService.delete(cotacaoMercadoriaItemId)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Desistência da Cotação com sucesso', life: 5000 });
            router.push({ path: '/compra/cotacao/cotacao-item' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível realizar a desistência da cotação.', life: 5000 });
        });
};
</script>

<template>
    <UWPageBase title="Gerar Cotação">
        <UWForm
            :schema="createSchema()"
            :values="formData"
            ref="formCotacaoItem"
            :visibleSave="false"
            :visibleCancel="mode !== 'visualizar'"
            :visibleVoltar="mode === 'visualizar'"
            @doSubmit="salvarRegistro"
            @doCancel="handleCancelar"
            @doVoltar="handleVoltar"
        >
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="grid nested-grid">
                        <div class="col-12">
                            <UWFieldSet title="Definição dos Parceiros" class="h-full flex flex-column justify-content-start border-solid">
                                <Toolbar>
                                    <template v-slot:start>
                                        <div>
                                            <Button label="Adicionar Parceiro" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarParceiro()" />
                                        </div>
                                    </template>
                                </Toolbar>
                                <Message class="col-12 p-0 m-0 mb-2" :closable="false" severity="warn" v-if="errors?.value?.parceiros">Atenção! Deve ser informada parceiro para a solicitação.</Message>
                                <DataTable ref="dtParceiros" :value="formData.parceiros" size="small" responsiveLayout="scroll" :key="parceiroLocalId">
                                    <template #empty> Nenhum parceiro informado </template>
                                    <Column field="cpfCnpj" header="Cpf / Cnpj">
                                        <template #body="slotProps">
                                            <div class="w-full text-left">{{ formatDocumento(slotProps.data.cpfCnpj) }}</div>
                                        </template>
                                    </Column>
                                    <Column field="nomeRazaoSocial" header="Nome / Razão Social" />
                                    <Column field="nomeLocal" header="Filial" />
                                    <Column header="Endereço">
                                        <template #body="slotProps">
                                            <div class="w-full text-left">{{ slotProps.data.enderecos ? getEnderecoCompleto(slotProps.data.enderecos[0]) : ""}}</div>
                                        </template>
                                    </Column>
                                    <Column header="Ações" style="width: 10%">
                                        <template #body="slotProps">
                                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDeleteParceiro(slotProps.data.parceiroLocalId)" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </UWFieldSet>
                        </div>
                        <TabView class="w-full">
                            <TabPanel header="Composição">
                                <Message class="col-12 p-0 m-0 mb-2" :closable="false" severity="warn" v-if="errors?.value?.temItemSelecionado">Atenção! Deve ser informada pelo menos um item para cotação.</Message>
                                <div class="grid nested-grid">
                                    <div class="col-4">
                                        <UWSeletor
                                            id="departamento"
                                            ref="seletorDepartamento"
                                            classContainer="col-12 md:col-12 w-full p-0"
                                            v-model="formData.departamentoSolicitadoId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            :disabled="mode !== 'nova'"
                                            label="Departamento Solicitado"
                                            :service="DepartamentoService"
                                            :selecaoAutomatica="false"
                                            placeholder="Selecione o departamento"
                                            :erros="errors.value?.departamentoEntregaId"
                                            :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                            @changeObject="changeDepartamento"
                                        />
                                        <UWFieldSet title="" class="col-12 flex flex-column justify-content-start bg-primary-50 border-solid">
                                            <DataTable
                                                ref="dtSolicitacoes"
                                                v-model:selection="selectedSolicitacao"
                                                selectionMode="single"
                                                :metaKeySelection="metaKey"
                                                dataKey="id"
                                                :value="formData.solicitacoes"
                                                size="small"
                                                responsiveLayout="scroll"
                                                classHeader="bg-primary-50"
                                                scrollHeight="20rem"
                                                style="height: 20rem"
                                            >
                                                <template #header>
                                                    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                                                        <span class="text-sm text-900 font-bold">Solicitações</span>
                                                        <!-- <Button icon="pi pi-refresh" rounded raised /> -->
                                                    </div>
                                                </template>
                                                <template #empty> Nenhuma solicitação disponível </template>
                                                <Column selectionMode="single" headerStyle="width: 3rem"></Column>
                                                <Column field="numero" header="Nº" />
                                                <Column header="Solicitante">
                                                    <template #body="slotProps">
                                                        <div class="w-full text-left">{{ slotProps.data.departamentoSolicitanteSigla }}</div>
                                                    </template>
                                                </Column>
                                                <Column header="Data">
                                                    <template #body="slotProps">
                                                        <div class="w-full text-left">{{ formatToDDMMYYYY(slotProps.data.dataSolicitacao) }}</div>
                                                    </template>
                                                </Column>
                                            </DataTable>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-8">
                                        <UWFieldSet title="" class="h-full w-full flex flex-column justify-content-start border-solid">
                                            <DataTable
                                                ref="dtSolicitacoes"
                                                size="small"
                                                stripedRows
                                                :value="itensDaSolicitacaoSelecionada"
                                                responsiveLayout="scroll"
                                                v-model:selection="selectedSolicitacaoItens"
                                                dataKey="id"
                                                scrollHeight="20rem"
                                                style="height: 20rem"
                                                @row-select="selectItem"
                                                @row-unselect="unSelectItem"
                                                @row-select-all="selectAllItens"
                                                @row-unselect-all="unSelectAllItens"
                                                @rowSelect="onRowSelect"
                                            >
                                                <template #header>
                                                    <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                                                        <span class="text-sm text-900 font-bold">Itens da Solicitação</span>
                                                        <!-- <Button icon="pi pi-refresh" rounded raised /> -->
                                                    </div>
                                                </template>
                                                <template #empty> Nenhum item disponível </template>
                                                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                                                <Column header="Item">
                                                    <template #body="slotProps">
                                                        <div class="w-full text-left">{{ getNomeItem(slotProps.data) }}</div>
                                                    </template>
                                                </Column>
                                                <Column header="Quantidade">
                                                    <template #body="slotProps">
                                                        <div class="w-full text-left">{{ slotProps.data.quantidadeSolicitada }}</div>
                                                    </template>
                                                </Column>
                                                <Column field="previsaoDiasUtilizacao" header="Prev. Dias" />
                                                <Column field="urgenciaSolicitacaoMercadoria" header="Urgência" />
                                                <Column header="Departamento Entrega">
                                                    <template #body="slotProps">
                                                        <div class="w-full text-left">{{ slotProps.data.departamentoEntregaSigla }}</div>
                                                    </template>
                                                </Column>
                                                <Column field="observacao" header="Observação" />
                                                <Column field="usuarioSolicitacaoNome" header="Solicitante" />
                                            </DataTable>
                                        </UWFieldSet>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Resumo" class="col-12">
                                <UWFieldSet title="" class="h-full col-12 flex flex-column justify-content-start border-solid">
                                    <DataTable ref="dtSolicitacoes" size="small" :value="itensSelecionadosAgrupados" responsiveLayout="scroll" dataKey="id" v-model:expandedRows="expandedRows">
                                        <template #header>
                                            <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                                                <span class="text-sm text-900 font-bold">Resumo da Cotação</span>
                                                <!-- <Button icon="pi pi-refresh" rounded raised /> -->
                                            </div>
                                        </template>
                                        <template #empty> Nenhum item disponível </template>
                                        <Column expander style="width: 1rem" />
                                        <Column field="itemNome" header="Item" />
                                        <Column field="quantidade" header="Quantidade Solicitada" />
                                        <template #expansion="slotProps">
                                            <div class="p-1 bg-primary-100">
                                                <h6>Solicitações para item {{ slotProps.data.itemNome }}</h6>
                                                <DataTable :value="slotProps.data.solicitacoes">
                                                    <Column field="numero" header="Nº Solicitação"></Column>
                                                    <Column header="Departamento de Entrega">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-left">{{ slotProps.data.id }}</div>
                                                        </template>
                                                    </Column>
                                                    <Column header="Data">
                                                        <template #body="slotProps">
                                                            <div class="w-full text-left">{{ formatToDDMMYYYY(slotProps.data.dataSolicitacao) }}</div>
                                                        </template>
                                                    </Column>
                                                    <Column field="quantidadeSolicitada" header="Quantidade Solicitada" />
                                                    <Column field="previsaoDiasUtilizacao" header="Prev. Dias" />
                                                    <Column field="urgenciaSolicitacaoMercadoria" header="Urgência" />
                                                    <Column field="departamentoEntrega" header="Departamento Entrega" />
                                                    <Column field="observacao" header="observacao" />
                                                    <Column field="solicitante" header="Solicitante" />
                                                </DataTable>
                                            </div>
                                        </template>
                                    </DataTable>
                                </UWFieldSet>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </template>
            <template #buttonsRight>
                <SplitButton v-if="!isVisualizar" label="Confirmar" icon="pi pi-check" menuButtonIcon="pi pi-cog" :model="itemsActions" @click="handleConfirmar" />
            </template>
        </UWForm>
    </UWPageBase>
    <SelecaoParceiro :visible="visibleSelecaoParceiro" @doVoltar="handleVoltarSelecao" @doConfirmar="handleConfirmarSelecao" />
</template>
