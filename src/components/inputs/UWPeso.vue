<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {},
    id: {
        type: String,
        required: true
    },
    autofocus: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
    errors: {
        type: String,
        default: undefined
    },
    classContainer: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    pesagemManual: {
        type: Boolean,
        default: false
    },
    habilitaCapturaAutomatica: {
        type: Boolean,
        default: true
    },
    habilitaPesoManual: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) value = 0;
        if (value !== props.modelValue) {
            emit('update:modelValue', value);
        }
    }
});

const execButton = () => {
    emit('clickButton');
};

const execLancarPesagemManual = () => {
    emit('lancarPesagemManual');
};
</script>

<template>
    <div :class="['field', classContainer]">
        <div class="p-inputgroup">
            <span v-tooltip.top="'Peso informado manualmente'" v-if="props.pesagemManual" class="p-inputgroup-addon" style="background-color: red; color: white">
                <i class="fa-solid fa-triangle-exclamation" style="background-color: red"></i>
            </span>
            <span class="p-float-label">
                <InputNumber :id="id" mode="decimal" :minFractionDigits="0" :maxFractionDigits="0" locale="pt-Br" :disabled="disabled" v-model="localModelValue" :autofocus="autofocus" :class="{ 'w-full': true, 'p-invalid': errors }" v-bind="$attrs" />
                <label :for="id" v-required="required">{{ label }}</label>
            </span>
            <Button icon="fa fa-truck-moving" severity="info" :disabled="!habilitaCapturaAutomatica" @click="execButton" />
            <Button icon="fa fa-pencil" severity="warning" :disabled="!habilitaPesoManual" @click="execLancarPesagemManual" />
        </div>
        <span v-if="errors">
            <span v-for="(error, index) of errors" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>
