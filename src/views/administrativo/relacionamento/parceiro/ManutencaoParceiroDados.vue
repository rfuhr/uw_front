<script setup>
import { computed } from 'vue';
import ManutencaoParceiroDadosEndereco from './ManutencaoParceiroDadosEndereco.vue';
import ManutencaoParceiroDadosTelefone from './ManutencaoParceiroDadosTelefone.vue';
import ManutencaoParceiroDadosEmail from './ManutencaoParceiroDadosEmail.vue';
import ManutencaoParceiroDadosPropriedade from './ManutencaoParceiroDadosPropriedade.vue';

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
        <TabPanel header="Endereços" class="col-12">
            <ManutencaoParceiroDadosEndereco v-model="localModelValue.enderecos"/>
        </TabPanel>
        <TabPanel header="Telefones" class="col-12">
            <ManutencaoParceiroDadosTelefone v-model="localModelValue.telefones"/>
        </TabPanel>
        <TabPanel header="Emails" class="col-12">
            <ManutencaoParceiroDadosEmail v-model="localModelValue.emails"/>
        </TabPanel>
        <TabPanel header="Propriedades" class="col-12">
            <ManutencaoParceiroDadosPropriedade v-model="localModelValue.propriedades"/>
        </TabPanel>
    </TabView>
</template>
