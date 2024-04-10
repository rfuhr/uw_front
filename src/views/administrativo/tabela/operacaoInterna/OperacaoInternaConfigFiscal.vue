<script setup>
import { ref, computed, onMounted } from 'vue';
import _ from 'lodash';
import { TiposService } from '@/service';
import UWSeletorCfop from '@/components/seletores/UWSeletorCfop.vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || { nome: 'Rodrigo' },
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const destinosOperacao = ref([]);
const finalidadesNfe = ref([]);
const tiposConsumidor = ref([]);
const tiposPresenca = ref([]);

onMounted(async () => {
    TiposService.getDestinoOperacao().then((data) => {
        destinosOperacao.value = data;
    });
    TiposService.getFinalidadeNfe().then((data) => {
        finalidadesNfe.value = data;
    });
    TiposService.getTipoConsumidor().then((data) => {
        tiposConsumidor.value = data;
    });
    TiposService.getTipoPresencaComprador().then((data) => {
        tiposPresenca.value = data;
    });
});

const adicionarCfop = () => {
    const idLine = Math.floor(Math.random() * 100) * -1;
    if (!localModelValue.value.cfops)
    localModelValue.value.cfops = [];
    localModelValue.value.cfops.push({
        id: idLine,
        cfopId: undefined
    });
};

const removerCfop = (idRemover) => {
    _.remove(localModelValue.value.cfops, (n) => {
        return n.id === idRemover;
    });
};

</script>

<template>
    <div class="formgrid grid pt-0">
        <UWPickList id="destinoOperacao" label="Destino da Operação" v-model="localModelValue.destinoOperacao" optionLabel="name" optionValue="value" required :options="destinosOperacao" classContainer="col-12 md:col-6" />
        <UWPickList id="finalidadeNfe" label="Finalidade da NFe" v-model="localModelValue.finalidadeNfe" optionLabel="name" optionValue="value" :options="finalidadesNfe" classContainer="col-12 md:col-6" />
        <UWPickList id="tipoConsumidor" label="Tipo do Consumidor" v-model="localModelValue.tipoConsumidor" optionLabel="name" optionValue="value" :options="tiposConsumidor" classContainer="col-12 md:col-6" />
        <UWPickList id="tipoPresenca" label="Tipo de Presença de comprador" v-model="localModelValue.tipoPresencaComprador" optionLabel="name" optionValue="value" :options="tiposPresenca" classContainer="col-12 md:col-6" />
        <div class="col-12">
            <UWFieldSet title="Cfops permitidos para operação interna" class="h-full">
                <Toolbar class="mb-2">
                    <template v-slot:start>
                        <div>
                            <Button label="Adicionar Cfop" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarCfop()" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable ref="dtCfops" :value="localModelValue.cfops" size="small" responsiveLayout="scroll" stripedRows showGridlines>
                    <Column field="cfopId" header="Cfop" style="width: 80%">
                        <template #body="slotProps">
                            <UWSeletorCfop id="cfop" v-model="slotProps.data.cfopId" classContainer="col-12 md:col-12 pb-0 mb-0" required label="Cfop" :erros="_.get(errors, `cfops[${slotProps.index}].cfopId`, null)" />
                        </template>
                    </Column>
                    <Column header="" style="width: 5%">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm" @click="removerCfop(slotProps.data.id)" />
                        </template>
                    </Column>
                </DataTable>
            </UWFieldSet>
        </div>
    </div>
</template>
