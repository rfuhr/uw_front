<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NFeService } from '@/service';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';
import { useConfirm } from 'primevue/useconfirm';
import XmlViewer from 'vue3-xml-viewer';

const router = useRouter();
const contextoStore = useContexto();
const { formatToDDMMYYYYHHMMSS } = useFormatDate();
const listagem = ref([]);
const tooltipVisible = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });
const nfeIdSelecionada = ref(0);
const confirm = useConfirm();
const filters = ref();
const visualizacao = ref(false);
const visibleDialog = ref(false);
const comunicacoesSEFAZ = ref([]);
const nfeSelecionada = ref({});
const comunicacaoSelecionada = ref({});
const blocked = ref(false); 

const { formatNumber } = useFormatNumber();

const showTooltip = (event, nfeId) => {
    tooltipPosition.value = {
        x: event.target.offsetLeft + event.target.offsetWidth / 2,
        y: event.target.offsetTop - 30, // Ajusta a posição acima do botão
    };
    tooltipVisible.value = true;
    nfeIdSelecionada.value = nfeId;
};

const hideTooltip = () => {
    tooltipVisible.value = false;
    nfeIdSelecionada.value = 0;
}

const novaNFe = () => {
    router.push({ name: 'fis-nfe-nova' });
};

const buscarListagem = async () => {
    NFeService.getListaNFe(contextoStore.contexto.empresaFilialId).then((response) => {
        listagem.value = response;
    });
};

onMounted(() => {
    buscarListagem();
});

const getBadgeSeverity = (status) => {
    switch (status.toLowerCase()) {
        case 'em digitação':
            return 'contrast';
        case 'rejeitado':
            return 'warning';
        case 'autorizado':
            return 'success';
        case 'cancelado':
            return 'danger';
        default:
            return 'info';
    }
};

const getBadgeSeverityIntegracao = (integracao) => {
    switch (integracao.toLowerCase()) {
        case 'sem integração':
            return 'contrast';
        case 'integrados':
            return 'success';
        default:
            return 'warning';
    }
};

const getBadgeSeverityTipoNfe = (tipo) => {
    switch (tipo.toLowerCase()) {
        case 'terceiro':
            return 'contrast';
        case 'própria':
            return 'success';
        default:
            return 'warning';
    }
};

const openEdit = (selectId, situacao) => {
    if (situacao == 'Em Digitação' || situacao == 'Pendente' || situacao == 'Aguardando Envio' || situacao == 'Rejeitado') {
        visualizacao.value = false;
    } else {
        visualizacao.value = true;    
    }
    router.push({name: 'fis-nfe-editar', params: {
        id: selectId,
        visualizacao: visualizacao.value
    }})
};

const integrarNFe = (event, selectId) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja realizar as integrações Pendentes?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Integrar',
        accept: () => {
            blocked.value = true;
            NFeService.integrarNFe(selectId).then((response) => {
                buscarListagem();
                blocked.value = false;
            }).catch(() => {
                buscarListagem();
                blocked.value = false;
            }); 
        },
        reject: () => {}
    });         
}

const inutilizarNFe = (event, selectId) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja enviar a Inutilização do Número para o SEFAZ?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Inutilizar',
        accept: () => {
            blocked.value = true;
            NFeService.inutilizarNFe(selectId).then((response) => {
                buscarListagem();
                blocked.value = false;
            }).catch(() => {
                buscarListagem();
                blocked.value = false;
            });
        },
        reject: () => {}
    });     
}

const cancelarNFe = (event, selectId) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja cancelar a NFe?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Fechar',
        acceptLabel: 'Cancelar',
        accept: () => {
            blocked.value = true;
            NFeService.cancelarNFe(selectId).then((response) => {
                buscarListagem();
                blocked.value = false;
            }).catch(() => {
                buscarListagem();
                blocked.value = false;
            });   
        },
        reject: () => {blocked.value = false;}
    });    
}

const desabilitaIntegrar = (slotProps) => {
    if (slotProps.data.situacao != 'Autorizado' && slotProps.data.situacao != 'Cancelado') {
        return true;
    } else if (slotProps.data.situacaoIntegracao != 'Integrados' && slotProps.data.situacaoIntegracao != 'Sem Integração') {
        return false;
    } else {
        return true;
    }
}

