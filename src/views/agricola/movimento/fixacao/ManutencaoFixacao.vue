<script setup>
import { ref, nextTick, computed } from 'vue';
import Stepper from 'primevue/stepper';
import StepperPanel from 'primevue/stepperpanel';
import * as yup from 'yup';
import { useContexto } from '@/stores';
import { useRouter } from 'vue-router';
import { FixacaoAgricolaService, DepartamentoService, GrupoOperacaoAgricolaService, TipoPrecoAgricolaService, ContratoAgricolaService } from '@/service';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';

import UWSeletorItemAgricola from '@/components/seletores/item/UWSeletorItemAgricola.vue';
import UWSeletorOIAgricola from '@/components/seletores/operacaoInterna/UWSeletorOIAgricola.vue';

const createSchema = () => {
    return yup.object().shape({
        departamentoId: yup.number().required('Departamento é obrigatório.'),
        parceiroLocalId: formDataPesquisa.value.informaCadastro ? yup.number().required('Parceiro é obrigatório.') : yup.number().nullable(),
        itemId: yup.number().required('Produto é obrigatório.'),
        operacaoInternaFixacaoId: yup.number().required('Operação Interna da Fixação é obrigatório.'),
        grupoOperacaoAgricolaId: yup.number().required('Grupo de Operação é obrigatório.'),
        tipoPrecoAgricolaId: yup.number().required('Tipo de Preço Agrícola é obrigatório.'),
        dataDocumento: yup.date().required('Data do Romaneio é obrigatório'),
        dataVencimento: yup.date().required('Data Vencimento é obrigatório')
            .min(yup.ref('dataDocumento'), 'Data Vencimento deve ser maior que Data do Romaneio'),
        contratoAgricolaId: modoTela.value === 'contrato' && contratos.value && contratos.value.length > 0 ? yup.number().required('Contrato agrícola deve ser selecionado') : yup.number().nullable()
    });
};

const createSchemaBaixa = () => {
    return yup.object().shape({
    });
};

const formDataPesquisa = ref({
    departamentoId: undefined,
    informaCadastro: true,
    parceiroLocalId: undefined,
    contratoAgricolaId: undefined
});

const formDataBaixa = ref({

});

const router = useRouter();
const contextoStore = useContexto();
const { formatDate, formatToDDMMYYYY } = useFormatDate();
const { formatNumber } = useFormatNumber();

const formBaixaRomaneio = ref(null);
const modoTela = ref('pesquisa');
const parceiroLocalSelecionado = ref(null);
const contratos = ref([]);
const contratoAgricolaSelecionado = ref([]);
const activeStep = ref(0);

const handleCancelar = () => {
    router.push({ path: '/agricola/movimento/fixacao' });
};

const handlePesquisar = async (nextCallback) => {
    if (await formBaixaRomaneio.value.validateForm()) {
        if (formBaixaRomaneio.value.isValid()) {
            if (!disabledContrato.value && modoTela.value === 'pesquisa') 
                modoTela.value = 'contrato';
            else
                modoTela.value = 'baixa';

            nextTick(() => {
                if (modoTela.value === 'contrato') {
                    pesquisarRomaneios().then(() => {
                        nextCallback();
                    });
                } else {
                    pesquisarRomaneios();
                }
                
            });                
        }
    }
};

const handleContratoAgricola = async (nextCallback) => {
    if (await formBaixaRomaneio.value.validateForm()) {
        if (formBaixaRomaneio.value.isValid()) {
            modoTela.value = 'contrato';
            nextCallback();
        }
    }
};

const handleNovaPesquisa = () => {
    modoTela.value = 'pesquisa';
    activeStep.value = 0;
    contratos.value = [];
    formDataPesquisa.value = {
        departamentoId: undefined,
        informaCadastro: true,
        parceiroLocalId: undefined,
        itemId: undefined,
        operacaoInternaFixacaoId: undefined,
        grupoOperacaoAgricolaId: undefined,
        tipoPrecoAgricolaId: undefined,
        dataDocumento: null,
        dataVencimento: null,
        contratoAgricolaId: undefined
    };
    contratoAgricolaSelecionado.value = undefined
};


const changeParceiroLocal = (objeto) => {
    if (objeto) {
        parceiroLocalSelecionado.value = objeto;
        buscarContratos();
    } else {
        parceiroLocalSelecionado.value = undefined;
        contratos.value = [];
    }
};

const buscarContratos = async () => {
    const parceiroId = parceiroLocalSelecionado.value ? parceiroLocalSelecionado.value.parceiroId : 0;
    const itemId = formDataPesquisa.value.itemId || 0;
    await ContratoAgricolaService.buscarParaSelecaoFixacao(parceiroId, itemId).then((data) => {
        contratos.value = data;
    });
};

const disabledContrato = computed(() => {
    return !contratos.value || contratos.value.length === 0;
});

