<script setup>
import { ref, defineProps, onMounted, onBeforeMount, computed } from 'vue';
import _ from 'lodash';
import { useFormatString } from '@/composables/useFormatString';

const props = defineProps({
    id: {
        type: String,
        required: false
    },
    modelValue: {},
    label: {
        type: String,
        default: ''
    },
    optionLabel: {
        type: String,
        default: ''
    },
    optionValue: {
        type: String,
        default: ''
    },
    sortField: {
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
    service: {
        type: Object,
        required: true
    },
    columnsFilters: {},
    filtersSearch: {
        type: Array,
        default: () => []
    },
    fieldSearchDefault: {
        type: String,
        default: 'nome'
    },
    erros: {},
    classContainer: {},
    disabled: {
        type: Boolean,
        default: false
    },
    visible: {
        type: Boolean,
        default: true
    },
    maxSizeOptions: {
        type: Number,
        default: 100
    },
    maxSizeLabel: {
        type: Number,
        default: 90
    },
    positionTooltip: {
        type: String,
        default: 'top'
    },
    selecaoAutomatica: {
        type: Boolean,
        default: true
    },
    noShowGeneral: {
        type: Boolean,
        default: true
    }
});

const registros = ref([]);
const totalRegistros = ref(0);
const lazyParams = ref({ filters: {} });
const filters = ref();
const valorFiltro = ref();
const filtroAtivo = ref();
const filterSelected = ref({ value: 'Nome' });

const filterSearchAtivo = {
    field: 'nome',
    value: valorFiltro.value,
    matchMode: 'contains',
    tipo: 'text',
    fieldFilter: 'nome',
    labelFilter: 'Nome'
};

const { truncate } = useFormatString();

const montarFiltros = async (forceId) => {
    filters.value = {};
    filters.value[filterSearchAtivo.field] = {
        value: valorFiltro.value,
        matchMode: filterSearchAtivo.matchMode,
        tipo: filterSearchAtivo.tipo,
        fieldFilter: filterSearchAtivo.fieldFilter
    };

    if (valorFiltro.value && valorFiltro.value !== '') filtroAtivo.value = true;

    if (props.columnsFilters && props.columnsFilters.length > 0) {
        props.columnsFilters.forEach((element) => {
            filters.value[element.field] = {
                value: element.value ? element.value : element.tipoField === 'boolean' ? false : '',
                matchMode: element.matchMode,
                tipo: element.tipoField,
                fieldFilter: element.fieldFilter
            };
        });
    }

    if (!_.isEmpty(filters.value)) lazyParams.value.filters = filters.value;
    if (forceId) lazyParams.value.id = forceId;
    else if (props.modelValue && props.modelValue > 0) lazyParams.value.id = props.modelValue;
    else lazyParams.value.id = null;

    lazyParams.value.noShowGeneral = props.noShowGeneral;
};

const getLista = async (forceId) => {
    try {
        await montarFiltros(forceId);
        const data = await props.service.getPageAll(lazyParams.value);
        registros.value = data.registros;
        totalRegistros.value = data.totalRegistros;
        lazyParams.value.page = data.page;
        lazyParams.value.first = data.paginaAtual * data.tamanhoPagina;
        if (!props.modelValue && totalRegistros.value === 1 && props.selecaoAutomatica) {
            localFieldName.value = registros.value[0].id;
            handleChange({ value: registros.value[0].id });
        } else if (forceId) {
            handleChange({ value: forceId });
        }
    } catch {
        registros.value = [];
    }
};

const limparFiltro = async () => {
    filtroAtivo.value = false;
    valorFiltro.value = '';
    lazyParams.value.page = 0;
    lazyParams.value.first = 0;
    await getLista();
};

const onLazyLoad = (event) => {
    if (event) lazyParams.value.first = event.first;
    getLista();
};

const options = ref();

const getConfigFilter = (filterSelected) => {
    const filter = props.filtersSearch.find((element) => element.labelFilter === filterSelected['value']);
    filterSearchAtivo.field = filter.field;
    filterSearchAtivo.matchMode = filter.matchMode;
    filterSearchAtivo.tipo = filter.tipoField;
    filterSearchAtivo.fieldFilter = filter.fieldFilter;
    filterSearchAtivo.labelFilter = filter.labelFilter;
};

const montarOpcoesSearchFilter = () => {
    if (props.filtersSearch.length >= 1) {
        const configParaFieldDefault = _.find(props.filtersSearch, { field: props.fieldSearchDefault });
        filterSelected.value = { value: configParaFieldDefault.labelFilter || props.filtersSearch[0].labelFilter };
        getConfigFilter(filterSelected.value);
    }
    if (props.filtersSearch.length > 1) {
        options.value = [];

        props.filtersSearch.forEach((element) => {
            options.value.push({ value: element.labelFilter });
        });
    }
};
onBeforeMount(() => {
    montarFiltros();
    montarOpcoesSearchFilter();
});

onMounted(() => {
    lazyParams.value = {
        first: 0,
        page: 0,
        rows: 50,
        sortField: props.sortField ? props.sortField : props.optionLabel,
        sortOrder: 1,
        filters: filters.value,
        sortFilter: props.optionLabel
    };
    onLazyLoad();
});

const emit = defineEmits(['update:modelValue', 'change', 'changeObject']);

const localFieldName = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        if (!_.isEqual(newValue, props.modelValue)) {
            emit('update:modelValue', newValue);
            emit('change');
        }
    }
});

