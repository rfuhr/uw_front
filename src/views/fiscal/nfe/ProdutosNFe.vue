<script setup>
import { ref, computed } from 'vue';
import UWSeletorItem from '@/components/seletores/UWSeletorItem.vue';
import UWSeletorCfop from '@/components/seletores/UWSeletorCfop.vue';
import { UnidadeMedidaService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const itensModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const item = ref({})

const adicionarItem = () => {
    item.value = {}
    itensModelValue.value.push(item.value);
};

const changeProduto = (produto) => {
    if (produto) {
        item.value.codigo = produto.codigo;
        item.value.nome = produto.nome;
        item.value.ncmId  = produto.ncmId;
        item.value.ncmCodigo = produto.ncmCodigo;
    } else {
        item.value.codigo = null;
        item.value.nome = null;
    }
};
</script>

<template>
    <div>
        <div class="grid nested-grid">
            <div class="col-12">
                <UWFieldSet title="Itens da Nota" class="h-full">
                    <Toolbar>
                        <template v-slot:start>
                            <div>
                                <Button label="Adicionar Produto" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarItem()" />
                            </div>
                        </template>
                    </Toolbar>
                    <DataTable id="tableItensNFe" ref="dtItens" :value="itensModelValue" responsiveLayout="scroll" size="small" stripedRows showGridlines>
                        <template #empty> Nenhum item informado. </template>
                        <Column field="codigo" header="Código" style="width: 5%; text-align: left" headerClass="columnHeaderItem"> </Column>
                        <Column field="nome" header="Nome" style="width: 28%; text-align: left" headerClass="columnHeaderItem"> </Column>
                        <Column field="ncmCodigo" header="Ncm" style="width: 7%" headerClass="columnHeaderItem"> </Column>
                        <Column field="cst" header="Cst" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="cfop" header="Cfop" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="unidadeMedida" header="U.M." style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="quantidade" header="Qtde" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorUnitario" header="Valor Unitário" style="width: 5%" headerClass="columnHeaderItem"> </Column>
                        <Column field="percentualDesconto" header="% Desc." style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorDesconto" header="Valor Desc." style="width: 4%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorTotal" header="Valor Total" style="width: 7%" headerClass="columnHeaderItem"> </Column>
                        <Column field="baseCalculoIcms" header="Base Calc. Icms" style="width: 5%" headerClass="columnHeaderItem"> </Column>
                        <Column field="aliquotaIcms" header="Aliq. Icms" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorIcms" header="Valor do Icms" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                        <Column field="aliquotaIpi" header="Aliq. Ipi" style="width: 3%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorIpi" header="Valor do Ipi" style="width: 4%" headerClass="columnHeaderItem"> </Column>
                        <Column field="valorAproxTrib" header="Valor Aprox. Trib." style="width: 5%" headerClass="columnHeaderItem"> </Column>
                        <Column header="" style="width: 6%">
                            <template #body="slotProps">
                                <!-- <Button icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" /> -->
                                <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                            </template>
                        </Column>
                    </DataTable>
                </UWFieldSet>
            </div>

            <div class="col-12" v-show="!itensModelValue || itensModelValue.length > 0">
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
                                <UWFieldSet title="Dados do Produto / Serviço" class="h-full">
                                    <div class="p-fluid formgrid grid">
                                        <UWSeletorItem id="produto" v-model="item.produtoId" classContainer="col-12 md:col-4" required label="Produto / Serviço" 
                                                        @changeObject="changeProduto"/>
                                        <UWInput id="ncm" label="Ncm" uppercase disabled classContainer="col-12 md:col-2" />
                                        <UWInput id="gtin" label="GTIN" uppercase disabled classContainer="col-12 md:col-2" />
                                        <UWInput id="tipoProduto" label="Tipo do Produto" uppercase disabled classContainer="col-12 md:col-3" />
                                        <UWInput id="codigoCEST" label="Código CEST" uppercase disabled classContainer="col-12 md:col-1" />
                                        <UWSeletorCfop id="cfop" classContainer="col-12 md:col-4" required label="Cfop" />
                                        <UWInput id="grupoTributacao" label="Grupo de Tributação" uppercase disabled classContainer="col-12 md:col-2" />
                                        <UWSeletor
                                            classContainer="col-12 md:col-3"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            label="Unidade Medida Comercial"
                                            :service="UnidadeMedidaService"
                                            placeholder="Selecione a unidade medida"
                                            positionTooltip="right"
                                        />
                                    </div>
                                    <div class="col-12">
                                        <Card style="width: 100%; background-color: whitesmoke" ref="cardDefinicaoParcelas">
                                            <template #content>
                                                <div class="flex gap-0 flex-row justify-content-center align-content-end p-fluid formgrid grid">
                                                    <UWDecimal id="quantidade" label="Quantidade" required maximoDigitos="5" autofocus classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorUnitario" label="Valor Unitário" classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorTotalBrutoItem" label="Valor Total Bruto" disabled classContainer="col-12 md:col-2" />
                                                    <UWDecimal id="percentualDesconto" label="% Desc." required maximoDigitos="5" autofocus classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorDesconto" label="Valor Desc." classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorFrete" label="Valor Frete" classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorSeguro" label="Valor Seguro" classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorOutrasDespesas" label="Outras Desp." classContainer="col-12 md:col-1" />
                                                    <UWCurrency id="valorTotalBrutoItem" label="Valor Total" disabled classContainer="col-12 md:col-2" />
                                                </div>
                                            </template>
                                        </Card>
                                    </div>
                                    <div classContainer="col-12 md:col-12 bg-primary-100"></div>
                                </UWFieldSet>
                            </div>
                            <TabView class="col-12">
                                <TabPanel header="Tributação ICMS / ST" class="col-12"> </TabPanel>
                                <TabPanel header="ICMS para a UF de destino" class="col-12"> </TabPanel>
                                <TabPanel header="IPI" class="col-12"> </TabPanel>
                                <TabPanel header="Imposto de Importação" class="col-12"> </TabPanel>
                                <TabPanel header="PIS" class="col-12"> </TabPanel>
                                <TabPanel header="PIS ST" class="col-12"> </TabPanel>
                                <TabPanel header="COFINS" class="col-12"> </TabPanel>
                                <TabPanel header="COFINS ST" class="col-12"> </TabPanel>
                            </TabView>
                        </div>

                    </AccordionTab>
                </Accordion>
            </div>
        </div>
    </div>
</template>

<style>
.columnHeaderItem .p-column-title {
    text-align: center;
    width: 100%;
}
</style>
