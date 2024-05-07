<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

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

const volumesModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const volumeSelecionado = ref();
const volumeEmDigitacao = ref({});
const indexSelecionado = ref();

const adicionarVolume = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    volumeEmDigitacao.value = { idLine: idLine };
    const idx = volumesModelValue.value.length;
    volumesModelValue.value.push(volumeEmDigitacao.value);
    volumeSelecionado.value = volumeEmDigitacao.value;
    indexSelecionado.value = idx;
    visibleDialog.value = true;
    modeDialog.value = 'add';
};

const onRowSelect = (event) => {
    volumeEmDigitacao.value = event.data;
    indexSelecionado.value = event.index;
};

const onRowUnselect = () => {
    volumeEmDigitacao.value = {};
    indexSelecionado.value = null;
};

const handleDelete = (event, data) => {
    volumeSelecionado.value = data;
    volumeEmDigitacao.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            volumesModelValue.value = volumesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Volume removido com sucesso', life: 5000 });
            volumeSelecionado.value = null;
            volumeEmDigitacao.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    volumeEmDigitacao.value = values.data;
    volumeSelecionado.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
};

const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        volumesModelValue.value = volumesModelValue.value.filter((item) => item !== volumeEmDigitacao.value);
        volumeSelecionado.value = null;
        volumeEmDigitacao.value = {};
    }
    visibleDialog.value = false;
};

const handleConfirmar = () => {
    visibleDialog.value = false;
};

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
                            <Button label="Adicionar Volume" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarVolume()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    id="tableVolumes"
                    ref="dtVolumes"
                    selectionMode="single"
                    dataKey="idLine"
                    v-model:selection="volumeSelecionado"
                    :value="volumesModelValue"
                    responsiveLayout="scroll"
                    size="small"
                    stripedRows
                    showGridlines
                    @rowSelect="onRowSelect"
                    @rowUnselect="onRowUnselect"
                >
                    <template #empty> Nenhum volume informada. </template>
                    <Column style="width: 1%; text-align: left">
                        <template #body="slotProps">
                            <i v-if="temErro(`volumes[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                            <i v-if="!temErro(`volumes[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                        </template>
                    </Column>
                    <Column field="quantidade" header="Quantidade" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="especie" header="Espécie" style="width: 10%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="marca" header="Marca" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="numeracao" header="Numeração" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="pesoLiquido" header="Peso Líquido (kg)" style="width: 10%; text-align: left" headerClass="columnHeaderItem" />
                    <Column field="pesoBruto" header="Peso Bruto (kg)" style="width: 10%; text-align: left" headerClass="columnHeaderItem" />
                    <Column header="" style="width: 10%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '50%' }" header="Detalhes do Volume" :modal="true" :closable="false">
        <Divider class="m-0" />
        <div class="col-12 pb-0 mb-0">
            <div class="grid nested-grid">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWInput id="quantidade" label="Quantidade" required v-model="volumeEmDigitacao.quantidade" classContainer="col-12 md:col-4" :errors="_.get(props.errors.value, `volumes[${indexSelecionado}].quantidade`, null)" />
                        <UWInput id="especie" label="Espécie" required v-model="volumeEmDigitacao.especie" classContainer="col-12 md:col-4" :errors="_.get(props.errors.value, `volumes[${indexSelecionado}].especie`, null)" />
                        <UWInput id="marca" label="Marca" v-model="volumeEmDigitacao.marca" classContainer="col-12 md:col-4" />
                        <UWInput id="numeracao" label="Numeração" v-model="volumeEmDigitacao.numeracao" classContainer="col-12 md:col-4" />
                        <UWInput id="pesoLiquido" label="Peso Líquido (kg)" v-model="volumeEmDigitacao.pesoLiquido" classContainer="col-12 md:col-4" />
                        <UWInput id="pesoBruto" label="Peso Bruto (kg)" v-model="volumeEmDigitacao.pesoBruto" classContainer="col-12 md:col-4" />
                    </div>
                </div>
                <div class="field col-12">
                    <span class="p-fluid p-float-label">
                        <Chips id="chips" v-model="volumeEmDigitacao.lacres" style="width: 100%" />
                        <label for="chips">Lacres</label>
                    </span>
                    <!-- <span v-if="errors">
                                            <span v-for="(error, index) of errors" :key="index">
                                                <small class="p-error">{{ error }}</small>
                                            </span>
                                        </span> -->
                </div>
            </div>
        </div>
        <div class="col-12 mt-0 pt-0 pb-0">
            <Divider />
            <div class="flex justify-content-end flex-wrap gap-2">
                <Button label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                <Button type="submit" label="Confirmar" style="color: var(--teal-600)" outlined icon="pi pi-check" @click="handleConfirmar()" />
            </div>
        </div>
    </Dialog>
</template>
