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
    mask: {
        type: String,
        default: ''
    },
    unmask: {
        type: Boolean,
        default: true
    },
    placeholder: {
        type: String,
        default: ''
    },
    showButton: {
        type: Boolean,
        default: false
    },
    iconButton: {
        type: String,
        default: 'pi pi-bolt'
    }
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        if (value !== props.modelValue) {
            emit('update:modelValue', value);
        }
    }
});

const execButton = () => {
    emit('clickButton');
};
</script>

<template>
    <div :class="['field', classContainer]">
        <div class="p-inputgroup">
            <span class="p-float-label">
                <InputMask :id="id" :mask="mask" :unmask="unmask" :placeholder="placeholder" :disabled="disabled" v-model="localModelValue" :autofocus="autofocus" :class="{ 'w-full': true, 'p-invalid': errors }" v-bind="$attrs" />
                <label :for="id" v-required="required">{{ label }}</label>
            </span>
            <Button v-show="showButton" :icon="iconButton" severity="help" @click.stop="execButton" />
        </div>
        <span v-if="errors">
            <span v-for="(error, index) of errors" :key="index">
                <small class="p-error">{{ error }}</small>
            </span>
        </span>
    </div>
</template>
