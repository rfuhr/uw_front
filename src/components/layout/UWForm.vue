<script setup>
import { ref, watch, computed, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    schema: {
        type: Object,
        required: true
    },
    values: {
        type: Object,
        required: false
    },
    validFieldOnChange: {
        required: false,
        type: Boolean,
        default: true
    },
    visibleSave: {
        type: Boolean,
        required: false,
        default: true
    },
    visibleCancel: {
        type: Boolean,
        required: false,
        default: true
    },
    labelConfirmar: {
        type: String,
        default: 'Confirmar'
    },
    visibleVoltar: {
        type: Boolean,
        required: false,
        default: false
    },
    visibleConfirmar: {
        type: Boolean,
        required: false,
        default: false
    },
    beforeSubmit: {
        type: Function,
        required: false
    }
});

const toast = useToast();

const emit = defineEmits(['doSubmit', 'doCancel', 'handleErrorSubmit']);
const submitted = ref(false);
const errors = reactive({});

// eslint-disable-next-line no-unused-vars
const validate = (field) => {
    return props.schema
        .validateAt(field, props.values)
        .then(() => {
            errors.value[field] = '';
        })
        .catch((err) => {
            errors.value[field] = err.message;
        });
};

const validateForm = () => {
    errors.value = {};
    return props.schema
        .validate(props.values, { abortEarly: false })
        .then(() => {
            return true;
        })
        .catch((err) => {
            err.inner.forEach((error) => {
                errors.value[error.path] = error.message;
            });
            return false;
        });
};

const handleSubmit = async () => {
    if (props.beforeSubmit) {
        await props.beforeSubmit();
    }
    submitted.value = true;
    if (await validateForm()) {
        emit('doSubmit', props.values);
    } else {
        toast.add({ severity: 'warn', summary: 'Atenção', detail: 'Regras de campos não atendidas.', life: 5000 });
        emit('handleErrorSubmit');
    }
};

const hasErrors = computed(() => {
    for (const key in errors) {
        if (errors.value[key]) {
            return true;
        }
    }
    return false;
});

const isValid = () => {
    return !hasErrors.value;
};

defineExpose({
    validateForm,
    isValid
});

const handleCancel = () => {
    emit('doCancel');
};

const handleVoltar = () => {
    emit('doVoltar');
};

watch(props.values, () => {
    if (submitted.value) validateForm();
});

const preventEnterSubmit = (event) => {
    // Este método será chamado quando a tecla "Enter" for pressionada em qualquer campo de entrada do formulário.
    // Você pode adicionar lógica aqui, como impedir que o evento de envio padrão ocorra.
    event.preventDefault();
};
</script>

<template>
    <form @submit.prevent="handleSubmit()" novalidate @keydown.enter.prevent="preventEnterSubmit">
        <slot name="errors" :errors="errors">
            <slot />
        </slot>

        <div class="col-12">
            <Divider />
            <div class="flex justify-content-end flex-wrap gap-2">
                <slot name="buttons" />
                <Button v-if="visibleCancel" label="Cancelar" icon="pi pi-times" class="p-button-secondary" outlined @click="handleCancel()" />
                <Button v-if="visibleVoltar" label="Voltar" icon="pi pi-replay" class="p-button-help" outlined @click="handleVoltar()" />
                <Button v-if="visibleSave" type="submit" label="Salvar" icon="pi pi-save" :disabled="!isValid()" />
                <Button v-if="visibleConfirmar" type="submit" :label="props.labelConfirmar" style="color: var(--teal-600);" outlined icon="pi pi-check" :disabled="!isValid()" />
            </div>
        </div>
    </form>
</template>
