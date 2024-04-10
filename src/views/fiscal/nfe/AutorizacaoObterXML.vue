<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { useFormatDocumentos } from '@/composables/useFormatDocumentos';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);
const { formatDocumento } = useFormatDocumentos();
const toast = useToast();
const confirm = useConfirm();
const visibleDialog = ref(false);
const modeDialog = ref('');

const autorizacoesModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const autorizacaoSelecionada = ref();
const autorizacao = ref({
    tipoPessoa: undefined,
    cnpj: undefined,
    cpf: undefined
});
const indexSelecionado = ref();

const tiposPessoa = ref([
    { name: 'Física', value: 'F' },
    { name: 'Jurídica', value: 'J' }
    // { name: 'Exterior', value: 'EX' }
]);

const adicionarAutorizacao = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    autorizacao.value = { idLine: idLine };
    const idx = autorizacoesModelValue.value.length;
    autorizacoesModelValue.value.push(autorizacao.value);
    autorizacaoSelecionada.value = autorizacao.value;
    indexSelecionado.value = idx;
    autorizacao.value.tipoPessoa = 'J';
    autorizacao.value.tipoPessoaName = 'Jurídica';
    visibleDialog.value = true;
    modeDialog.value = 'add';
};

const onRowSelect = (event) => {
    autorizacao.value = event.data;
    indexSelecionado.value = event.index;
};

const onRowUnselect = () => {
    autorizacao.value = {};
    indexSelecionado.value = null;
};

const changeTipoPessoa = (object) => {
    autorizacaoSelecionada.value.cnpj = null;
    autorizacaoSelecionada.value.cpf = null;
    autorizacaoSelecionada.value.tipoPessoaName = object.name;
};

const handleDelete = (event, data) => {
    autorizacaoSelecionada.value = data;
    autorizacao.value = data;
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            autorizacoesModelValue.value = autorizacoesModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Autorização removida com sucesso', life: 5000 });
            autorizacaoSelecionada.value = null;
            autorizacao.value = {};
        },
        reject: () => {}
    });
};

const handleEdit = (values) => {
    autorizacao.value = values.data;
    autorizacaoSelecionada.value = values.data;
    indexSelecionado.value = values.index;
    modeDialog.value = 'edit';
    visibleDialog.value = true;
}

const handleVoltar = () => {
    if (modeDialog.value === 'add') {
        autorizacoesModelValue.value = autorizacoesModelValue.value.filter((item) => item !== autorizacao.value);
        autorizacaoSelecionada.value = null;
        autorizacao.value = {};
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
                            <Button label="Adicionar Autorização" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarAutorizacao()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable
                    id="tableAutorizacoes"
                    ref="dtAutorizacoes"
                    selectionMode="single"
                    dataKey="idLine"
                    v-model:selection="autorizacaoSelecionada"
                    :value="autorizacoesModelValue"
                    responsiveLayout="scroll"
                    size="small"
                    stripedRows
                    showGridlines
                    @rowSelect="onRowSelect"
                    @rowUnselect="onRowUnselect"
                >
                    <template #empty> Nenhuma autorização informada. </template>
                    <Column style="width: 1%; text-align: left">
                        <template #body="slotProps">
                            <i v-if="temErro(`autorizacoes[${slotProps.index}]`)" class="pi pi-exclamation-circle text-red-500 text-bold" style="font-size: 1.3rem" />
                            <i v-if="!temErro(`autorizacoes[${slotProps.index}]`)" class="pi pi-exclamation-circle text-green-500 text-bold" style="font-size: 1.3rem" />
                        </template>
                    </Column>
                    <Column field="tipoPessoaName" header="Tipo Pessoa" style="width: 20%; text-align: left" headerClass="columnHeaderItem" />
                    <Column header="Cnpj / Cpf" style="width: 60%; text-align: left" headerClass="columnHeaderItem">
                        <template #body="slotProps">
                            {{ formatDocumento(slotProps.data.tipoPessoa === 'J' ? slotProps.data.cnpj : slotProps.data.cpf) }}
                        </template>
                    </Column>
                    <Column header="" style="width: 5%">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-info p-button-sm mr-2" @click="handleEdit(slotProps)" />
                            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="handleDelete($event, slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visibleDialog" :style="{ width: '30%' }" header="Detalhes da Autorização" :modal="true" :closable="false">
        <Divider class="m-0" />
        <div class="col-12 pb-0 mb-0">
            <div class="grid nested-grid">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWPickList
                            id="tipoPessoa"
                            label="Tipo da Pessoa Autorizada"
                            v-model="autorizacao.tipoPessoa"
                            optionLabel="name"
                            optionValue="value"
                            required
                            :options="tiposPessoa"
                            classContainer="col-12 md:col-5"
                            @changeObject="changeTipoPessoa"
                            :errors="_.get(props.errors.value, `autorizacoes[${indexSelecionado}].tipoPessoa`, null)"
                        />
                        <UWInputMask
                            v-if="!autorizacao.tipoPessoa || autorizacao.tipoPessoa === 'J'"
                            id="cnpj"
                            label="Cnpj"
                            mask="99.999.999/9999-99"
                            required
                            v-model="autorizacao.cnpj"
                            classContainer="col-12 md:col-7"
                            :errors="_.get(props.errors.value, `autorizacoes[${indexSelecionado}].cnpj`, null)"
                        />
                        <UWInputMask
                            v-if="autorizacao.tipoPessoa === 'F'"
                            id="cpf"
                            label="Cpf"
                            mask="999.999.999-99"
                            required
                            v-model="autorizacao.cpf"
                            classContainer="col-12 md:col-7"
                            :errors="_.get(props.errors.value, `autorizacoes[${indexSelecionado}].cpf`, null)"
                        />
                    </div>
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
