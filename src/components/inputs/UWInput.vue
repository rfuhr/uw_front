<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {},
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'text'
    },
    uppercase: {
        type: Boolean,
        default: false
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
        default: null
    },
    errors: {
        type: String,
        default: undefined
    },
    classContainer: {
        type: [String, Array],
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    lowercase: {
        type: Boolean,
        default: false
    },
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
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <InputText :id="id" :type="type" v-uppercase="uppercase" v-lowercase="lowercase" :disabled="disabled" v-model="localModelValue" :autofocus="autofocus" :class="{ 'w-full': true, 'p-invalid': errors }" v-bind="$attrs"/>
            <label :for="id" v-required="required" v-if="props.label">{{ label }}</label>
        </span>
        <span v-if="errors">
            <span v-for="(error, index) of errors" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>
