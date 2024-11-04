<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        required: false
    },
    minHeight: {
        type: String,
        default: null // Sem valor padrão
    }
});
</script>

<template>
    <div class="grid">
        <!-- <AppBreadCrumb></AppBreadCrumb> -->
        <div class="col-12">
            <div class="card" :style="{ minHeight: minHeight || '' }">
                <h5>{{ title }}</h5>
                <p v-if="subtitle">{{ subtitle }}</p>
                <slot />
            </div>
        </div>
    </div>
    <Toast></Toast>
</template>