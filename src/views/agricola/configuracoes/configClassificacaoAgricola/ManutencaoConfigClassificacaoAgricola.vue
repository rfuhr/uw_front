<script setup>
import { reactive, computed, defineProps } from 'vue';
import { useToast } from 'primevue/usetoast';
import * as yup from 'yup';
import _ from 'lodash';
import { ConfigClassificacaoAgricolaService as Service, ItemService, 
         TipoClassificacaoAgricolaService, SafraService } from '@/service';

const schema = yup.object().shape({
    itemId: yup.number().required('Item é obrigatório.'),
});

const props = defineProps({
    showDialog: {
        type: Boolean,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['closeDialog']);

const toast = useToast();

const formData = reactive({
    nome: undefined,
    codigo: undefined
});

const showDialogComputed = computed({
    get: () => props.showDialog,
    set: (value) => {
        emit('update:showDialog', value);
    }
});

const hideDialog = () => {
    emit('closeDialog');
};

const criarRegistro = () => {
    Service.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de Classificação Agrícola criada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar a Configuração de Classificação Agrícola.', life: 5000 });
        });
};

const alterarRegistro = () => {
    formData.id = props.id;
    Service.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de Classificação Agrícola alterada com sucesso', life: 5000 });
            emit('closeDialog');
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a Configuração de Classificação Agrícola.', life: 5000 });
        });
};

const salvarRegistro = async () => {
    if (props.mode === 'create') {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const showModal = async () => {
    if (props.mode === 'create') {
        formData.nome = undefined;
    } else {
        await Service.getById(props.id).then((data) => {
            _.assign(formData, data);
        });
    }
};

const changeDesconto = () => {
    if (!formData.desconto) {
        formData.percentualDesconto = undefined;
    }
};

</script>

<template>
    <Dialog v-model:visible="showDialogComputed" :style="{ width: '60%' }" :header="mode === 'create' ? 'Nova Configuração de Classificação Agrícola' : 'Alterar Configuração de Classificação Agrícola'" :modal="true" :closable="false" @show="showModal">
        <UWForm :schema="schema" :values="formData" ref="formConfigClassificacaoAgricola" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="col-12">
                    <div class="p-fluid formgrid grid">
                        <UWFieldSet title="Identificação da Configuração da Classificação Agrícola" class="w-full">
                            <div class="formgrid grid">
                                <UWSeletor
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.itemId"
                                    required
                                    optionLabel="nome"
                                    optionValue="id"
                                    :service="ItemService"
                                    placeholder="Selecione o item"
                                    :errors="errors.value?.itemId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.tipoClassificacaoAgricolaId"
                                    required
                                    optionLabel="nome"
                                    optionValue="id"
                                    :service="TipoClassificacaoAgricolaService"
                                    placeholder="Selecione o tipo de classificação"
                                    :errors="errors.value?.tipoClassificacaoAgricolaId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-4"
                                    v-model="formData.safraId"
                                    required
                                    optionLabel="nome"
                                    optionValue="id"
                                    :service="SafraService"
                                    placeholder="Selecione a safra"
                                    :errors="errors.value?.safraId"
                                />
                                <UWDecimal
                                    id="faixaInicial"
                                    label="Faixa Inicial"
                                    required
                                    v-model="formData.faixaInicial"
                                    :errors="errors.value?.faixaInicial"
                                    classContainer="col-12 md:col-4" />
                                <UWDecimal
                                    id="faixaFinal"
                                    label="Faixa Final"
                                    required
                                    v-model="formData.faixaFinal"
                                    :errors="errors.value?.faixaFinal"
                                    classContainer="col-12 md:col-4" />
                            </div>
                        </UWFieldSet>
                        <UWFieldSet title="Configuração do Desconto" class="w-full">
                            <div class="formgrid grid">
                                <div class="field md:col-3 pt-0">
                                    <span class="p-float-label">
                                        <ToggleButton
                                            v-model="formData.desconto"
                                            onLabel="Aplicar Desconto"
                                            offLabel="Não Aplica Desconto"
                                            onIcon="pi pi-lock"
                                            offIcon="pi pi-lock-open"
                                            class="w-full"
                                            @change="changeDesconto"
                                            :pt="{
                                                root: {
                                                    class: [{ 'h-full': true, 'bg-green-100 border-white': formData.desconto, 'bg-red-100 border-white': !formData.desconto }]
                                                }
                                            }"
                                        />
                                    </span>
                                </div>
                                <UWDecimal
                                id="percentualDesconto"
                                label="% de Desconto"
                                :required="formData.desconto"
                                :disabled="!formData.desconto"
                                v-model="formData.percentualDesconto"
                                :errors="errors.value?.percentualDesconto"
                                classContainer="col-12 md:col-3" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </Dialog>
</template>
