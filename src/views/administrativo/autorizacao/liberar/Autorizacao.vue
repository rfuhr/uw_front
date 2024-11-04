<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { AutorizacaoService, TiposService } from '@/service';
import { useFormatDate } from '@/composables/useFormatDate';
import DetalhaAutorizacao from './DetalhaAutorizacao.vue';

const crudlista = ref();
const { formatToDDMMYYYY } = useFormatDate();
const tiposAutorizacoes = ref([]);
const statusAutorizacoes = ref([]);
const visibleDialog = ref(false);

const columns = reactive([
    {
        label: 'Data da Solicitação',
        field: 'dataSolicitacao',
        tipoField: 'maskDate',
        filter: false,
        placeholder: '',
        size: '3%',
        maskDate: 'dd/MM/yyyy'
    },
    {
        label: 'Tipo da Autorização',
        field: 'tipoAutorizacaoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%',
        sortable: true,
        fieldFilter: 'tipoAutorizacao',
        filterSeletor: true,
        filterValues: tiposAutorizacoes
    },
    {
        label: 'Identificação Documento',
        field: 'documentoIdentificacao',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%',
        sortable: true,
        fieldFilter: 'documentoIdentificacao'
    },
    {
        label: 'Status',
        field: 'statusAutorizacaoNome',
        tipoField: 'text',
        filter: true,
        matchMode: 'contains',
        placeholder: '',
        size: '5%',
        sortable: true,
        fieldFilter: 'statusAutorizacao',
        filterSeletor: true,
        filterValues: statusAutorizacoes,
        filterValue: '1'
    },
]);

const filtrosDefault = reactive({
    usuarioAutorizadorId: { value: 1, matchMode: 'equal', tipo: 'integer', fieldFilter: 'usuarioAutorizador.id' }
});
const solicitacaoId = ref(null);

onMounted(() => {
    TiposService.getTipoAutorizacao()
        .then((response) => {
            tiposAutorizacoes.value = response.map((m) => {
                return {
                    label: m.name,
                    value: m.value
                };
            });
        })
        .catch(() => {
            tiposAutorizacoes.value = [];
        });

    TiposService.getStatusAutorizacao()
        .then((response) => {
            statusAutorizacoes.value = response.map((m) => {
                return {
                    label: m.name,
                    value: m.value
                };
            });
        })
        .catch(() => {
            statusAutorizacoes.value = [];
        });
});

const openDetalhes = (id) => {
    solicitacaoId.value = id;
    nextTick(() => {
        visibleDialog.value = true;
    });
};

const handleCancelarDetalha = () => {
    visibleDialog.value = false;
    crudlista.value.reload();

};

</script>

<template>
    <UWPageCrud
        ref="crudlista"
        tag="autorizacao"
        title="Autorizações"
        :columns="columns"
        :service="AutorizacaoService"
        :showButtonNew="false"
        :showAcoes="true"
        :showButtonEdit="false"
        :showButtonDelete="false"
        sortField="id"
        :filtersDefault="filtrosDefault"
    >
        <template #tableActions="slotProps"> 
            <Button v-tooltip="'Detalhes'" icon="pi pi-bolt" class="p-button-secundary p-button-sm mr-2" @click="openDetalhes(slotProps.data.id)" style="height: 24px; width: 24px;"/>            
        </template>
    </UWPageCrud>
    <DetalhaAutorizacao :solicitacaoId="solicitacaoId" :visibleDialog="visibleDialog" @doVoltar="handleCancelarDetalha" />
</template>