const onRowSelectContrato = (event) => {
    if (event.data) {
        formDataPesquisa.value.contratoAgricolaId = event.data.contratoId;
    }
};

const onRowUnselectContrato = () => {
    formDataPesquisa.value.contratoAgricolaId = undefined;
};


const pesquisarRomaneios = () => {
    const payload = {...formDataPesquisa.value, 
        dataDocumento: formatDate(formDataPesquisa.value.dataDocumento, 'yyyy-MM-dd'), 
        dataVencimento: formatDate(formDataPesquisa.value.dataVencimento, 'yyyy-MM-dd')
    };
    FixacaoAgricolaService.pesquisarRomaneios(payload).then((data) => {
        formDataBaixa.value = data;
    });
}
</script>

<template>
    <UWPageBase title="Baixa de Romaneio" subtitle="Realizar a baixa de romaneio agrícola">
        <Stepper orientation="vertical" :activeStep="activeStep">
            <StepperPanel header="Seleção de Romaneios" disabled>
                <template #content="{ nextCallback }">
                    <UWForm :schema="createSchema()" :values="formDataPesquisa" ref="formBaixaRomaneio" :visibleButtons="false">
                        <template #errors="{ errors }">
                            <div class="grid nested-grid">
                                <div class="col-12">
                                    <UWFieldSet title="Filtro para seleção" class="col-12">
                                        <div class="p-fluid formgrid grid">
                                            <UWSeletor
                                                id="departamento"
                                                classContainer="col-12 md:col-3"
                                                v-model="formDataPesquisa.departamentoId"
                                                optionLabel="nome"
                                                optionValue="id"
                                                required
                                                :disabled = "modoTela === 'baixa'"
                                                label="Departamento"
                                                :service="DepartamentoService"
                                                placeholder="Selecione o departamento"
                                                :erros="errors.value?.departamentoId"
                                                :columnsFilters="[{ field: 'empresaFilial', value: contextoStore.contexto.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                            />
                                            <UWToggleButton
                                                id="informaCadastro"
                                                classContainer="col-12 md:col-2"
                                                v-model="formDataPesquisa.informaCadastro"
                                                disabled
                                                onLabel="Informa cadastro"
                                                offLabel="Não informa cadastro"
                                                onIcon="pi pi-thumbs-up"
                                                offIcon="pi pi-thumbs-down"
                                            />
                                            <UWParceiroLocal
                                                id="parceiroLocal"
                                                ref="seletorParceiroLocal"
                                                classContainer="col-12 md:col-4"
                                                v-model="formDataPesquisa.parceiroLocalId"
                                                :disabled="!formDataPesquisa.informaCadastro || modoTela === 'baixa'"
                                                :required="formDataPesquisa.informaCadastro"
                                                label="Parceiro"
                                                :erros="errors.value?.parceiroLocalId"
                                                @changeObject="changeParceiroLocal"
                                            />
                                            <UWSeletorItemAgricola
                                                classContainer="col-12 md:col-3"
                                                ref="seletorProduto"
                                                label="Produto"
                                                v-model="formDataPesquisa.itemId"
                                                required
                                                :disabled = "modoTela === 'baixa'"
                                                optionLabel="nome"
                                                optionValue="id"
                                                placeholder="Selecione o item"
                                                :erros="errors.value?.itemId"
                                            />
                                            <UWSeletorOIAgricola
                                                label="Operação Interna de Baixa"
                                                ref="seletorOperacaoInterna"
                                                classContainer="col-12 md:col-3"
                                                v-model="formDataPesquisa.operacaoInternaFixacaoId"
                                                optionLabel="nome"
                                                optionValue="id"
                                                required
                                                :disabled = "modoTela === 'baixa'"
                                                placeholder="Selecione a operação interna"
                                                :erros="errors.value?.operacaoInternaFixacaoId"
                                            />
                                            <UWSeletor
                                                label="Grupo de Operação"
                                                classContainer="col-12 md:col-3"
                                                v-model="formDataPesquisa.grupoOperacaoAgricolaId"
                                                optionLabel="nome"
                                                optionValue="id"
                                                required
                                                :disabled = "modoTela === 'baixa'"
                                                :service="GrupoOperacaoAgricolaService"
                                                placeholder="Selecione o grupo de operação"
                                                :erros="errors.value?.grupoOperacaoAgricolaId"
                                            />
                                            <UWSeletor
                                                label="Tipo de Preço "
                                                classContainer="col-12 md:col-2"
                                                v-model="formDataPesquisa.tipoPrecoAgricolaId"
                                                optionLabel="nome"
                                                optionValue="id"
                                                required
                                                :disabled = "modoTela === 'baixa'"
                                                :service="TipoPrecoAgricolaService"
                                                placeholder="Selecione o tipo de preço"
                                                :erros="errors.value?.tipoPrecoAgricolaId"
                                            />
                                            <UWCalendar id="dataDocumento" label="Data da Baixa" dateFormat="dd/mm/yy" required :disabled = "modoTela === 'baixa'" v-model="formDataPesquisa.dataDocumento" :errors="errors.value?.dataDocumento" classContainer="col-12 md:col-2" />
                                            <UWCalendar id="dataVencimento" label="Data Vencimento" dateFormat="dd/mm/yy" required :disabled = "modoTela === 'baixa'" v-model="formDataPesquisa.dataVencimento" :errors="errors.value?.dataVencimento" classContainer="col-12 md:col-2" />
                                        </div>
                                    </UWFieldSet>
                                </div>
                            </div>
                            <div class="flex pt-4 justify-content-end">
                                <Button classContainer="col-12 md:col-1" severity="danger" outlined label="Cancelar" icon="pi pi-times"  @click="handleCancelar()"/>
                                <Button v-if="modoTela === 'pesquisa' && disabledContrato" classContainer="col-12 md:col-1" severity="success" label="Pesquisar" icon="pi pi-search" style="margin-left: 6px" @click="handlePesquisar(nextCallback)"/>
                                <Button v-if="modoTela === 'pesquisa' && !disabledContrato" classContainer="col-12 md:col-1" severity="success" label="Selecionar Contrato" icon="pi pi-chevron-right" style="margin-left: 6px" @click="handleContratoAgricola(nextCallback)"/>
                                <Button v-if="modoTela !== 'pesquisa'" classContainer="col-12 md:col-1" severity="help" label="Nova Pesquisa" icon="pi pi-refresh" style="margin-left: 6px" @click="handleNovaPesquisa()"/>
                            </div>
                        </template>
                    </UWForm>
                </template>
            </StepperPanel>
            <StepperPanel v-if="modoTela === 'contrato'" header="Contrato Agrícola" disabled>
                <template #content="{ nextCallback }">
                    <UWFieldSet title="Contratos em aberto" class="col-12">
                        <UWForm :schema="createSchema()" :values="formDataPesquisa" ref="formBaixaRomaneio" :visibleButtons="false">
                            <template #errors="{ errors }">
                                <Message class="col-12 p-0 m-0" :closable="false" severity="warn" v-if="errors?.value?.contratoAgricolaId">Atenção! Deve ser selecionado um contrato agrícola.</Message>
                                <DataTable v-model:selection="contratoAgricolaSelecionado" :value="contratos" selectionMode="single" dataKey="contratoId" 
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
                                <div class="flex pt-4 justify-content-end">
                                    <Button classContainer="col-12 md:col-1" severity="danger" outlined label="Cancelar" icon="pi pi-times"  @click="handleCancelar()"/>
                                    <Button v-if="modoTela === 'contrato'" classContainer="col-12 md:col-1" severity="success" label="Pesquisar" icon="pi pi-search" style="margin-left: 6px" @click="handlePesquisar(nextCallback)"/>
                                </div>
                                <code>Erros: {{  errors }}</code>
                                <code>Form: {{ formDataPesquisa}}</code>
                            </template>
                        </UWForm>
                    </UWFieldSet>
                </template>
            </StepperPanel>
            <StepperPanel v-if="modoTela === 'baixa'" header="Baixa de Romaneios" disabled>
                <template #content="{ nextCallback }">
                    <UWFieldSet title="Classificação p/ composição de preço" class="col-12">
                        <div class="p-fluid formgrid grid">
                            <UWInput id="itemClassificacaoAgricola1" label="Classificação 1" disabled classContainer="col-12 md:col-3" />
                            <UWInput id="itemClassificacaoAgricola2" label="Classificação 2" disabled classContainer="col-12 md:col-3" />
                            <UWInput id="itemClassificacaoAgricola3" label="Classificação 3" disabled classContainer="col-12 md:col-3" />
                            <UWInput id="itemClassificacaoAgricola4" label="Classificação 4" disabled classContainer="col-12 md:col-3" />
                        </div>
                    </UWFieldSet>
                    <div>
                        <TabView>
                            <TabPanel header="Romaneios para baixa">
                                <UWForm :schema="createSchemaBaixa()" :values="formDataBaixa" ref="formBaixaRomaneio" :visibleButtons="false">
                                    <template #errors="{ errors }">
                                        <div class="grid nested-grid">
                                            <div class="col-12">

                                            </div>
                                        </div>
                                        <div class="flex pt-4 justify-content-end">
                                            <Button v-if="modoTela === 'baixa'" classContainer="col-12 md:col-1" severity="danger" outlined label="Cancelar" icon="pi pi-times"  @click="handleCancelar()"/>
                                        </div>
                                    </template>
                                </UWForm>
                            </TabPanel>
                            <TabPanel header="Romaneios com problemas" style="color: red">
                                <div class="grid nested-grid">
                                    <div class="col-12">

                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </template>
            </StepperPanel>
        </Stepper>
    </UWPageBase>
</template>