const enviarNFe = (event, selectId) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja enviar NFe para o SEFAZ?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Enviar',
        accept: () => {
            blocked.value = true;
            NFeService.enviarNFe(selectId).then((response) => {
                buscarListagem();
                if (response.data.size > 0) {
                    const disposition = response.headers['content-disposition'];
                    const fileNameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
                    const matches = fileNameRegex.exec(disposition);
                    const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'Nfe.pdf';

                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();        
                }
                blocked.value = false;
            }).catch(() => {
                buscarListagem();
                blocked.value = false;
            });
        },
        reject: () => {}
    });
};

const consultarStatusSEFAZ = async () => {
    if (nfeSelecionada.value.nfeId && nfeSelecionada.value.nfeId != 'undefined') {
        blocked.value = true;
        NFeService.consultarStatusNFe(nfeSelecionada.value.nfeId).then((response) => {
            nfeSelecionada.value.situacao = response;
            nFeComunicacoesSEFAZ(nfeSelecionada.value);
            blocked.value = false;
        }).catch(() => {
            blocked.value = false;
        });
    }
} 

const nFeComunicacoesSEFAZ = async (data) => {
    if (data) {
        blocked.value = true;
        nfeSelecionada.value = data;
        NFeService.getNFeComunicacaoSEFAZ(data.nfeId).then((response) => {
            comunicacoesSEFAZ.value = response;
            if (response.length > 0) {
                comunicacaoSelecionada.value = response[0];
            }
            visibleDialog.value = true;
            blocked.value = false;
        }).catch(() => {
            blocked.value = false;
        });
    }
}

const handleVoltar = async () => {
    nfeSelecionada.value = {};
    comunicacaoSelecionada.value = {};
    comunicacoesSEFAZ.value = [];
    visibleDialog.value = false;
};

const onRowSelect = (event) => {
    comunicacaoSelecionada.value = event.data;
};

</script>

<style>
.tooltip {
  position: absolute;
  padding: 5px 10px;
  background-color: #333;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  transform: translateX(-50%);
  z-index: 1000;
}
.json-container {
  max-height: 170px; 
  width: 1400px;
  overflow-y: auto; 
  overflow-x: auto; 
}
</style>