const handleChange = (event) => {
    if (event.value !== localFieldName.value) {
        if (event.value === null) {
            lazyParams.value.first = 0;
            lazyParams.value.page = 0;
        }
        const reg = registros.value.find((e) => e.id === event.value);
        emit('changeObject', reg);
    }
};

const changeFilter = () => {
    getConfigFilter(filterSelected.value);
    getLista();
};

const getLabel = (value) => {
    const reg = registros.value.find((item) => item[props.optionValue] === value);
    if (reg) return truncate(reg[props.optionLabel], props.maxSizeLabel);
    else return '';
};

const reload = (id) => {
    getLista(id);
};

defineExpose({
    reload
});
</script>

<template>
    <div v-show="visible" :class="['field', classContainer]">
        <span class="p-float-label">
            <Dropdown
                :id="props.id"
                v-model="localFieldName"
                :options="registros"
                :optionLabel="optionLabel"
                :optionValue="optionValue"
                :placeholder="placeholder"
                class="minimodrop"
                :showClear="true"
                :disabled="disabled"
                :class="{ 'p-invalid': !_.isEmpty(props.erros), 'w-full': true }"
                @before-show="getLista()"
                @change="handleChange"
                v-bind="$attrs"
            >
                <template #header>
                    <div class="col-12 md:col-12">
                        <div class="flex flex-row justify-content-end align-items-end gap-2">
                            <div class="text-600 text-bold text-sm">Pesquisando por:</div>
                            <SelectButton
                                v-if="props.filtersSearch.length > 1"
                                v-model="filterSelected"
                                :options="options"
                                optionLabel="value"
                                aria-labelledby="basic"
                                style="margin-bottom: 0.1rem"
                                cla
                                @change="changeFilter()"
                                :pt="{
                                    button: ({ context }) => ({
                                        class: context.active ? 'bg-blue-100 border-blue-200' : undefined,
                                        style: {
                                            padding: '0.2rem'
                                        }
                                    })
                                }"
                            >
                                <template #option="slotProps">
                                    <span class="text-sm text-600">{{ slotProps.option.value }}</span>
                                </template>
                            </SelectButton>
                            <div v-else class="text-600 text-bold text-sm">{{ filterSearchAtivo.labelFilter }}</div>
                        </div>
                        <div class="p-inputgroup">
                            <InputText size="small" autofocus placeholder="Digite argumento de pesquisa" v-model="valorFiltro" @keypress.enter="getLista()" />
                            <Button v-if="filtroAtivo" icon="pi pi-times" class="bg-red-400" @click.stop="limparFiltro()" />
                            <Button icon="pi pi-search" class="bg-yellow-400" @click.stop="getLista()" />
                        </div>
                    </div>
                </template>

                <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex align-items-center">
                        <slot v-if="$slots.values" name="values" v-bind="slotProps"></slot>
                        <slot v-if="!$slots.values"
                            ><span>{{ getLabel(slotProps.value) }}</span></slot
                        >
                    </div>
                    <span v-else>
                        {{ slotProps.placeholder }}
                    </span>
                </template>

                <template #option="slotProps">
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-wrap: wrap">
                        <div
                            v-if="props.positionTooltip === 'top'"
                            v-tooltip.top="{
                                value: slotProps.option[props.optionLabel],
                                autoHide: true,
                                pt: {
                                    arrow: {
                                        style: {
                                            borderBottomColor: 'var(--primary-color)'
                                        }
                                    },
                                    text: {
                                        class: 'bg-primary-200',
                                        style: 'width: 30rem'
                                    }
                                }
                            }"
                        >
                            <slot v-if="$slots.options" name="options" v-bind="slotProps"></slot>
                            <div v-if="!$slots.options">{{ truncate(slotProps.option[props.optionLabel], props.maxSizeOptions) }}</div>
                        </div>
                        <div
                            v-else-if="props.positionTooltip === 'left'"
                            v-tooltip.left="{
                                value: slotProps.option[props.optionLabel],
                                autoHide: true,
                                pt: {
                                    arrow: {
                                        style: {
                                            borderBottomColor: 'var(--primary-color)'
                                        }
                                    },
                                    text: {
                                        class: 'bg-primary-200',
                                        style: {
                                            width: '30rem',
                                            marginLeft: '-30rem'
                                        }
                                    }
                                }
                            }"
                        >
                            <slot v-if="$slots.options" name="options" v-bind="slotProps"></slot>
                            <div v-if="!$slots.options">{{ truncate(slotProps.option[props.optionLabel], props.maxSizeOptions) }}</div>
                        </div>
                        <div
                            v-else-if="props.positionTooltip === 'right'"
                            v-tooltip="{
                                value: slotProps.option[props.optionLabel],
                                autoHide: true,
                                pt: {
                                    arrow: {
                                        style: {
                                            borderBottomColor: 'var(--primary-color)'
                                        }
                                    },
                                    text: {
                                        class: 'bg-primary-00 text-red',
                                        style: 'width: 30rem'
                                    }
                                }
                            }"
                        >
                            <slot v-if="$slots.options" name="options" v-bind="slotProps"></slot>
                            <div v-if="!$slots.options">{{ truncate(slotProps.option[props.optionLabel], props.maxSizeOptions) }}</div>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <Paginator :rows="lazyParams.rows" :totalRecords="totalRegistros" :first="lazyParams.first" @page="onLazyLoad($event)"></Paginator>
                </template>
            </Dropdown>
            <label :for="props.id" v-required="props.required">{{ props.label }}</label>
        </span>
        <span v-if="props.erros">
            <span id="id-error" v-for="(error, index) of props.erros" :key="index">
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
