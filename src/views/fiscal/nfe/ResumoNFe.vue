<script setup>
import { computed } from 'vue';
import { useFormatDate } from '@/composables/useFormatDate';
import { useFormatNumber } from '@/composables/useFormatNumber';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const { formatToDDMMYYYY } = useFormatDate();
const { formatNumber } = useFormatNumber();

const getLocalRetirada = () => {
    return `${localModelValue.value.identificacaoNFe.localRetirada.nomeRazaoSocial}, 
            ${localModelValue.value.identificacaoNFe.localRetirada.endereco}, 
            ${localModelValue.value.identificacaoNFe.localRetirada.numero}, 
            ${localModelValue.value.identificacaoNFe.localRetirada.bairro},
            ${localModelValue.value.identificacaoNFe.localRetirada.cidadeNome} - ${localModelValue.value.identificacaoNFe.localRetirada.ufSigla},
            CEP ${localModelValue.value.identificacaoNFe.localRetirada.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
}

const getLocalEntrega = () => {
    return `${localModelValue.value.destinatario.localEntrega.nomeRazaoSocial}, 
            ${localModelValue.value.destinatario.localEntrega.endereco}, 
            ${localModelValue.value.destinatario.localEntrega.numero}, 
            ${localModelValue.value.destinatario.localEntrega.bairro},
            ${localModelValue.value.destinatario.localEntrega.cidadeNome} - ${localModelValue.value.destinatario.localEntrega.ufSigla},
            CEP ${localModelValue.value.destinatario.localEntrega.cep.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3')}`;
}

const valorTotalNota = computed(() => {
    if (localModelValue.value.itensNFe.itens) {
        return localModelValue.value.itensNFe.itens.reduce((total, produto) => total + produto.detalhamentoItem.valorTotal, 0);
    } else return 0;
});

const dadosTransporte = computed(() => {
    if (localModelValue.value.transporte.modalidadeFrete === '9') 
        return `${localModelValue.value.transporte.modalidadeFreteNome}`
    else
        return `${localModelValue.value.transporte.modalidadeFreteNome} - ${localModelValue.value.transporte.nomeRazaoSocial}`
    // return {{ localModelValue.transporte.modalidadeFreteNome }} - {{ localModelValue.transporte.nomeRazaoSocial }}
})



</script>


<template>
    <div class="card py-8 px-6 md:px-8 overflow-auto">
        <div class="flex flex-column align-items-start md:flex-row md:align-items-center md:justify-content-between border-bottom-1 surface-border pb-5 min-w-max">
            <div class="flex flex-column">
                <!-- <svg width="48" height="50" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M33.1548 9.65956L23.9913 4.86169L5.54723 14.5106L0.924465 12.0851L23.9913 0L37.801 7.23403L33.1548 9.65956ZM23.9931 19.3085L42.4255 9.65955L47.0717 12.0851L23.9931 24.1595L10.1952 16.9361L14.8297 14.5106L23.9931 19.3085ZM4.6345 25.8937L0 23.4681V37.9149L23.0669 50V45.1489L4.6345 35.4894V25.8937ZM18.4324 28.2658L0 18.6169V13.7658L23.0669 25.8403V40.2977L18.4324 37.8615V28.2658ZM38.7301 23.468V18.6169L24.9205 25.8403V49.9999L29.555 47.5743V28.2659L38.7301 23.468ZM43.3546 35.4892V16.1914L48.0008 13.7659V37.9148L34.1912 45.1488V40.2977L43.3546 35.4892Z"
                        fill="var(--primary-color)"
                    />
                </svg> -->
                <div class="my-3 text-4xl font-bold text-900">{{ localModelValue.identificacaoNFe.departamento.empresaNome }}</div>
                <span class="mb-2"><span style="font-weight: bold;">Filial:</span> {{localModelValue.identificacaoNFe.departamento.empresaFilialNome }}</span>
                <span v-if="localModelValue.identificacaoNFe.operacaoInterna" class="mb-2"><span style="font-weight: bold;">Operação Interna:</span> {{localModelValue.identificacaoNFe.operacaoInterna.nome }}</span>
                <span v-if="localModelValue.identificacaoNFe.outroLocalRetirada" class="mb-2"><span style="font-weight: bold;">Local de Retirada:</span> {{  getLocalRetirada() }} </span>
            </div>
            <div class="flex flex-column mt-5 md:mt-0">
                <div class="text-2xl font-semibold text-left md:text-right mb-3">NF-e</div>
                <div class="flex flex-column">
                    <div class="flex justify-content-between align-items-center mb-2">
                        <span class="font-semibold mr-6">DATA EMISSÃO</span>
                        <span>{{ formatToDDMMYYYY(localModelValue.identificacaoNFe.dataHoraEmissao) }}</span>
                    </div>
                    <div class="flex justify-content-between align-items-center mb-2">
                        <span class="font-semibold mr-6">DATA SAÍDA</span>
                        <span>{{ formatToDDMMYYYY(localModelValue.identificacaoNFe.dataHoraSaidaEntrada) }}</span>
                    </div>
                    <div class="flex justify-content-between align-items-center">
                        <span class="font-semibold mr-6">NAT. OP</span>
                        <span>{{ localModelValue.identificacaoNFe.naturezaOperacaoSigla }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5  flex flex-column border-bottom-1 surface-border pb-5">
            <div class="mb-3 text-2xl font-medium">{{ localModelValue.destinatario.dadosParceiroLocal.nomeRazaoSocial }}</div>
            <span class="mb-2"><span style="font-weight: bold;">Endereço: </span> {{ localModelValue.destinatario.dadosParceiroLocal.enderecoCompleto }}</span>
            <span v-if="localModelValue.destinatario.outroLocalEntrega" class="mb-2"><span style="font-weight: bold;">Local de Entrega:</span> {{  getLocalEntrega() }} </span>
        </div>
        

        <div v-if="localModelValue.itensNFe.itens" class="overflow-x-auto">
            <table class="w-full" :style="{ borderCollapse: 'collapse', tableLayout: 'auto' }">
                <thead>
                    <tr>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Item</th>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Cfop</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Quantidade</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Valor Unitário (R$)</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">% Desconto</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Valor Desconto (R$)</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Outros Valores (R$)</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Valor Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in localModelValue.itensNFe.itens" :key="item.index">
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 30%;">{{ item.detalhamentoItem.item.nome }}</td>
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 10%;">{{ item.detalhamentoItem.cfop.codigo }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.quantidade, 0) }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.valorUnitario, 2) }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.percentualDesconto,2) }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.valorDesconto,2) }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.valorOutrasDespesas,2) }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border" style="width: 10%;">{{ formatNumber(item.detalhamentoItem.valorTotal,2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex flex-column md:flex-row md:align-items-start md:justify-content-end mt-4">
            <div class="flex flex-column">
                <div class="flex justify-content-between align-items-center mb-2">
                    <span class="font-semibold mr-6">TOTAL</span>
                    <span>{{ formatNumber(valorTotalNota, 2) }}</span>
                </div>
                <!-- <div class="flex justify-content-between align-items-center mb-2">
                    <span class="font-semibold mr-6">VAT #</span>
                    <span>0</span>
                </div>
                <div class="flex justify-content-between align-items-center">
                    <span class="font-semibold mr-6">TOTAL</span>
                    <span>$332.00</span>
                </div> -->
            </div>
        </div>

        

        <div class="mt-5  flex flex-column border-bottom-1 surface-border pb-5">
            <span class="mb-2"><span style="font-weight: bold;">Transporte: </span> {{ dadosTransporte }}</span>
        </div>        
        
        <div v-if="localModelValue.financeiro.pagamentos" class="overflow-x-auto">
            <table class="w-full" :style="{ borderCollapse: 'collapse', tableLayout: 'auto' }">
                <thead>
                    <tr>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Parcela</th>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Data de Vencimento</th>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Forma de Pagamento</th>
                        <th class="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">Meio de Pagamento</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Bandeira do Cartão</th>
                        <th class="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">Valor Pagamento (R$)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pagamento in localModelValue.financeiro.pagamentos" :key="pagamento.index">
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 10%;">{{ pagamento.numero ? pagamento.numero : '' }}</td>
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 15%;">{{ pagamento.dataVencimento ? formatToDDMMYYYY(pagamento.dataVencimento) : '' }}</td>
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 30%;">{{ pagamento.aux.indicadorFormaPagamento ? pagamento.aux.indicadorFormaPagamento.name : '' }}</td>
                        <td class="text-left py-3 border-bottom-1 surface-border white-space-nowrap" style="width: 10%;">{{ pagamento.aux.meioPagamento ? pagamento.aux.meioPagamento.name : '' }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ pagamento.aux.bandeiraCartao ? pagamento.aux.bandeiraCartao.name : '' }}</td>
                        <td class="text-right py-3 border-bottom-1 surface-border px-3" style="width: 10%;">{{ formatNumber(pagamento.valorPagamento, 2) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>        

    </div>
</template>
