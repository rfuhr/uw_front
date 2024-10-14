<script setup>
import { ref, computed, onMounted  } from 'vue';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import _ from 'lodash';
import ManutencaoParceiroDados from './ManutencaoParceiroDados.vue';
import { TiposService } from '@/service';

const props = defineProps({
    modelValue: {},
    errors: {}
});

const emit = defineEmits(['update:modelValue']);
const confirm = useConfirm();
const toast = useToast();
const indicadoresIEDestinatario = ref([]);

const localModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});

const adicionarFilial = () => {
    localModelValue.value.push({
        dadosPessoaFisica: {},
        dadosPessoaJuridica: {},
        enderecos: [],
        telefones: [],
        emails: []
    });
};

const formatCnpj = (cnpj) => {
    if (cnpj) {
        const cleanedCnpj = cnpj.replace(/[^\d]/g, '');
        const match = cleanedCnpj.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);

        if (match) {
            return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
        }
    }
    return cnpj;
};

const removerFilial = (event, data) => {
    confirm.require({
        target: event.currentTarget,
        message: 'Deseja excluir este registro?',
        icon: 'pi pi-info-circle',
        rejectClass: 'p-button-secondary p-button-outlined p-button-sm',
        acceptClass: 'p-button-danger p-button-sm',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Excluir',
        accept: () => {
            localModelValue.value = localModelValue.value.filter((item) => item !== data);
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Filial removida com sucesso', life: 5000 });
        },
        reject: () => {

        }
    });
};

const onChangeIndicadorIE = (event, index) => {
    if (event.value !== '1') {
        localModelValue.value[index].dadosPessoaJuridica.inscricaoEstadual = '';
    }
};
onMounted(async () => {
    TiposService.getIndicadorIEDestinatario().then((data) => {
        indicadoresIEDestinatario.value = data;
    });
});

</script>

<template>
        <Toolbar>
            <template #start>
                <div>
                    <Button label="Adicionar Filial" icon="pi pi-plus" class="p-button-success p-button-outlined mb-0 p-button-sm" @click="adicionarFilial()" />
                </div>
            </template>
        </Toolbar>
        <Accordion :activeIndex="0" v-if="localModelValue.length > 0">
            <AccordionTab v-for="(local, index) in localModelValue" :key="index">
                <template #header>
                    <span class="flex align-items-center gap-2 w-full">
                        <span class="font-bold white-space-nowrap">Filial: {{ local.nomeLocal }} - {{ formatCnpj(local.cpfCnpj) }}</span>
                    </span>
                </template>
                <div class="p-fluid formgrid grid">
                    <UWInputMask id="cnpj" label="Cnpj" mask="99.999.999/9999-99" required v-model="local.cpfCnpj" :errors="_.get(errors.value, `locais[${index}].cpfCnpj`, null)" classContainer="col-12 md:col-2" />
                    <UWInput id="nomeLocal" label="Identificação da Filial" uppercase required autofocus v-model="local.nomeLocal" :errors="_.get(errors.value, `locais[${index}].nomeLocal`, null)" classContainer="col-12 md:col-2" />
                    <UWPickList
                                    id="indicadorIE"
                                    label="Indicador IE Destinatário"
                                    v-model="local.dadosPessoaJuridica.indicadorIE"
                                    optionLabel="name"
                                    optionValue="value"
                                    required
                                    :options="indicadoresIEDestinatario"
                                    classContainer="col-12 md:col-2"
                                    :errors="_.get(errors.value, `locais[${index}].dadosPessoaJuridica.indicadorIE`, null)"
                                    @changeObject="onChangeIndicadorIE($event, index)"
                                />
                    <UWInput
                        id="nomeLocal"
                        label="Inscrição Estadual"
                        uppercase
                        autofocus
                        :disabled="local.dadosPessoaJuridica.indicadorIE !== '1'"
                        :required="local.dadosPessoaJuridica.indicadorIE === '1'"
                        v-model="local.dadosPessoaJuridica.inscricaoEstadual"
                        :errors="_.get(errors.value, `locais[${index}].dadosPessoaJuridica.inscricaoEstadual`, null)"
                        classContainer="col-12 md:col-2"
                    />
                    <UWCalendar id="dataFundacao" label="Data de Fundação" v-model="local.dadosPessoaJuridica.dataFundacao" :errors="_.get(errors.value, `locais[${index}].dadosPessoaJuridica.dataFundacao`, null)" classContainer="col-12 md:col-2" />
                    <UWInput id="suframa" label="Inscrição Suframa" v-model="local.dadosPessoaJuridica.suframa" classContainer="col-12 md:col-2" />
                    <ManutencaoParceiroDados :modelValue="local" @update:modelValue="local = $event" />
                    <Button label="Remover Filial" class="col-2 ml-auto mr-4" severity="danger" raised aria-label="Cancel" @click="removerFilial($event, local)"/>
                </div>
            </AccordionTab>
        </Accordion>
</template>
