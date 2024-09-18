<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || { selecionaPesagem: false },
    set: (value) => {
        emit('update:modelValue', value);
    }
});

onMounted(async () => {
});

</script>

<template>
    <div class="formgrid grid pt-0">
        <div class="field md:col-4 pt-0">
            <span class="p-float-label">
                <ToggleButton
                    v-model="localModelValue.selecionaPesagem"
                    onLabel="Seleciona na Pesagem"
                    offLabel="NÃO Seleciona na Pesagem"
                    onIcon="pi pi-lock"
                    offIcon="pi pi-lock-open"
                    class="w-full"
                    aria-label="Do you confirm"
                    :pt="{
                        root: {
                            class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.informaLocalEstoque, 'bg-red-100 border-white': !localModelValue.informaLocalEstoque }]
                        }
                    }"
                />
            </span>
        </div>  
    </div>
</template>