<template>
    <BlockUI :blocked="blocked" fullScreen />
    <ConfirmPopup></ConfirmPopup>
    <UWPageBase title="Gerenciador de NFe">
        <DataTable
            ref="tableCrud"
            id="tableNFe"
            size="small"
            class="p-datatable-sm"
            :value="listagem"
            dataKey="id"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} notas"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 align-items-center justify-content-end">
                    <Button type="button" icon="pi pi-user-plus" label="Iniciar NFe" class="w-full sm:w-auto flex-order-0 sm:flex-order-1" outlined @click="novaNFe" />
                </div>
            </template>
            <Column field="dataHoraEmissao" header="Data / Hora Emissão" :sortable="true" headerStyle="width:7%;">
                <template #body="slotProps">
                    <span class="p-column-title">Data / Hora Emissão</span>
                    {{ formatToDDMMYYYYHHMMSS(slotProps.data.dataHoraEmissao) }}
                </template>
            </Column>
            <Column field="tipoNfe" header="Tipo" :sortable="true" headerStyle="width:3%;">
                <template #body="slotProps">
                    <span class="p-column-title">Situação</span>
                    <Tag :severity="getBadgeSeverityTipoNfe(slotProps.data.tipoNfe)">{{ slotProps.data.tipoNfe }}</Tag>
                </template>
            </Column>            
            <Column field="serie" header="Série" :sortable="true" headerStyle="width:2%;">
                <template #body="slotProps">
                    <span class="p-column-title">Série</span>
                    <div class="text-right">{{ slotProps.data.serie }}</div>
                </template>
            </Column>
            <Column field="numero" header="Número" :sortable="true" headerStyle="width:3%;">
                <template #body="slotProps">
                    <span class="p-column-title">Número</span>
                    <div class="text-right">{{ slotProps.data.numero }}</div>
                </template>
            </Column>
            <Column field="siglaOperacaoInterna" header="Sigla Oper.Int." :sortable="true" headerStyle="width:6%;">
                <template #body="slotProps">
                    <span class="p-column-title">Sigla Oper.Int.</span>
                    {{ slotProps.data.siglaOperacaoInterna }}
                </template>
            </Column>
            <!-- <Column field="cpfCnpj" header="CPF/CNPJ" :sortable="true" headerStyle="width:8%;">
                <template #body="slotProps">
                    <span class="p-column-title">CPF/CNPJ</span>
                    {{ slotProps.data.cpfCnpj }}
                </template>
            </Column> -->
            <Column field="nome" header="Nome/Razão Social" :sortable="true" headerStyle="width:17%;">
                <template #body="slotProps">
                    <span class="p-column-title">Nome/Razão Social</span>
                    {{ slotProps.data.nome }}
                </template>
            </Column>
            <Column field="vnf" header="Valor" :sortable="true" headerStyle="width:5%;">
                <template #body="slotProps">
                    <span class="p-column-title">Valor</span>
                    <div class="w-full text-right pr-2">{{ formatNumber(slotProps.data.vnf, 2) }}</div>
                </template>
            </Column>            
            <Column field="situacao" header="Situação" :sortable="true" headerStyle="width:6%;">
                <template #body="slotProps">
                    <span class="p-column-title">Situação</span>
                    <Tag :severity="getBadgeSeverity(slotProps.data.situacao)">{{ slotProps.data.situacao }}</Tag>
                </template>
            </Column>
            <Column field="situacaoIntegracao" header="Integrações" :sortable="true" headerStyle="width:7%;">
                <template #body="slotProps">
                    <span class="p-column-title">Integrações</span>
                    <Tag :severity="getBadgeSeverityIntegracao(slotProps.data.situacaoIntegracao)">{{ slotProps.data.situacaoIntegracao }}</Tag>
                </template>
            </Column>

            <Column style="width: 10%">
                <template #body="slotProps">
                    <Button title="Editar/Visualizar" :disabled="slotProps.data.situacao == 'Inutilizado'"  icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="openEdit(slotProps.data.nfeId, slotProps.data.situacao)" />
                    <Button title="Enviar NFe para o SEFAZ" icon="pi pi-send" :disabled="slotProps.data.situacao != 'Aguardando Envio'" class="p-button-success p-button-sm mr-2" @click="enviarNFe($event, slotProps.data.nfeId)" />
                    <Button title="Integrar" icon="pi pi-sync" :disabled="desabilitaIntegrar(slotProps)" class="p-button-success p-button-sm mr-2" @click="integrarNFe($event, slotProps.data.nfeId)" />
                    <Button title="Inutilizar numeração no SEFAZ" icon="pi pi-thumbs-down" :disabled="slotProps.data.situacao == 'Autorizado' || slotProps.data.situacao == 'Cancelado' || slotProps.data.situacao == 'Inutilizado' || slotProps.data.situacao == 'Rejeitado' || slotProps.data.situacao == 'Denegado'" class="p-button-success p-button-sm mr-2" @click="inutilizarNFe($event, slotProps.data.nfeId)" />
                    <Button title="Cancelar NFe" icon="pi pi-times-circle" :disabled="slotProps.data.situacao != 'Autorizado'" class="p-button-danger p-button-sm mr-2" @click="cancelarNFe($event, slotProps.data.nfeId)" />
                    <Button title="Comunicações SEFAZ" icon="pi pi-list" :disabled="slotProps.data.situacao == 'Aguardando Envio' || slotProps.data.situacao == 'Em Digitação'" class="p-button-success p-button-sm mr-2" @click="nFeComunicacoesSEFAZ(slotProps.data)" />
                </template>
            </Column>
        </DataTable>
        <Dialog v-model:visible="visibleDialog" :style="{ width: '90%' }" header="Comunicação com o SEFAZ" :modal="true" :closable="false">
            <div class="grid nested-grid">
                <div class="col-4">
                    <UWFieldSet title="Identificação da NFe" class="h-full flex flex-column justify-content-start bg-primary-50 border-solid">
                        <div class="formgrid grid">
                            <UWCalendar id="dateHoraEmissao" label="Data de Emissão" v-model="nfeSelecionada.dataHoraEmissao" dateFormat="dd/mm/yy" :showTime="true" :disabled="true" classContainer="col-12 md:col-6" />
                            <UWInput id="situacao" label="Situação" v-model="nfeSelecionada.situacao" :disabled="true" classContainer="col-12 md:col-6" />
                            <UWInput id="chaveNFe" label="Chave NFe" v-model="nfeSelecionada.chaveNFe" :disabled="true" classContainer="col-12 md:col-12" />
                            <UWInput id="numero" label="Número" v-model="nfeSelecionada.numero" :disabled="true" classContainer="col-12 md:col-6" />
                            <UWInput id="serie" label="Série" v-model="nfeSelecionada.serie" :disabled="true" classContainer="col-12 md:col-6" />
                            <UWInput id="cpfCnpj" label="CNPJ/CPF" v-model="nfeSelecionada.cpfCnpj" :disabled="true" classContainer="col-12 md:col-4" />
                            <UWInput id="nome" label="Razão Social/Nome" v-model="nfeSelecionada.nome" :disabled="true" classContainer="col-12 md:col-8" />
                            <UWInput id="sigla" label="Sigla Oper. Interna" v-model="nfeSelecionada.siglaOperacaoInterna" :disabled="true" classContainer="col-12 md:col-6" />
                            <UWCurrency id="valor" label="Valor Nota" v-model="nfeSelecionada.vnf" :disabled="true" classContainer="col-12 md:col-6" />
                        </div>
                    </UWFieldSet>
                </div>
                <div class="col-8">
                    <UWFieldSet title="Comunicações com o SEFAZ" class="h-full flex flex-column justify-content-start bg-primary-50 border-solid">
                        <Toolbar>
                            <template v-slot:start>
                                <div class="flex justify-content-end flex-wrap gap-2">
                                    <Button label="Consultar STATUS da NFe no SEFAZ" icon="pi pi-sync" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="consultarStatusSEFAZ()" />
                                    <Button label="Criar Carta de Correção" disabled icon="pi pi-file-edit" class="p-button-warning p-button-outlined mb-0 p-button-sm" @click="criarCartaCorrecao()" />
                                </div>
                            </template>
                        </Toolbar>                        
                        <DataTable
                                id="tableComunicacaoSEFAZ"
                                ref="dtComunicacaoSEFAZ"
                                :value="comunicacoesSEFAZ"
                                responsiveLayout="scroll"
                                size="small"
                                stripedRows
                                showGridlines
                                selectionMode="single"
                                dataKey="id"
                                v-model:selection="comunicacaoSelecionada"
                                @rowSelect="onRowSelect"
                                :paginator="true"
                                :rows="5"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                :rowsPerPageOptions="[5, 10, 25]"
                                currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} comunicações"                                
                            >
                                <template #empty> Nenhuma comunicação. </template>
                                <Column field="criadoEm" header="Data / Hora" :sortable="true" headerStyle="width:7%;">
                                    <template #body="slotProps">
                                        <span class="p-column-title">Data / Hora</span>
                                        {{ formatToDDMMYYYYHHMMSS(slotProps.data.criadoEm) }}
                                    </template>
                                </Column>                                
                                <Column field="tipoComunicacaoNfeName" header="Tipo" style="width: 7%; text-align: left" headerClass="columnHeaderItem"> </Column>
                                <Column field="cstat" header="Código Retorno" style="width: 7%; text-align: left" headerClass="columnHeaderItem"> </Column>                                
                                <Column field="xmotivo" header="Observações" style="width: 30%; text-align: left" headerClass="columnHeaderItem"> </Column>                                
                        </DataTable>
                    </UWFieldSet>
                </div>
                <div class="col-12">
                    <UWFieldSet title="Detalhes dos XMLs" class="h-full flex flex-column justify-content-start bg-primary-50 border-solid">
                        <TabView class="col-12">
                            <TabPanel header="XML de Envio" class="col-12">
                                <XmlViewer :xml="comunicacaoSelecionada.xmlEnvio" class="json-container"/>
                            </TabPanel>
                            <TabPanel header="XML de Retorno" class="col-12">
                                <XmlViewer :xml="comunicacaoSelecionada.xmlRetorno" class="json-container"/>
                            </TabPanel>
                        </TabView>
                    </UWFieldSet>
                </div>
            </div>
            <div class="col-12 mt-0 pt-0 pb-0">
                <Divider />
                <div class="flex justify-content-end flex-wrap gap-2">
                    <Button label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                </div>
            </div>
        </Dialog>
    </UWPageBase>
</template>
