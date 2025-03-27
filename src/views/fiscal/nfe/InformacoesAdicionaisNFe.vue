<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    visualizacao: {
        type: Boolean,
        required: true,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {},
    set: (value) => {
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <div>
        <UWForm :values="localModelValue" ref="formInformacoesAdicionaisNFe" :visibleSave="false" :visibleCancel="false">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Informações Adicionais" class="h-full">
                            <div class="formgrid grid">
                                <UWTextArea id="infoAdicionaisComplementares" :disabled="visualizacao" v-model="localModelValue.infoAdicionaisComplementares" label="Informações Complementares" uppercase classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </div>
</template>