<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import { UfService, TiposService } from '@/service';
import { useFormatDate } from '@/composables/useFormatDate';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const { formatToMMYYYY } = useFormatDate();

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);
const toast = useToast();
const confirm = useConfirm();
const visibleDialog = ref(false);
const modeDialog = ref('');

const documentosModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const documentoSelecionado = ref();
const documentoReferenciado = ref({
    tipoDocumentoReferenciadoNome: undefined,
    ufEmitenteSigla: undefined
});
const indexSelecionado = ref();

const tiposDocumentoReferenciados = ref([]);
const modelosNota1e2 = ref([
    { value: '01', name: 'Modelo 01' },
    { value: '02', name: 'Modelo 02' }
]);
const modelosNotaProdutor = ref([
    { value: '04', name: 'NF de Produtor' },
    { value: '01', name: 'NF' }
]);
const modelosCupomFiscal = ref([
    { value: '2B', name: 'Cupom Fiscal emitido por máquina registradora (não ECF)' },
    { value: '2C', name: 'Cupom Fiscal PDV' },
    { value: '2D', name: 'Cupom Fiscal (emitido por ECF)' }
]);

const adicionarDocumento = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    documentoReferenciado.value = { idLine: idLine };
    const idx = documentosModelValue.value.length;
    documentosModelValue.value.push(documentoReferenciado.value);
    documentoSelecionado.value = documentoReferenciado.value;
    indexSelecionado.value = idx;
    visibleDialog.value = true;
    modeDialog.value = 'add'
};

const onRowSelect = (event) => {
    documentoReferenciado.value = event.data;
    indexSelecionado.value = event.index;
};

const onRowUnselect = () => {
    documentoReferenciado.value = {};
    indexSelecionado.value = null;
};

onMounted(async () => {
    TiposService.getTipoDocumentoReferenciado().then((data) => {
        tiposDocumentoReferenciados.value = data;
    });
});

const changeDocumentoReferenciado = (object) => {
    documentoSelecionado.value.tipoDocumentoReferenciadoNome = object.name;
    documentoReferenciado.value.chaveAcesso = null;
    documentoReferenciado.value.ufEmitente = null;
    documentoReferenciado.value.ufEmitenteSigla = null;
    documentoReferenciado.value.anoMes = null;
    documentoReferenciado.value.cnpjEmitente = null;
    documentoReferenciado.value.modeloDocumentoFiscal = null;
    documentoReferenciado.value.modeloDocumentoFiscalName = null;
    documentoReferenciado.value.serie = null;
    documentoReferenciado.value.numero = null;

    if (documentoSelecionado.value.tipoDocumentoReferenciado === '1') documentoReferenciado.value.pedeChave = true;
    else documentoReferenciado.value.pedeChave = false;
};

const changeUFEmitente = (object) => {
    if (object) {
        documentoSelecionado.value.ufEmitenteSigla = object.sigla;
    } else {
        documentoSelecionado.value.ufEmitenteSigla = null;
    }
};

const changeModeloDocumentoFiscal = (object) => {
    if (object) {
        documentoSelecionado.value.modeloDocumentoFiscalName = object.name;
    } else {
        documentoSelecionado.value.modeloDocumentoFiscalName = null;
    }
};

const handleDelete = (event, data) => {
    documentoSelecionado.value = data;
    documentoReferenciado.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            documentosModelValue.value = documentosModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Documento removido com sucesso', life: 5000 });
            documentoSelecionado.value = null;
            documentoReferenciado.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    documentoReferenciado.value = values.data;
    documentoSelecionado.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
}
const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        documentosModelValue.value = documentosModelValue.value.filter((item) => item !== documentoReferenciado.value);
        documentoSelecionado.value = null;
        documentoReferenciado.value = {};    
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    // const idLine = Math.floor(Math.random() * 100) * -1;
    // documentoReferenciado.value = { idLine: idLine };
    // const idx = documentosModelValue.value.length;
    // documentosModelValue.value.push(documentoReferenciado.value);
    // documentoSelecionado.value = documentoReferenciado.value;
    // indexSelecionado.value = idx;
    visibleDialog.value = false    
}

