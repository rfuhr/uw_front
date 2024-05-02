<script setup>
import { computed } from 'vue';
import ManutencaoConfigMensagemFiscalConfigFiscal from './ManutencaoConfigMensagemFiscalConfigFiscal.vue';
// import ManutencaoParceiroDadosTelefone from './ManutencaoParceiroDadosTelefone.vue';
// import ManutencaoParceiroDadosEmail from './ManutencaoParceiroDadosEmail.vue';


const props = defineProps({
    modelValue: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <TabView class="col-12">
        <TabPanel header="Configuração Fiscal" class="col-12">
            <ManutencaoConfigMensagemFiscalConfigFiscal v-model="localModelValue.configMensagemFiscalConfigFiscals"/>
        </TabPanel>
        <TabPanel header="Situação Tributária" class="col-12">
            <!-- <ManutencaoParceiroDadosTelefone v-model="localModelValue.telefones"/> -->
        </TabPanel>
        <TabPanel header="Grupo Tributação" class="col-12">
            <!-- <ManutencaoParceiroDadosEmail v-model="localModelValue.emails"/> -->
        </TabPanel>
        <TabPanel header="Item" class="col-12">
            <!-- <ManutencaoParceiroDadosEmail v-model="localModelValue.emails"/> -->
        </TabPanel>
        <TabPanel header="Operação Interna" class="col-12">
            <!-- <ManutencaoParceiroDadosEmail v-model="localModelValue.emails"/> -->
        </TabPanel>
        <TabPanel header="Incentivo Fiscal" class="col-12">
            <!-- <ManutencaoParceiroDadosEmail v-model="localModelValue.emails"/> -->
        </TabPanel>
    </TabView>
</template>
