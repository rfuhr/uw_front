<script setup>
import { computed } from 'vue';
import _ from 'lodash';
import { SexoService, NacionalidadeService, EstadoCivilService, ProfissaoService } from '@/service';
import ManutencaoParceiroDados from './ManutencaoParceiroDados.vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});

const emit = defineEmits(['update:modelValue']);

const localModelValue = computed({
    get: () => props.modelValue || {dadosPessoaFisica: {}},
    set: (value) => {
        emit('update:modelValue', value);
    }
});
</script>

<template>
    <UWFieldSet title="Informações Pessoais" class="col-12">
        <div class="p-fluid formgrid grid">
            <UWInput id="RG" label="Documento de Identificação" required v-model="localModelValue.dadosPessoaFisica.rg" :errors="_.get(errors.value, `locais[0].dadosPessoaFisica.rg`, null)" classContainer="col-12 md:col-3" />
            <UWCalendar id="dataNascimento" label="Data de Nascimento" required v-model="localModelValue.dadosPessoaFisica.dataNascimento" :errors="_.get(errors.value, `locais[0].dadosPessoaFisica.dataNascimento`, null)" classContainer="col-12 md:col-3" />
            <UWSeletor
                classContainer="col-12 md:col-3"
                v-model="localModelValue.dadosPessoaFisica.sexoId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Sexo"
                :service="SexoService"
                placeholder="Selecione o sexo"
                :erros="_.get(errors.value, `locais[0].dadosPessoaFisica.sexoId`, null)"
            />
            <UWSeletor
                classContainer="col-12 md:col-3"
                v-model="localModelValue.dadosPessoaFisica.nacionalidadeId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Nacionalidade"
                :service="NacionalidadeService"
                placeholder="Selecione a nacionalidade"
                :erros="_.get(errors.value, `locais[0].dadosPessoaFisica.nacionalidadeId`, null)"
            />
            <UWSeletor
                classContainer="col-12 md:col-3"
                v-model="localModelValue.dadosPessoaFisica.profissaoId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Profissão"
                :service="ProfissaoService"
                placeholder="Selecione a profissão"
                :erros="_.get(errors.value, `locais[0].dadosPessoaFisica.profissaoId`, null)"
            />
            <UWSeletor
                classContainer="col-12 md:col-3"
                v-model="localModelValue.dadosPessoaFisica.estadoCivilId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Estado Civil"
                :service="EstadoCivilService"
                placeholder="Selecione o estado civil"
                :erros="_.get(errors.value, `locais[0].dadosPessoaFisica.estadoCivilId`, null)"
            />
        </div>
        <ManutencaoParceiroDados v-model="localModelValue" />
    </UWFieldSet>
</template>
