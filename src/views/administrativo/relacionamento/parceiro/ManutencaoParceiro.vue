<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import { validateCPF, validateCNPJ } from 'validations-br';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { ParceiroService } from '@/service';

import ManutencaoParceiroPessoaJuridica from './ManutencaoParceiroPessoaJuridica.vue';
import ManutencaoParceiroPessoaFisica from './ManutencaoParceiroPessoaFisica.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const idParceiro = ref();
const tiposPessoa = ref([
    { name: 'Física', value: 'F' },
    { name: 'Juridíca', value: 'J' }
    // { name: 'Exterior', value: 'EX' }
]);

const formData = reactive({
    tipoPessoa: 'J',
    raizCnpjCpf: '',
    nomeRazaoSocial: '',
    nomeFantasia: '',
    locais: []
});

const createSchemaRaizCnpjCpf = () => {
    if (formData.tipoPessoa === 'F') {
        return yup
            .string()
            .required('CPF é obrigatório.')
            .test('is-cpf', 'CPF inválido.', (value) => {
                return value === '' || validateCPF(value);
            });
    }
    if (formData.tipoPessoa === 'J') {
        return yup.string().required('Raiz CNPJ é obrigatório.').length(8, 'Raiz CNPJ deve ter 8 dígitos.');
    }
    if (formData.tipoPessoa === 'EX') {
        return yup.string();
    }
};

const createLocalSchema = () => {
    return yup.object().shape({
        cpfCnpj:
            formData.tipoPessoa === 'J'
                ? yup
                      .string()
                      .required('CNPJ é obrigatório.')
                      .test('is-cnpj', 'CNPJ inválido.', (value) => {
                          return value === '' || validateCNPJ(value);
                      })
                      .test('is-raiz', 'CNPJ diferente da raiz.', (value) => {
                          return value === '' || value.startsWith(formData.raizCnpjCpf);
                      })
                : formData.tipoPessoa === 'F'
                  ? yup
                        .string()
                        .required('CPF é obrigatório.')
                        .test('is-cpf', 'CPF inválido.', (value) => {
                            return value === '' || validateCPF(value);
                        })
                  : yup.mixed().notRequired(),
        nomeLocal: yup.string().required('Nome do Local é obrigatório.'),
        dadosPessoaFisica:
            formData.tipoPessoa === 'F'
                ? yup.object().shape({
                      rg: yup.string().required('RG é obrigatório.'),
                      dataNascimento: yup.date().required('Data de Nascimento é obrigatório.'),
                      sexoId: yup.string().required('Sexo é obrigatório.'),
                      nacionalidadeId: yup.string().required('Nacionalidade é obrigatório.'),
                      profissaoId: yup.string().required('Profissão é obrigatório.'),
                      estadoCivilId: yup.string().required('Estado Civil é obrigatório.')
                  })
                : yup.mixed().notRequired(),
        dadosPessoaJuridica:
            formData.tipoPessoa === 'J'
                ? yup.object().shape({
                      indicadorIE: yup.string().required('Indicador IE é obrigatório.'),
                      inscricaoEstadual: yup.string(),
                      dataFundacao: yup.date().max(new Date(), 'Data de Fundação deve ser menor que a data atual.')
                  })
                : yup.mixed().notRequired()
    });
};

const createSchema = () => {
    return yup.object().shape({
        tipoPessoa: yup.string().required('Tipo Pessoa é obrigatório.').oneOf(['F', 'J', 'EX'], 'Tipo Pessoa deve ser F, J ou EX'),
        nomeRazaoSocial: yup
            .string()
            .required(formData.tipoPessoa === 'J' ? 'Razão Social é obrigatório.' : 'Nome é obrigatório.')
            .min(3, 'Nome deve ter no mínimo 3 caracteres.')
            .max(150, 'Nome deve ter no máximo 150 caracteres.'),
        raizCnpjCpf: createSchemaRaizCnpjCpf(),
        nomeFantasia: formData.tipoPessoa === 'J' ? yup.string().required('Nome Fantasia é obrigatório.').max(120, 'Nome Fantasia deve ter no máximo 120 caracteres.') : yup.string(),
        locais: yup.array().of(createLocalSchema())
    });
};

