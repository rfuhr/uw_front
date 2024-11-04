<script setup>
import { watch, ref } from 'vue';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { AutorizacaoService, SolicitacaoMercadoriaService } from '@/service';
import DocumentoOrigemSolicitacaoMercadoria from './DocumentoOrigemSolicitacaoMercadoria.vue';

const props = defineProps({
    solicitacaoId: {
        type: Number,
        required: true
    },
    visibleDialog: Boolean
});

const emit = defineEmits(['doCancelar']);

const createSchema = () => {
    return yup.object().shape({
    });
};

const toast = useToast();
const openDialog = ref(false);
const formData = ref({});
const solicitacaoMercadoria = ref({});

watch(() => props.visibleDialog, (value) => {
    openDialog.value = value;
});

watch(() => props.solicitacaoId, () => {
    AutorizacaoService.getById(props.solicitacaoId)
        .then((response) => {
            formData.value = response;
            if (response.tipoAutorizacao === '1') {
                getSolicitacaoMercadoria(response.documentoOrigemId);
            }
        })
        .catch(() => {
            formData.value = {};
        });
});

const handleVoltar = () => {
    emit('doVoltar');
};

const getSolicitacaoMercadoria = (id) => {
    SolicitacaoMercadoriaService.getById(id)
        .then((response) => {
            solicitacaoMercadoria.value = response;
        })
        .catch(() => {
            solicitacaoMercadoria.value = {};
        });
};

const handleNegar = (id) => {
    AutorizacaoService.negar(id)
        .then(() => {
            emit('doVoltar');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao negar autorização' });
        });
};

const handleAutorizar = (id) => {
    AutorizacaoService.autorizar(id)
        .then(() => {
            emit('doVoltar');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao autorizar autorização' });
        });
};
</script>

<template>
    <Dialog v-model:visible="openDialog" :style="{ width: '70%' }" header="Detalhamento da Autorização" :modal="true" :closable="false">
        <UWForm :schema="createSchema()" :values="formData" :visibleSave="false" :visibleCancel="false" visibleVoltar @doVoltar="handleVoltar()">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWFieldSet title="Dados da Solicitação" class="col-12">
                            <div class="p-fluid formgrid grid">
                                <UWCalendar id="dataSolicitacao" label="Data da Solicitação" dateFormat="dd/mm/yy" disabled v-model="formData.dataSolicitacao" classContainer="col-12 md:col-2" />
                                <UWInput id="tipoAutorizacao" label="Tipo da Autorização" disabled v-model="formData.tipoAutorizacaoNome" classContainer="col-12 md:col-4" />
                                <UWInput id="solicitante" label="Solicitante" disabled v-model="formData.usuarioSolicitanteNome" classContainer="col-12 md:col-4" />
                                <UWInput id="situacao" label="Status" disabled v-model="formData.statusAutorizacaoNome" classContainer="col-12 md:col-2" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
                <DocumentoOrigemSolicitacaoMercadoria v-if="formData.tipoAutorizacao === '1'" :solicitacao-mercadoria-id="formData.documentoOrigemId"/>
            <template #buttonsRight>
                <Button v-if="formData.statusAutorizacao === '1'" label="Não Autorizar" @click="handleNegar(formData.id)" style="color: var(--red-600);" outlined icon="pi pi-check" />
                <Button v-if="formData.statusAutorizacao === '1'" label="Autorizar" @click="handleAutorizar(formData.id)" class="p-button-success" icon="pi pi-check" />
            </template>
        </UWForm>
    </Dialog>       
</template>