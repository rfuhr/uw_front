<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
});

const emit = defineEmits(['update:modelValue']);

const itensModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const valorTotalProdutos = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.subTotal, 0);
    } else return 0;
});

const valorTotalDescontos = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorDesconto, 0);
    } else return 0;
});

const valorTotalFrete = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorFrete, 0);
    } else return 0;
});

const valorTotalSeguro = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorSeguro, 0);
    } else return 0;
});

const valorTotalOutrasDespesas = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorOutrasDespesas, 0);
    } else return 0;
});

const valorTotalNota = computed(() => {
    if (itensModelValue.value && itensModelValue.value.itens) {
        return itensModelValue.value.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorTotal, 0);
    } else return 0;
});

// const baseCalculoIcms = computed(() => {
//     if (itensModelValue.value) {
//         let total = 0;
//         itensModelValue.value.itens.array.forEach(item => {
//             return total += item.detalhamentoItem.baseCalculoIcms;
//         });

//     } else return 0;
// });

</script>

<template>
    <div class="grid nested-grid">
        <div class="col-12">
            <UWFieldSet title="Totais da NFe" class="h-full">
                <div class="p-fluid formgrid grid">
                    <UWCurrency label="Valor Total dos produtos" v-model="valorTotalProdutos" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do Desconto" v-model="valorTotalDescontos" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do Frete" v-model="valorTotalFrete" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do Seguro" v-model="valorTotalSeguro" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Outras Despesas" v-model="valorTotalOutrasDespesas" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total da Nota" v-model="valorTotalNota" disabled classContainer="col-12 md:col-2" />
                </div>
            </UWFieldSet>
        </div>
        <div class="col-12">
            <UWFieldSet title="Totais da Tributação" class="h-full">
                <div class="p-fluid formgrid grid">
                    <UWCurrency label="Base de Cálculo do ICMS" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do ICMS" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do ICMS desonerado" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Base de Cálculo do ICMS ST" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do ICMS ST" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do Pis" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do Cofins" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor total do ICMS UF Destino" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor total do ICMS UF Remetente" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do IPI" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do IPI Devolvido" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do II" disabled classContainer="col-12 md:col-2" />
                </div>
            </UWFieldSet>
        </div>
        <div class="col-12">
            <!-- <UWFieldSet title="Totais do Fundo de Combate a Probeza (FCP)" class="h-full">
                <div class="p-fluid formgrid grid">
                    <UWCurrency label="Valor total do ICMS FCP da UF destino" disabled classContainer="col-12 md:col-offset-2 md:col-2" />
                    <UWCurrency label="Valor Total do FCP" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do FCP por ST" disabled classContainer="col-12 md:col-2" />
                    <UWCurrency label="Valor Total do FCP retido por ST" disabled classContainer="col-12 md:col-2" />
                </div>
            </UWFieldSet> -->
        </div>
    </div>
</template>
