<script setup>
import { ref, watch, onMounted } from 'vue';
import { AutorizacaoService } from '@/service';
import { useFormatDate } from '@/composables/useFormatDate';

const props = defineProps({
    modelValue: [],
    documentoOrigemId: {
        type: Number,
        required: true
    },
    tipoAutorizacao: {
        type: String,
        required: true
    }
});

const { formatToDDMMYYYY } = useFormatDate();
const autorizacoes = ref([]);

const fetchAutorizacao = () => {
      if (props.documentoOrigemId && props.tipoAutorizacao) {
        AutorizacaoService.getAutorizacaoByOrigem(props.documentoOrigemId, props.tipoAutorizacao).then(data => {
          autorizacoes.value = data;
        });
      }
    };

    // Primeiro, chama `fetchAutorizacao` ao montar o componente, caso as props já estejam definidas
    onMounted(() => {
      fetchAutorizacao();
    });

    // Observa ambas as props e chama `fetchAutorizacao` quando qualquer uma delas muda
    watch(
      [() => props.documentoOrigemId, () => props.tipoAutorizacao],
      ([novoDocumentoOrigemId, novoTipoAutorizacao]) => {
        if (novoDocumentoOrigemId && novoTipoAutorizacao) {
          fetchAutorizacao();
        }
      }
    );

</script>

<template>
    <div class="col-12">
        <DataTable ref="dtItens" :value="autorizacoes" responsiveLayout="scroll" class="col-12">
            <template #empty> Nenhum item informado. </template>
            <Column field="usuarioAutorizadorNome" header="Autorizador">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ slotProps.data.usuarioAutorizadorNome }}</div> 
                </template>
            </Column>    
            <Column field="statusAutorizacaoNome" header="Status">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ slotProps.data.statusAutorizacaoNome }}</div> 
                </template>
            </Column>       
            <Column field="dataAutorizacao" header="Data da Autorização">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ slotProps.data.dataAutorizacao ? formatToDDMMYYYY(slotProps.data.dataAutorizacao) : '' }}</div> 
                </template>
            </Column>    
            <Column field="usuarioSolicitanteNome" header="Solicitante">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ slotProps.data.usuarioSolicitanteNome }}</div> 
                </template>
            </Column>  
            <Column field="dataSolicitacao" header="Data da Solicitação">
                <template #body="slotProps">
                    <div class="w-full text-left">{{ formatToDDMMYYYY(slotProps.data.dataSolicitacao) }}</div> 
                </template>
            </Column>    
        </DataTable>
    </div>

</template>