<script setup>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useFormatDate } from '@/composables/useFormatDate';
import { TituloService } from '@/service';

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

const { formatNumber } = useFormatNumber();
const { formatToDDMMYYYY, formatToDDMMYYYYHHMMSS } = useFormatDate();

const mode = ref('lista');
const tituloSelecionado = ref({});
const parcelaSelecionada = ref();

const handleVoltar = () => {
    if (mode.value === 'detalhe') mode.value = 'lista';
    else emit('doVoltar');
};

const handleVisualizar = (tituloId) => {
    TituloService.getById(tituloId)
        .then((response) => {
            tituloSelecionado.value = response;
            parcelaSelecionada.value = response.parcelas[0];
            mode.value = 'detalhe';
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao buscar título',
                text: error.response.data.message
            });
        });
};

const getIdentificacaoParceiro = computed(() => {
    return `${tituloSelecionado.value.parceiroNome} - ${tituloSelecionado.value.parceiroLocalNome}`;
});

const getValorTitulo = computed(() => {
    return formatNumber(tituloSelecionado.value.valorTitulo);
});

const getMovimentos = computed(() => {
    return parcelaSelecionada.value ? parcelaSelecionada.value.movimentos : [];
});
</script>

<template>
    <UWPageBase title="Consulta de Títulos" :subtitle="mode === 'lista' ? 'Selecione um título para ver mais informações' : ''">
        <UWForm ref="formConsultaTitulo" :visibleSave="false" :visibleCancel="false" :visibleVoltar="true" @doVoltar="handleVoltar">
            <div v-if="mode === 'lista'" class="col-12">
                <UWFieldSet title="Titulos Selecionados">
                    <DataTable :value="localModelValue" paginator :rows="10" dataKey="tituloId" showGridlines size="small" stripedRows>
                        <template #empty> Sem títulos selecionados para consulta. </template>
                        <Column field="tipoTituloSigla" header="Tipo" sortable headerClass="columnHeaderItem" />
                        <Column field="nossoNumero" header="Nosso Número" sortable headerClass="columnHeaderItem" />
                        <Column field="departamentoSigla" header="Departamento" sortable headerClass="columnHeaderItem" />
                        <Column field="parceiroNome" header="Parceiro" sortable headerClass="columnHeaderItem" />
                        <Column field="grupoFinanceiroSigla" header="Grupo Financeiro" sortable headerClass="columnHeaderItem" />
                        <Column field="fatoGeradorSigla" header="Fato Gerador" sortable headerClass="columnHeaderItem" />
                        <Column field="caracteristicaMovimentoFinanceiroSigla" header="Característica Movimento" sortable headerClass="columnHeaderItem" />
                        <Column field="historicoPadraoSigla" header="Histórico Padrão" sortable headerClass="columnHeaderItem" />
                        <Column field="documento" header="Documento" sortable headerClass="columnHeaderItem" />
                        <Column field="dataDocumento" header="Data Documento" sortable headerClass="columnHeaderItem" />
                        <Column field="valorTitulo" header="Valor Título" sortable headerClass="columnHeaderItem">
                            <template #body="slotProps">
                                <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorTitulo) }}</div>
                            </template>
                        </Column>
                        <Column header="" style="width: 5%">
                            <template #body="slotProps">
                                <Button icon="pi pi-arrow-right" class="p-button-secundary p-button-sm mr-2" outlined @click="handleVisualizar(slotProps.data.tituloId)" />
                            </template>
                        </Column>
                    </DataTable>
                </UWFieldSet>
            </div>
            <div v-if="mode === 'detalhe'" class="col-12">
                <div class="col-12">
                    <UWFieldSet title="Detalhes do Título">
                        <div class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="tipoTitulo" label="Tipo do Título" v-model="tituloSelecionado.tipoTituloNome" disabled classContainer="col-12 md:col-2" />
                                <UWInput id="nossoNumero" label="Nosso Número" v-model="tituloSelecionado.nossoNumero" disabled classContainer="col-12 md:col-2" />
                                <UWInput id="dataMovimento" label="Data Movimento" v-model="tituloSelecionado.dataMovimento" disabled classContainer="col-12 md:col-2" />
                                <UWInput id="filial" label="Filial" v-model="tituloSelecionado.empresaFilialNome" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="departamento" label="Departamento" v-model="tituloSelecionado.departamentoNome" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="parceiro" label="Parceiro" v-model="getIdentificacaoParceiro" disabled classContainer="col-12 md:col-4" />
                                <UWInput id="caracteristicaMovimento" v-model="tituloSelecionado.caracteristicaMovimentoFinanceiroNome" label="Característica do Movimento" disabled classContainer="col-12 md:col-2" />
                                <UWInput id="grupoFinanceiro" label="Grupo Financeiro" v-model="tituloSelecionado.grupoFinanceiroNome" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="fatoGerador" label="Fato Gerador" v-model="tituloSelecionado.fatoGeradorNome" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="historicoPadrao" label="Histórico Padrão" v-model="tituloSelecionado.historicoPadraoNome" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="documento" label="Documento" v-model="tituloSelecionado.documento" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="dataDocumento" label="Data do Documento" v-model="tituloSelecionado.dataDocumento" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="complemento" label="Complemento" v-model="tituloSelecionado.complemento" disabled classContainer="col-12 md:col-3" />
                                <UWInput id="valorTitulo" label="Valor do Título" v-model="getValorTitulo" disabled classContainer="col-12 md:col-2" />
                                <UWInput id="observacao" label="Observação" v-model="tituloSelecionado.observacao" disabled classContainer="col-12 md:col-10" />
                            </div>
                        </div>
                    </UWFieldSet>
                </div>
                <TabView class="col-12">
                    <TabPanel header="Parcelas e Movimentações">
                        <div class="grid nested-grid">
                            <div class="col-12 md:col-3">
                                <UWFieldSet title="Parcelas">
                                    <DataTable v-model:selection="parcelaSelecionada" :value="tituloSelecionado.parcelas" scrollable scrollHeight="250px" selectionMode="single" dataKey="id" showGridlines size="small" stripedRows>
                                        <template #empty> Sem parcelas para exibir. </template>
                                        <Column field="numParcela" header="Num." sortable headerClass="columnHeaderItem" />
                                        <Column field="seqParcela" header="Seq." headerClass="columnHeaderItem" />
                                        <Column field="dataVencimento" header="Vencimento" headerClass="columnHeaderItem">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataVencimento) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="valorParcela" header="Valor" headerClass="columnHeaderItem">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorParcela) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="saldoParcela" header="Saldo"  headerClass="columnHeaderItem">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoParcela) }}</div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </UWFieldSet>
                            </div>
                            <div class="col-12 md:col-9">
                                <UWFieldSet title="Movimentações">
                                    <DataTable :value="getMovimentos" scrollHeight="250px" dataKey="id" showGridlines size="small" stripedRows>
                                        <Column field="seqMvto" header="Seq." headerClass="columnHeaderItem" headerStyle="width: 3%" />
                                        <Column field="subSeqMvto" header="Sub." headerClass="columnHeaderItem" headerStyle="width: 3%"/>
                                        <Column field="dataMovimento" header="Data Mov." headerClass="columnHeaderItem" headerStyle="width: 10%">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatToDDMMYYYY(slotProps.data.dataMovimento) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="departamentoSigla" header="Depto" headerClass="columnHeaderItem" headerStyle="width: 10%"/>
                                        <Column field="tipoOperacaoFinanceiraSigla" header="Tipo Op." headerClass="columnHeaderItem" headerStyle="width: 10%"/>
                                        <Column field="operacaoAcessoriaFinanceiraId" header="Op.Ac" headerClass="columnHeaderItem" headerStyle="width: 3%"/>
                                        <Column field="grupoFinanceiroSigla" header="Grupo Fin." headerClass="columnHeaderItem" headerStyle="width: 10%"/>
                                        <Column field="carteiraFinanceiraSigla" header="Carteira" headerClass="columnHeaderItem" headerStyle="width: 10%"/>
                                        <Column field="valorMovimento" header="Valor Mov." headerClass="columnHeaderItem" headerStyle="width: 12%">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.valorMovimento) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="saldoParcela" header="Saldo" headerClass="columnHeaderItem" headerStyle="width: 12%">
                                            <template #body="slotProps">
                                                <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.saldoParcela) }}</div>
                                            </template>
                                        </Column>
                                        <Column field="responsavel" header="Responsável" headerClass="columnHeaderItem" headerStyle="width: 5%"/>
                                    </DataTable>
                                </UWFieldSet>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        </UWForm>
    </UWPageBase>
</template>

<style>
.columnHeaderItem .p-column-title {
    text-align: center;
    width: 100%;
}
</style>
