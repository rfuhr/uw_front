<script setup>
import { defineProps, computed } from 'vue';
import _ from 'lodash'

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
    placeholder: {
        type: String,
        default: ''
    },
    required: {
        type: Boolean,
        default: false
    },
    showClear: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array,
        required: true
    },
    optionLabel: {
        type: String,
        default: ''
    },
    optionValue: {
        type: String,
        default: ''
    },
    errors: {},
    classContainer: {},
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'change', 'changeObject']);

const localFieldName = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        if (!_.isEqual(newValue, props.modelValue)) {
            console.log("NewValue ", newValue, "OldValue", props.modelValue)
            emit('update:modelValue', newValue);
            emit('change');
        }
    }
});

const handleChange = (event) => {
    const reg = props.options.find(e => e[props.optionValue] === event.value)
    emit('changeObject', reg);
}

</script>

<template>
    <div :class="['field', classContainer]">
        <span class="p-float-label">
            <Dropdown
                :id="props.id"
                v-model="localFieldName"
                :options="options"
                :optionLabel="optionLabel"
                :optionValue="optionValue"
                :placeholder="placeholder"
                class="minimodrop"
                :showClear="showClear"
                :disabled="disabled"
                :class="{ 'p-invalid': props.errors, 'w-full': true }"
                @change="handleChange"
            >

            </Dropdown>
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
::v-deep(.minimodrop .p-dropdown-items-wrapper) {
    min-height: 200px;
}
</style>
