<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {},
    id: {
        type: String,
        required: true
    },
    onLabel: {
        type: String,
        default: 'Ativo'
    },
    offLabel: {
        type: String,
        default: 'Inativo'
    },
    onIcon : {
        type: String,
        default: 'pi pi-lock-open'
    },
    offIcon : {
        type: String,
        default: 'pi pi-lock'
    },
    classContainer: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    onColor: {
        type: String,
        default: 'rgb(215, 243, 215)'
    }, 
    offColor: {
        type: String,
        default: '#e9cdf7'
    }
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
            <ToggleButton
                v-model="localModelValue"
                :onLabel="onLabel"
                :offLabel="offLabel"
                :onIcon="onIcon"
                :offIcon="offIcon"
                class="w-full"
                :pt="{
                  box: {
                    style: {
                        'background-color': localModelValue ? onColor : offColor
                    }
                  }
                }"
            />
        </span>
    </div>
</template>

