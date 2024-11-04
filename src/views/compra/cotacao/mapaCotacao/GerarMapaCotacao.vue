<script setup>
import { ref, computed } from 'vue';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; // optional
import Row from 'primevue/row'; // optional

const sales = ref([
    { product: 'Bamboo Watch', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342 },
    { product: 'Black Watch', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122 },
    { product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500 },
    { product: 'Blue T-Shirt', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 65323 },
    { product: 'Brown Purse', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332 },
    { product: 'Chakra Bracelet', lastYearSale: 52, thisYearSale: 65, lastYearProfit: 421132, thisYearProfit: 150005 },
    { product: 'Galaxy Earrings', lastYearSale: 82, thisYearSale: 12, lastYearProfit: 131211, thisYearProfit: 100214 },
    { product: 'Game Controller', lastYearSale: 44, thisYearSale: 45, lastYearProfit: 66442, thisYearProfit: 53322 },
    { product: 'Gaming Set', lastYearSale: 90, thisYearSale: 56, lastYearProfit: 765442, thisYearProfit: 296232 },
    { product: 'Gold Phone Case', lastYearSale: 75, thisYearSale: 54, lastYearProfit: 21212, thisYearProfit: 12533 }
]);

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const lastYearTotal = computed(() => {
    let total = 0;
    for (let sale of sales.value) {
        total += sale.lastYearProfit;
    }

    return formatCurrency(total);
});

const thisYearTotal = computed(() => {
    let total = 0;
    for (let sale of sales.value) {
        total += sale.thisYearProfit;
    }

    return formatCurrency(total);
});
</script>

<template>
    <UWPageBase title="Gerar Mapa de Cotação" subtitle="xxxxxxxxxxxxxxxxxxx" minHeight="calc(100vh - 12.8rem)">
        <div class="flex w-full gap-2">
            <div class="barracotacoes">
                <h6 class="text-white">Cotações Abertas</h6>
                <ScrollPanel
                    class="quotations-list"
                    style="width: 100%; height: calc(100vh - 28rem)"
                    :pt="{
                        wrapper: {
                            style: { 'border-right': '10px solid var(--surface-ground)' }
                        },
                        bary: 'hover:bg-primary-400 bg-primary-300 opacity-100'
                    }"
                >
                    <div class="quotation-item">Cotação #001</div>
                    <div class="quotation-item">Cotação #002</div>
                    <div class="quotation-item">Cotação #003</div>
                    <div class="quotation-item">Cotação #001</div>
                    <div class="quotation-item">Cotação #002</div>
                    <div class="quotation-item">Cotação #003</div>
                    <div class="quotation-item">Cotação #001</div>
                    <div class="quotation-item">Cotação #002</div>
                    <div class="quotation-item">Cotação #003</div>
                    <div class="quotation-item">Cotação #001</div>
                    <div class="quotation-item">Cotação #002</div>
                    <div class="quotation-item">Cotação #003</div>
                    <div class="quotation-item">Cotação #001</div>
                    <div class="quotation-item">Cotação #002</div>
                    <div class="quotation-item">Cotação #003</div>
                </ScrollPanel>
            </div>
            <div class="flex flex-column w-full gap-2">
                <div class="flex flex-row-reverse w-full border-round-lg p-2" style="background-color: #525e74">
                    <Button icon="pi pi-cog" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                </div>  
                <div class="w-full h-full border-round-lg surface-300">
                    <div class="col-12">
                        <DataTable size="small" :value="sales" tableStyle="min-width: 50rem">
                            <ColumnGroup type="header">
                                <Row>
                                    <Column header="Item Cotado" :rowspan="3" />
                                    <Column header="Fornecedores" :colspan="6" />
                                </Row>
                                <Row>
                                    <Column header="Fornecedor A" :colspan="2" />
                                    <Column header="Fornecedor B" :colspan="2" />
                                </Row>
                                <Row>
                                    <Column header="Quantidade" field="lastYearSale" />
                                    <Column header="Valor Unitário" field="thisYearSale" />
                                    <Column header="Quantidade" field="lastYearProfit" />
                                    <Column header="Valor Unitário" field="thisYearProfit" />
                                </Row>
                            </ColumnGroup>
                            <Column field="product" />
                            <Column field="lastYearSale">
                                <template #body="slotProps"> {{ slotProps.data.lastYearSale }}% </template>
                            </Column>
                            <Column field="thisYearSale">
                                <template #body="slotProps"> {{ slotProps.data.thisYearSale }}% </template>
                            </Column>
                            <Column field="lastYearProfit">
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.lastYearProfit) }}
                                </template>
                            </Column>
                            <Column field="thisYearProfit">
                                <template #body="slotProps">
                                    {{ formatCurrency(slotProps.data.thisYearProfit) }}
                                </template>
                            </Column>
                            <ColumnGroup type="footer">
                                <Row>
                                    <Column footer="Totals:" :colspan="3" footerStyle="text-align:right" />
                                    <Column :footer="lastYearTotal" />
                                    <Column :footer="thisYearTotal" />
                                </Row>
                            </ColumnGroup>
                        </DataTable>
                    </div>
                    <section class="supplier-details">
                        <h6>Detalhes dos Fornecedores</h6>
                        <div class="supplier-info">
                            <div class="supplier">
                                <h4>Fornecedor 1</h4>
                                <p>Entrega: 10 dias</p>
                                <p>Pagamento: À vista</p>
                            </div>
                            <div class="supplier">
                                <h4>Fornecedor 2</h4>
                                <p>Entrega: 15 dias</p>
                                <p>Pagamento: 2x</p>
                            </div>
                            <div class="supplier">
                                <h4>Fornecedor 3</h4>
                                <p>Entrega: 12 dias</p>
                                <p>Pagamento: 3x</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="flex flex-row-reverse w-full border-round-lg p-2 surface-200 border-200" style="background-color: #525e74">
                    <Button label="Salvar" icon="pi pi-pencil" class="p-button-secundary p-button-sm mr-2" @click="handleEdit(slotProps)" />
                    <Button label="Voltar" icon="pi pi-pencil" class="p-button-danger p-button-sm mr-2" @click="handleEdit(slotProps)" />
                </div>                
            </div>
        </div>
    </UWPageBase>
</template>

<style lang="css" scoped>
.barracotacoes {
    width: 20rem;
    background-color: #2d3e50;
    color: #fff;
    padding: 2rem;
    border-radius: 1rem;
}

.barracotacoes h5 {
    margin-bottom: 2rem;
}

.quotations-list {
    overflow-y: auto;
    height: calc(100vh - 28rem);
}

.quotation-item {
    background-color: #3e4c61;
    padding: 0.8rem;
    margin-bottom: 0.8rem;
    border-radius: 0.5rem;
    cursor: pointer;
    margin-right: 5px;
}

.quotation-item:hover {
    background-color: #4b5a73;
}

/* Supplier Details */
.supplier-details {
    background-color: transparent;
    padding: 0px 15px;
    border-radius: 5px;
}

.supplier-info {
    display: flex;
    gap: 20px;
}

.supplier {
    flex: 1;
    background-color: #f4f4f4;
    padding: 2px 5px;
    border-radius: 5px;
}

.supplier h4 {
    font-size: 12px;
    margin-bottom: 5px;
}

</style>
