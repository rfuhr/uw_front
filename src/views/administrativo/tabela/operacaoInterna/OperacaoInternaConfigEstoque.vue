<script setup>
import { ref, computed, onMounted } from 'vue';
import { TiposService, LocalEstoqueService, GrupoContabilService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || { informaLocalEstoque: false },
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const operacaoEstoque = ref([]);

onMounted(async () => {
    TiposService.getOperacaoEstoque().then((data) => {
        operacaoEstoque.value = data;
    });
});

const changeInformaLocalEstoque = async () => {
    if (localModelValue.value.informaLocalEstoque) {
        localModelValue.value.localEstoqueId = undefined;
    }
}

const changeInformaGrupoContabil = async () => {
    if (localModelValue.value.informaGrupoContabil) {
        localModelValue.value.grupoContabilId = undefined;
    }
}

</script>

<template>
    <div class="formgrid grid pt-0">
        <UWPickList id="operacaoEstoqueFisico" label="Operação Estoque Físico" v-model="localModelValue.operacaoEstoqueFisico" optionLabel="name" optionValue="value" required :options="operacaoEstoque" classContainer="col-12 md:col-6" />
        <UWPickList id="operacaoEstoqueFinanceiro" label="Operação Estoque Financeiro" v-model="localModelValue.operacaoEstoqueFinanceiro" optionLabel="name" optionValue="value" required :options="operacaoEstoque" classContainer="col-12 md:col-6" />
        <div class="field md:col-4 pt-0">
            <span class="p-float-label">
                <ToggleButton
                    v-model="localModelValue.informaLocalEstoque"
                    onLabel="Informa Local do Estoque"
                    offLabel="NÃO Informa Local do Estoque"
                    onIcon="pi pi-lock"
                    offIcon="pi pi-lock-open"
                    class="w-full"
                    aria-label="Do you confirm"
                    @change="changeInformaLocalEstoque"
                    :pt="{
                        root: {
                            class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.informaLocalEstoque, 'bg-red-100 border-white': !localModelValue.informaLocalEstoque }]
                        }
                    }"
                />
            </span>
        </div>  
        <div class="field md:col-4 pt-0">
            <span class="p-float-label">
                <ToggleButton
                    v-model="localModelValue.informaGrupoContabil"
                    onLabel="Informa Grupo Contábil"
                    offLabel="NÃO Informa Grupo Contábil"
                    onIcon="pi pi-lock"
                    offIcon="pi pi-lock-open"
                    class="w-full"
                    aria-label="Do you confirm"
                    @change="changeInformaGrupoContabil"
                    :pt="{
                        root: {
                            class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.informaGrupoContabil, 'bg-red-100 border-white': !localModelValue.informaGrupoContabil }]
                        }
                    }"
                />
            </span>
        </div>  
        <div class="field md:col-4 pt-0">
            <span class="p-float-label">
                <ToggleButton
                    v-model="localModelValue.calculaCustoMedio"
                    onLabel="Calcular Custo Médio"
                    offLabel="NÃO Calcular Custo Médio"
                    onIcon="pi pi-lock"
                    offIcon="pi pi-lock-open"
                    class="w-full"
                    aria-label="Do you confirm"
                    :pt="{
                        root: {
                            class: [{ 'h-full': true, 'bg-green-100 border-white': localModelValue.calculaCustoMedio, 'bg-red-100 border-white': !localModelValue.calculaCustoMedio }]
                        }
                    }"
                />
            </span>
        </div>  
        <UWSeletor
                classContainer="col-12 md:col-6"
                v-model="localModelValue.localEstoqueId"
                optionLabel="nome"
                optionValue="id"
                :disabled="localModelValue.informaLocalEstoque"
                label="Local do Estoque"
                :service="LocalEstoqueService"
                placeholder="Selecione o Local do Estoque"
                :erros="errors?.value?.localEstoqueId"
        />        
        <UWSeletor
                classContainer="col-12 md:col-6"
                v-model="localModelValue.grupoContabilId"
                optionLabel="nome"
                optionValue="id"
                :disabled="localModelValue.informaGrupoContabil"
                label="Grupo Contábil"
                :service="GrupoContabilService"
                placeholder="Selecione o Grupo Contábil"
                :erros="errors?.value?.grupoContabilId"
        />        
    </div>
</template>
