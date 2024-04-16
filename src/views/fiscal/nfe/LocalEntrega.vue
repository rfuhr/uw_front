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
const localEntregaModelValue = computed({
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
    if (localEntregaModelValue.value.cep) {
        try {
            const enderecoEncontrado = await ExternalService.getEnderecoByCep(localEntregaModelValue.value.cep);
            if (enderecoEncontrado) {
                localEntregaModelValue.value.endereco = enderecoEncontrado.logradouro;
                localEntregaModelValue.value.numero = '';
                localEntregaModelValue.value.complemento = '';
                localEntregaModelValue.value.bairro = enderecoEncontrado.bairro;

                UfService.getUfBySigla(enderecoEncontrado.uf).then((uf) => {
                    localEntregaModelValue.value.ufId = uf.id;
                    CidadeService.getCidadeByIbge(enderecoEncontrado.ibge * 1).then((cidade) => {
                        localEntregaModelValue.value.cidadeId = cidade.id;
                        emit('update:modelValue', localEntregaModelValue.value);
                        seletorCidade.value.reload(cidade.id);
                    });
                });
            }
        } catch (error) {
            /* empty */
        }
    }
};
</script>

<template>
    <div class="col-12">
        <div class="p-fluid formgrid grid">
            <UWPickList id="tipoPessoa" label="Tipo Pessoa" v-model="localEntregaModelValue.tipoPessoa" optionLabel="name" optionValue="value" required :options="tiposPessoa" classContainer="col-12 md:col-2" @change="changeTipoPessoa()" />
            <UWInputMask
                id="cnpj"
                v-if="!localEntregaModelValue.tipoPessoa || localEntregaModelValue.tipoPessoa === 'J'"
                label="Cnpj"
                mask="99.999.999/9999-99"
                required
                autofocus
                v-model="localEntregaModelValue.cnpj"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localEntrega.cnpj`, null)"
            />
            <UWInputMask
                id="cnpj"
                v-if="localEntregaModelValue.tipoPessoa === 'F'"
                label="Cpf"
                mask="999.999.999-99"
                required
                autofocus
                v-model="localEntregaModelValue.cpf"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localEntrega.cpf`, null)"
            />
            <UWInput
                id="razaoSocial"
                :label="!localEntregaModelValue.tipoPessoa || localEntregaModelValue.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'"
                uppercase
                required
                v-model="localEntregaModelValue.nomeRazaoSocial"
                :classContainer="['col-12', localEntregaModelValue.tipoPessoa === 'J' ? 'md:col-6' : 'md:col-8']"
                :errors="_.get(props.errors.value, `localEntrega.nomeRazaoSocial`, null)"
            />
            <UWInput
                v-if="!localEntregaModelValue.tipoPessoa || localEntregaModelValue.tipoPessoa === 'J'"
                id="inscricaoEstadual"
                label="Inscrição Estadual do Recebedor"
                uppercase
                v-model="localEntregaModelValue.inscricaoEstadual"
                classContainer="col-12 md:col-2"
            />
            <UWInputMask
                id="cep"
                label="Cep"
                :mask="'99.999-999'"
                required
                :unmask="true"
                v-model="localEntregaModelValue.cep"
                :showButton="true"
                @clickButton="buscarEndereco"
                classContainer="col-12 md:col-2"
                :errors="_.get(props.errors.value, `localEntrega.cep`, null)"
            />
            <UWInput id="endereco" label="Logradouro" uppercase required autofocus v-model="localEntregaModelValue.endereco" classContainer="col-12 md:col-10" :errors="_.get(props.errors.value, `localEntrega.endereco`, null)" />
            <UWInput id="numero" label="Número" uppercase required autofocus v-model="localEntregaModelValue.numero" classContainer="col-12 md:col-2" :errors="_.get(props.errors.value, `localEntrega.numero`, null)" />
            <UWInput id="complemento" label="Complemento" uppercase autofocus v-model="localEntregaModelValue.complemento" classContainer="col-12 md:col-4" />
            <UWInput id="bairro" label="Bairro" uppercase required autofocus v-model="localEntregaModelValue.bairro" classContainer="col-12 md:col-6" :errors="_.get(props.errors.value, `localEntrega.bairro`, null)" />
            <UWSeletor
                id="pais"
                classContainer="col-12 md:col-3"
                v-model="localEntregaModelValue.paisId"
                optionLabel="nome"
                optionValue="id"
                required
                label="País"
                :service="PaisService"
                placeholder="Selecione o pais"
                :erros="_.get(props.errors.value, `localEntrega.paisId`, null)"
            />
            <UWSeletor
                id="uf"
                classContainer="col-12 md:col-3"
                v-model="localEntregaModelValue.ufId"
                optionLabel="nome"
                optionValue="id"
                required
                label="UF"
                :service="UfService"
                placeholder="Selecione a uf"
                :erros="_.get(props.errors.value, `localEntrega.ufId`, null)"
            />
            <UWSeletor
                id="cidade"
                ref="seletorCidade"
                classContainer="col-12 md:col-6"
                v-model="localEntregaModelValue.cidadeId"
                optionLabel="nome"
                optionValue="id"
                required
                label="Cidade"
                :service="CidadeService"
                placeholder="Selecione a cidade"
                :columnsFilters="[{ field: 'uf', value: localEntregaModelValue.ufId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'uf.id' }]"
                :erros="_.get(props.errors.value, `localEntrega.cidadeId`, null)"
            />
        </div>
    </div>
</template>
