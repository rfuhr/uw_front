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
    maximoDigitos: {
        type: Number,
        default: 2
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (!value) value = 0;
        emit('update:modelValue', value);
        emit('onChange');
    }
});
</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <InputNumber :id="id" mode="decimal" :minFractionDigits="2" :maxFractionDigits="maximoDigitos" locale="pt-Br" :disabled="disabled" v-model="localModelValue" :autofocus="autofocus" :class="{ 'w-full': true, 'p-invalid': errors }" v-bind="$attrs" />
            <label :for="id" v-required="required">{{ label }}</label>
        </span>
        <span v-if="errors">
            <span v-for="(error, index) of errors" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>
