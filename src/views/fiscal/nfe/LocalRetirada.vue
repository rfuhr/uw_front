<script setup>
import { ref, computed } from 'vue';
import _ from 'lodash';
import { PaisService, UfService, CidadeService, ExternalService } from '@/service';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    errors: {}
});
const emit = defineEmits(['update:modelValue']);
const localRetiradaModelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
    }
});
const seletorCidade = ref(null)

const tiposPessoa = ref([
    { name: 'Física', value: 'F' },
    { name: 'Jurídica', value: 'J' }
    // { name: 'Exterior', value: 'EX' }
]);

const buscarEndereco = async () => {
    if (localRetiradaModelValue.value.cep) {
        try {
            const enderecoEncontrado = await ExternalService.getEnderecoByCep(localRetiradaModelValue.value.cep);
            if (enderecoEncontrado) {
                localRetiradaModelValue.value.endereco = enderecoEncontrado.logradouro;
                localRetiradaModelValue.value.numero = '';
                localRetiradaModelValue.value.complemento = '';
                localRetiradaModelValue.value.bairro = enderecoEncontrado.bairro;

                UfService.getUfBySigla(enderecoEncontrado.uf).then((uf) => {
                    localRetiradaModelValue.value.ufId = uf.id;
                    CidadeService.getCidadeByIbge(enderecoEncontrado.ibge * 1).then((cidade) => {
                        localRetiradaModelValue.value.cidadeId = cidade.id;
                        emit('update:modelValue', localRetiradaModelValue.value);
                        seletorCidade.value.reload(cidade.id);
                    });
                });
            }
        } catch (error) { /* empty */ }
    }
};
</script>

<template>
    <div class="col-12">
        <div class="p-fluid formgrid grid">
            <UWPickList id="tipoPessoa" label="Tipo Pessoa" v-model="localRetiradaModelValue.tipoPessoa" optionLabel="name" optionValue="value" required :options="tiposPessoa" classContainer="col-12 md:col-2" @change="changeTipoPessoa()" />
            <UWInputMask
                id="cnpj"
                v-if="!localRetiradaModelValue.tipoPessoa || localRetiradaModelValue.tipoPessoa === 'J'"
                label="Cnpj"
                mask="99.999.999/9999-99"
                required
                autofocus
                v-model="localRetiradaModelValue.cnpj"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localRetirada.cnpj`, null)"
            />
            <UWInputMask
                id="cnpj"
                v-if="localRetiradaModelValue.tipoPessoa === 'F'"
                label="Cpf"
                mask="999.999.999-99"
                required
                autofocus
                v-model="localRetiradaModelValue.cpf"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localRetirada.cpf`, null)"
            />
            <UWInput
                id="razaoSocial"
                :label="!localRetiradaModelValue.tipoPessoa || localRetiradaModelValue.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'"
                uppercase
                required
                v-model="localRetiradaModelValue.nomeRazaoSocial"
                :classContainer="['col-12', localRetiradaModelValue.tipoPessoa === 'J' ? 'md:col-6' : 'md:col-8']"
                :errors="_.get(props.errors.value, `localRetirada.nomeRazaoSocial`, null)"
            />
            <UWInput
                v-if="!localRetiradaModelValue.tipoPessoa || localRetiradaModelValue.tipoPessoa === 'J'"
                id="inscricaoEstadual"
                label="Inscrição Estadual do Expedidor"
                uppercase
                required
                v-model="localRetiradaModelValue.inscricaoEstadual"
                classContainer="col-12 md:col-2"
            />
            <UWInputMask
                id="cep"
                label="Cep"
                :mask="'99.999-999'"
                required
                :unmask="true"
                v-model="localRetiradaModelValue.cep"
                :showButton="true"
                @clickButton="buscarEndereco"
                iconButton="pi pi-search"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localRetirada.cep`, null)"
            />
            <UWInput id="endereco" label="Logradouro" uppercase required autofocus v-model="localRetiradaModelValue.endereco" classContainer="col-12 md:col-10" :errors="_.get(props.errors.value, `localRetirada.endereco`, null)" />
            <UWInput id="numero" label="Número" uppercase required autofocus v-model="localRetiradaModelValue.numero" classContainer="col-12 md:col-2" :errors="_.get(props.errors.value, `localRetirada.numero`, null)" />
            <UWInput id="complemento" label="Complemento" uppercase autofocus v-model="localRetiradaModelValue.complemento" classContainer="col-12 md:col-4" />
            <UWInput id="bairro" label="Bairro" uppercase required autofocus v-model="localRetiradaModelValue.bairro" classContainer="col-12 md:col-6" :errors="_.get(props.errors.value, `localRetirada.bairro`, null)" />
            <UWSeletor
                id="pais"
                classContainer="col-12 md:col-3"
                v-model="localRetiradaModelValue.paisId"
                optionLabel="nome"
                optionValue="id"
                required
                label="País"
                :service="PaisService"
                placeholder="Selecione o pais"
                :erros="_.get(props.errors.value, `localRetirada.paisId`, null)"
            />
            <UWSeletor
                id="uf"
                classContainer="col-12 md:col-3"
                v-model="localRetiradaModelValue.ufId"
                optionLabel="nome"
                optionValue="id"
                required
                label="UF"
                :service="UfService"
                placeholder="Selecione a uf"
                :erros="_.get(props.errors.value, `localRetirada.ufId`, null)"
            />
            <UWSeletor
                id="cidade"
                ref="seletorCidade"
                classContainer="col-12 md:col-6"
                v-model="localRetiradaModelValue.cidadeId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Cidade"
                :service="CidadeService"
                placeholder="Selecione a cidade"
                :columnsFilters="[{ field: 'uf', value: localRetiradaModelValue.ufId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'uf.id' }]"
                :erros="_.get(props.errors.value, `localRetirada.cidadeId`, null)"
            />
            <UWInputMask
                id="telefone"
                label="Telefone"
                :mask="'(99) 99999-9999'"
                required
                :unmask="true"
                v-model="localRetiradaModelValue.telefone"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localRetirada.telefone`, null)"
            />
            <UWInput id="email" label="Email" type="email" required lowercase autofocus v-model="localRetiradaModelValue.email" classContainer="col-12 md:col-10" :errors="_.get(props.errors.value, `localRetirada.email`, null)" />
        </div>
    </div>
</template>
