<script setup>
import { watch, ref } from 'vue';
import { SolicitacaoMercadoriaService } from '@/service';

const props = defineProps({
    solicitacaoMercadoriaId: {
        type: Number,
        required: true
    }
});

const solicitacaoMercadoria = ref({});


watch(() => props.solicitacaoMercadoriaId, (value) => {
    getSolicitacaoMercadoria(value);
});

const getSolicitacaoMercadoria = (id) => {
    SolicitacaoMercadoriaService.getById(id)
        .then((response) => {
            solicitacaoMercadoria.value = response;
        })
        .catch(() => {
            solicitacaoMercadoria.value = {};
        });
};

const getNomeItem = (data) => {
    return data.itemSimplificadoNome || data.itemNome;
};

</script>

<template>
    <div class="col-12">
        <div class="p-fluid formgrid grid">
            <UWFieldSet title="Documento de Origem" class="col-12 mt-2">
                <div class="p-fluid formgrid grid">
                    <UWInput id="numeroDocumento" label="Número" disabled v-model="solicitacaoMercadoria.numero" classContainer="col-12 md:col-2" />
                    <UWCalendar id="dataSolicitacaoMercadoria" label="Data da Solicitação" dateFormat="dd/mm/yy" disabled v-model="solicitacaoMercadoria.dataSolicitacao" classContainer="col-12 md:col-2" />
                    <UWInput id="empresaFilial" label="Filial Solicitante" disabled v-model="solicitacaoMercadoria.empresaFilialSolicitanteNome" classContainer="col-12 md:col-4" />
                    <UWInput id="departamentoNome" label="Departamento Solicitante" disabled v-model="solicitacaoMercadoria.departamentoSolicitanteNome" classContainer="col-12 md:col-4" />
                    <UWInput id="grupoContabilDestino" label="Grupo Contábil Destino" disabled v-model="solicitacaoMercadoria.grupoContabilDestinoNome" classContainer="col-12 md:col-4" />
                    <UWInput id="empresaFilialSolicitadoNome" label="Filial Solicitada" disabled v-model="solicitacaoMercadoria.empresaFilialSolicitadoNome" classContainer="col-12 md:col-4" />
                    <UWInput id="departamentoSolicitadoNome" label="Departamento Solicitada" disabled v-model="solicitacaoMercadoria.departamentoSolicitadoNome" classContainer="col-12 md:col-4" />
                    <UWInput id="observacao" label="Observação" disabled v-model="solicitacaoMercadoria.observacao" classContainer="col-12 md:col-12" />
                    <TabView class="col-12">
                        <TabPanel header="Itens da Solicitação">
                            <DataTable ref="dtItens" :value="solicitacaoMercadoria.itens" responsiveLayout="scroll">
                                <template #empty> Nenhum item informado. </template>
                                <Column field="item.nome" header="Item">
                                    <template #body="slotProps">
                                        <div class="w-full text-left">{{ getNomeItem(slotProps.data) }}</div> 
                                    </template>
                                </Column>
                                <Column field="departamentoEntregaNome" header="Departamento Entrega">
                                    <template #body="slotProps">
                                        <div class="w-full text-left">{{ slotProps.data.departamentoEntregaNome }}</div> 
                                    </template>
                                </Column>                
                                <Column field="quantidadeSolicitada" header="Quantidade Solicitada" />
                                <Column field="urgenciaSolicitacaoMercadoria" header="Urgência">
                                    <template #body="slotProps">
                                        <div class="w-full text-left">{{ slotProps.data.urgenciaSolicitacaoMercadoriaNome }}</div> 
                                    </template>
                                </Column>                
                                <Column field="previsaoDiasUtilizacao" header="Previsão Utilização (dias)">
                                    <template #body="slotProps">
                                        <div class="w-full text-left">{{ slotProps.data.previsaoDiasUtilizacao }}</div> 
                                    </template>
                                </Column>                                                
                                <Column field="observacao" header="Observação" />
                            </DataTable>                                       
                        </TabPanel>
                    </TabView>
                </div>
            </UWFieldSet>
        </div>
    </div>
</template>