onMounted(() => {
    idParceiro.value = route.params.id || 0;
    if (idParceiro.value > 0) {
        ParceiroService.getById(idParceiro.value)
            .then((data) => {
                formData.tipoPessoa = data.tipoPessoa;
                formData.raizCnpjCpf = data.raizCnpjCpf;
                formData.nomeRazaoSocial = data.nomeRazaoSocial;
                formData.nomeFantasia = data.nomeFantasia;
                formData.locais = data.locais;
            })
            .catch(async () => {
                await Swal.fire('Falha', `Não foi encontrado parceiro para o id ${idParceiro.value}`, 'error');
                cancelar();
            });
    }
});

const cancelar = () => {
    router.push({ path: '/admin/relacionamento/parceiros' });
};

const changeTipoPessoa = () => {
    formData.locais = []
    if (formData.tipoPessoa === 'F') {
        formData.locais.push({
            cnpjCpfLocal: '',
            nomeLocal: '',
            dadosPessoaFisica: {},
            dadosPessoaJuridica: {},
            enderecos: [],
            telefones: [],
            emails: [],
            propriedades: []
        });
    }
};

const salvarRegistro = () => {
    if (idParceiro.value === 0) {
        criarRegistro();
    } else {
        alterarRegistro();
    }
};

const alterarRegistro = () => {
    formData.id = idParceiro.value;

    ParceiroService.update(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parceiro alterado com sucesso', life: 5000 });
            router.push({ path: '/admin/relacionamento/parceiros' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar o parceiro.', life: 5000 });
        });
};

const criarRegistro = () => {
    ParceiroService.create(formData)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Parceiro criado com sucesso', life: 5000 });
            router.push({ path: '/admin/relacionamento/parceiros' });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível criar o parceiro.', life: 5000 });
        });
};

const beforeSubmit = () => {
    if (formData.tipoPessoa === 'F') {
        formData.locais[0].nomeLocal = formData.nomeRazaoSocial;
        formData.locais[0].cpfCnpj = formData.raizCnpjCpf;
        formData.locais[0].dadosPessoaJuridica = null;
    }
    if (formData.tipoPessoa === 'J') {
        formData.locais.forEach((local) => {
            local.dadosPessoaFisica = null;
        });
    }
};
</script>

<template>
    <UWPageBase :title="idParceiro === 0 ? 'Novo Parceiro' : 'Alterar Parceiro'">
        <UWForm :schema="createSchema()" :values="formData" ref="formParceiro" :beforeSubmit="beforeSubmit" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-9">
                        <UWFieldSet title="Identificação do Parceiro" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWPickList id="tipoPessoa" :disabled="idParceiro > 0" label="Tipo Pessoa" v-model="formData.tipoPessoa" optionLabel="name" optionValue="value" required :options="tiposPessoa" classContainer="col-12 md:col-3" @change="changeTipoPessoa()" />
                                <UWInputMask
                                    id="raizCnpjCpf"
                                    :v-show="formData.tipoPessoa !== 'EX'"
                                    :label="formData.tipoPessoa === 'J' ? 'Raiz Cnpj' : 'Cpf'"
                                    :mask="formData.tipoPessoa === 'J' ? '99.999.999' : '999.999.999-99'"
                                    required
                                    autofocus
                                    v-model="formData.raizCnpjCpf"
                                    :errors="errors.value?.raizCnpjCpf"
                                    classContainer="col-12 md:col-4"
                                />
                                <UWInput
                                    id="razaoSocial"
                                    :label="formData.tipoPessoa === 'J' ? 'Razão Social' : 'Nome'"
                                    uppercase
                                    required
                                    v-model="formData.nomeRazaoSocial"
                                    :errors="errors.value?.nomeRazaoSocial"
                                    :classContainer="['col-12', formData.tipoPessoa === 'J' ? 'md:col-7' : 'md:col-12']"
                                />
                                <UWInput
                                    id="nomeFantasia"
                                    v-show="formData.tipoPessoa === 'J'"
                                    label="Nome Fantasia"
                                    uppercase
                                    required
                                    autofocus
                                    v-model="formData.nomeFantasia"
                                    :errors="errors.value?.nomeFantasia"
                                    classContainer="col-12 md:col-5"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-3">
                        <UWFieldSet title="Informações" class="h-full">

                        </UWFieldSet>
                    </div>
                </div>
                <ManutencaoParceiroPessoaJuridica v-if="formData.tipoPessoa === 'J'" v-model="formData.locais" :errors="errors" />
                <ManutencaoParceiroPessoaFisica v-else v-model="formData.locais[0]" :errors="errors" />
            </template>
        </UWForm>
    </UWPageBase>
</template>