const temErro = (str) => {
    let caminhoEncontrado = false;
    _.forEach(props.errors.value, (value, key) => {
        // Verifica se o caminho base está contido no caminho atual
        if (_.startsWith(key, str)) {
            caminhoEncontrado = true;
            return false; // Sai do loop forEach assim que encontrar um caminho válido
        }
    });
    return caminhoEncontrado;
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <Toolbar>
                    <template v-slot:start>
                        <div>
                            <Button label="Adicionar Documento" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarDocumento()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    id="tableDocumentosReferenciados"
                    ref="dtDocumentosReferenciados"
                    selectionMode="single"
                    dataKey="idLine"
                    v-model:selection="documentoSelecionado"
                    :value="documentosModelValue"
                    responsiveLayout="scroll"
                    size="small"
                    stripedRows
                    showGridlines
                    @rowSelect="onRowSelect"
                    @rowUnselect="onRowUnselect"
                >
                    <template #empty> Nenhum documento referenciado informado. </template>
                    <Column style="width: 1%; text-align: left">
                        <template #body="slotProps">
                            <i v-if="temErro(`documentosReferenciados[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                            <i v-if="!temErro(`documentosReferenciados[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                        </template>
                    </Column>
                    <Column field="tipoDocumentoReferenciadoNome" header="Tipo do Documento" style="width: 5%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="chaveAcesso" header="Chave de acesso" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="ufEmitenteSigla" header="UF Emitente" style="width: 5%; text-align: left" headerClass="columnHeaderItem"></Column>
                    <Column field="anoMes" header="Ano/Mês" style="width: 5%; text-align: left" headerClass="columnHeaderItem">
                        <template #body="slotProps">
                            {{ formatToMMYYYY(slotProps.data.anoMes) }}
                        </template>
                    </Column>
                    <Column field="cnpjEmitente" header="CNPJ do emitente" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="modeloDocumentoFiscalName" header="Modelo do Documento" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="serie" header="Série" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="numero" header="Número" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="numeroECF" header="Número ECF" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="numeroCOO" header="Número COO" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column header="" style="width: 3%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes do Documento" :modal="true" :closable="false">
        <Divider class="m-0"/>
        <div class="col-12">
            <div class="grid nested-grid">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWPickList
                            id="tipoDocumento"
                            label="Tipo do Documento Referenciado"
                            v-model="documentoReferenciado.tipoDocumentoReferenciado"
                            optionLabel="name"
                            optionValue="value"
                            required
                            :options="tiposDocumentoReferenciados"
                            classContainer="col-12 md:col-6"
                            @changeObject="changeDocumentoReferenciado"
                            :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].tipoDocumentoReferenciado`, null)"
                        />
                        <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '1'">
                            <UWInput
                                id="chaveAcessoNFe"
                                label="Chave de acesso da NF-e / NFC-e referenciada"
                                v-model="documentoReferenciado.chaveAcesso"
                                :maxLength="44"
                                required
                                classContainer="col-12 md:col-6"
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].chaveAcesso`, null)"
                            />
                        </template>
                        <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '2' || documentoReferenciado.tipoDocumentoReferenciado === '3'">
                            <UWSeletor
                                classContainer="col-12 md:col-3"
                                v-model="documentoReferenciado.ufEmitente"
                                optionLabel="nome"
                                optionValue="id"
                                required
                                label="UF"
                                :service="UfService"
                                placeholder="Selecione a uf"
                                @changeObject="changeUFEmitente"
                                :erros="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].ufEmitente`, null)"
                            >
                            </UWSeletor>
                            <UWMonth id="anoMes" label="Ano/Mês" v-model="documentoReferenciado.anoMes" uppercase classContainer="col-12 md:col-3" :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].anoMes`, null)" />
                            <UWInputMask
                                id="cnpj"
                                label="Cnpj"
                                mask="99.999.999/9999-99"
                                required
                                v-model="documentoReferenciado.cnpjEmitente"
                                classContainer="col-12 md:col-4"
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].cnpjEmitente`, null)"
                            />
                            <UWInputMask
                                v-if="documentoReferenciado.tipoDocumentoReferenciado === '3'"
                                id="cpf"
                                label="Cpf"
                                mask="999.999.999-99"
                                required
                                v-model="documentoReferenciado.cpfEmitente"
                                classContainer="col-12 md:col-4"
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].cpfEmitente`, null)"
                            />
                            <UWPickList
                                id="modelo"
                                label="Modelo do Documento Fiscal"
                                v-model="documentoReferenciado.modeloDocumentoFiscal"
                                optionLabel="name"
                                optionValue="value"
                                required
                                :options="documentoReferenciado.tipoDocumentoReferenciado === '2' ? modelosNota1e2 : modelosNotaProdutor"
                                classContainer="col-12 md:col-4"
                                @changeObject="changeModeloDocumentoFiscal"
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].modeloDocumentoFiscal`, null)"
                            />
                            <UWInput id="serie" label="Série" v-model="documentoReferenciado.serie" uppercase classContainer="col-12 md:col-2" :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].serie`, null)" />
                            <UWInteger id="numero" label="Número" v-model="documentoReferenciado.numero" classContainer="col-12 md:col-2" :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].numero`, null)" />
                        </template>
                        <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '4'">
                            <UWPickList
                                id="modelo"
                                label="Modelo do Documento Fiscal"
                                v-model="documentoReferenciado.modeloDocumentoFiscal"
                                optionLabel="name"
                                optionValue="value"
                                required
                                :options="modelosCupomFiscal"
                                classContainer="col-12 md:col-6"
                                @changeObject="changeModeloDocumentoFiscal"
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].modeloDocumentoFiscal`, null)"
                            />
                            <UWInteger
                                id="numeroECF"
                                label="Número do ECF"
                                v-model="documentoReferenciado.numeroECF"
                                classContainer="col-12 md:col-3"
                                :errors="_.get(props.errors.value, `identificacaoNFe.documentosReferenciados[${indexSelecionado}].numeroECF`, null)"
                            />
                            <UWInteger
                                id="numeroCOO"
                                label="Número do COO"
                                v-model="documentoReferenciado.numeroCOO"
                                classContainer="col-12 md:col-3"
                                :errors="_.get(props.errors.value, `identificacaoNFe.documentosReferenciados[${indexSelecionado}].numeroCOO`, null)"
                            />
                        </template>
                        <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '5'">
                            <UWInput
                                id="chaveAcessoNFe"
                                label="Chave de acesso da Ct-e referenciada"
                                v-model="documentoReferenciado.chaveAcesso"
                                uppercase
                                :errors="_.get(props.errors.value, `documentosReferenciados[${indexSelecionado}].chaveAcesso`, null)"
                                classContainer="col-12 md:col-6"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <Divider />
            <div class="flex justify-content-end flex-wrap gap-2">
                <Button label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                <Button type="submit" label="Confirmar" style="color: var(--teal-600)" outlined icon="pi pi-check" @click="handleConfirmar()" />
            </div>
        </div>
    </Dialog>
</template>
