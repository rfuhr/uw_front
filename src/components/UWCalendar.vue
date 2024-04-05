<script setup>
import { defineProps, computed } from 'vue';
import { parseISO, isValid } from 'date-fns';
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    modelValue: {},
    label: {
        type: String,
        default: ''
    },
    dateFormat: {
        type: String,
        default: 'dd/mm/yy'
    },
    required: {
        type: Boolean,
        default: false
    },
    showTime: {
        type: Boolean,
        default: false
    },
    errors: {},
    classContainer: {},
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const localFieldName = computed({
    get: () => isValid(props.modelValue) ? props.modelValue : (props.modelValue ? parseISO(props.modelValue) : props.modelValue),
    set: (value) => {
        console.log('value', value);
        emit('update:modelValue', value);
    }
});

</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <Calendar :id="props.id" v-model="localFieldName" :dateFormat="props.dateFormat" :showTime="props.showTime" hourFormat="24" :class="{ 'w-full': true, 'p-invalid': props.errors }" :disabled="props.disabled" v-bind="$attrs"/>
            <label :for="props.id" v-required="props.required">{{ props.label }}</label>
        </span>
        <span v-if="props.errors">
            <span id="id-error" v-for="(error, index) of props.errors" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>

<style lang="scss" scoped>
</style>
