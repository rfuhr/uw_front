<script setup>
import { ref, computed } from 'vue';
import { UfService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const documentosModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const documentoSelecionado = ref();
const documentoReferenciado = ref({});

const tiposDocumentoReferenciados = ref([
    { name: 'NFe / NFC-e', value: '1' },
    { name: 'NF Modelos 1/1A, 2', value: '2' },
    { name: 'NF de Produtor Rural', value: '3' },
    { name: 'Cupom Fiscal Referenciado', value: '4' },
    { name: 'CT-e Referenciado', value: '5' }
]);

const adicionarDocumento = () => {
    documentoReferenciado.value = {seq: documentosModelValue.value.length + 1};
    documentosModelValue.value.push(documentoReferenciado.value);
    documentoSelecionado.value = documentoReferenciado.value;
};

const onRowSelect = (event) => {
    documentoReferenciado.value = event.data;
};

</script>

<template>
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
                <DataTable id="tableDocumentosReferenciados" ref="dtDocumentosReferenciados" selectionMode="single" :metaKeySelection="metaKey" dataKey="seq" v-model:selection="documentoSelecionado" :value="documentosModelValue" responsiveLayout="scroll" size="small" stripedRows showGridlines
                @rowSelect="onRowSelect "
                >
                    <template #empty> Nenhum dccumento referenciado informado. </template>
                    <!-- <Column selectionMode="single" headerStyle="width: 1%"></Column> -->
                    <Column field="tipoDocumentoReferenciado" header="Tipo do Documento" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Chave de acesso" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="UF Emitente" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Ano/Mês" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="CNPJ do emitente" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Modelo do Documento" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Série" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Número" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Número ECF" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column field="chaveNFe" header="Número COO" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                    <Column header="" style="width: 1%">
                        <template #body="slotProps">
                            <!-- <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" /> -->
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <div class="col-12" v-show="!documentosModelValue || documentosModelValue.length > 0">
                <Accordion :activeIndex="0">
                    <AccordionTab>
                        <template #header>
                            <span class="flex align-items-center gap-2 w-full">
                                <i class="fa fa-square-nfi"></i>
                                <span class="font-bold white-space-nowrap">Detalhamento do Item</span>
                            </span>
                        </template>
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
                                        classContainer="col-12 md:col-2"
                                    />
                                    <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '1'">
                                        <UWInput id="chaveAcessoNFe" label="Chave de acesso da NF-e / NFC-e referenciada" uppercase classContainer="col-12 md:col-4" />
                                    </template>
                                     <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '2'">
                                        <UWSeletor classContainer="col-12 md:col-2" v-model="documentoReferenciado.ufId" optionLabel="nome" optionValue="id" required label="UF" :service="UfService" placeholder="Selecione a uf" />
                                        <UWInput id="anoMes" label="Ano/Mês" uppercase classContainer="col-12 md:col-1" />
                                        <UWInput id="cnpjEmitente" label="CNPJ do emitente" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="modeloDocumento" label="Modelo do Documento" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="serie" label="Série" uppercase classContainer="col-12 md:col-1" />
                                        <UWInput id="numero" label="Número" uppercase classContainer="col-12 md:col-1" />
                                    </template>
                                     <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '3'">
                                        <UWSeletor classContainer="col-12 md:col-2" v-model="documentoReferenciado.ufId" optionLabel="nome" optionValue="id" required label="UF" :service="UfService" placeholder="Selecione a uf" />
                                        <UWInput id="anoMes" label="Ano/Mês" uppercase classContainer="col-12 md:col-1" />
                                        <UWInput id="cnpjEmitente" label="CNPJ do emitente" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="cpfEmitente" label="CPF do emitente" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="ieEmitente" label="IE do emitente" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="modeloDocumento" label="Modelo do Documento" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="serie" label="Série" uppercase classContainer="col-12 md:col-1" />
                                        <UWInput id="numero" label="Número" uppercase classContainer="col-12 md:col-1" />
                                    </template>
                                    <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '4'">
                                        <UWInput id="modeloDocumento" label="Modelo do Documento" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="numeroECF" label="Número do ECF" uppercase classContainer="col-12 md:col-2" />
                                        <UWInput id="numeroCOO" label="Número do COO" uppercase classContainer="col-12 md:col-2" />
                                    </template>
                                    <template v-if="documentoReferenciado.tipoDocumentoReferenciado === '5'">
                                        <UWInput id="chaveAcessoNFe" label="Chave de acesso da NF-e / NFC-e referenciada" uppercase classContainer="col-12 md:col-4" />
                                    </template>
                                </div>
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>
        </div>
    </div>

   
</template>
