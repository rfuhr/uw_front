<script setup>
import { ref } from 'vue';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { parseISO } from 'date-fns';
import { useContexto } from '@/stores';
import { useFormatDate } from '@/composables/useFormatDate';
import { TipoTituloService, EmpresaFilialService, DepartamentoService, CaracteristicaMovimentoFinanceiroService, 
         CarteiraFinanceiraService, RelatorioFinanceiroService } from '@/service';

const createSchema = () => {
    return yup.object().shape({
        empresaFilialId: yup.number().required('Filial é obrigatório'),
        competencia: yup.date().required('Competência é obrigatório'),
        vencimentoInicial: yup.date().required('Vencimento Inicial é obrigatório'),
        vencimentoFinal: yup.date()
            .required('Vencimento Final é obrigatório')
            .min(yup.ref('vencimentoInicial'), 'Vencimento Final deve ser maior que Vencimento Inicial')
    });
};
const toast = useToast();
const contextoStore = useContexto();
const { formatToUTC } = useFormatDate();

const seletorDepartamento = ref();
const blocked = ref(false);

const formData = ref({
    tipoTituloId: undefined,
    competencia: new Date(),
    vencimentoInicial: parseISO('1900-01-01'),
    vencimentoFinal: parseISO('2999-12-31'),    
});

const handleLimpar = () => {
    formData.value.tipoTituloId = null;
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId;
    formData.value.departamentoId = null;
    seletorDepartamento.value.reload();
    formData.value.parceiroLocalId = null;
    formData.value.caracteristicaMovimentoFinanceiroId = null;
    formData.value.carteiraFinanceiraId = null;
};

const selecionarRegistros = async () => {
    blocked.value = true;
    const selecaoRelatorioRequest = {...formData.value};
    selecaoRelatorioRequest.competencia = formatToUTC(selecaoRelatorioRequest.competencia);
    selecaoRelatorioRequest.vencimentoInicial = formatToUTC(selecaoRelatorioRequest.vencimentoInicial);
    selecaoRelatorioRequest.vencimentoFinal = formatToUTC(selecaoRelatorioRequest.vencimentoFinal);
    selecaoRelatorioRequest.tipoRelatorioFinanceiro = 'POSTITULOABERTO';
    RelatorioFinanceiroService.imprimirRelatorio(JSON.stringify(selecaoRelatorioRequest)).then((response) => {
            const disposition = response.headers['content-disposition'];
            const fileNameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(disposition);
            const filename = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'RelatorioFinanceiro.pdf';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            blocked.value = false;
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Erro ao gerar o Relatório de Posição de Título em Aberto.', life: 5000 });
            blocked.value = false;
        });
};


</script>

<template>
    <BlockUI :blocked="blocked" fullScreen />      
    <UWPageBase title="Posição de Títulos em Aberto" subtitle="Filtro para seleção de títulos em aberto">
        <UWForm :schema="createSchema()" :values="formData" ref="formSelecaoBaixa" @doSubmit="selecionarRegistros" :visibleSave="false" :visibleCancel="false">
            <template #buttons>
                <Button label="Limpar" icon="pi pi-times" class="p-button-secondary" outlined @click="handleLimpar" />
                <Button label="Imprimir" type="submit" icon="pi pi-print" class="p-button-info" />
            </template>
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Filtros de Seleção">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    id="tipoTitulo"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.tipoTituloId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Tipo de Título"
                                    :service="TipoTituloService"
                                    placeholder="Selecione o tipo de título"
                                    :erros="errors.value?.tipoTituloId"
                                />
                                <UWSeletor
                                    :id="empresaFilial"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.empresaFilialId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    disabled
                                    label="Filial"
                                    :service="EmpresaFilialService"
                                    placeholder="Selecione a filial"
                                    :erros="errors.value?.empresaFilialId"
                                    :columnsFilters="[{ field: 'empresa', value: contextoStore.empresaId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresa.id' }]"
                                />
                                <UWSeletor
                                    :id="departamento"
                                    ref="seletorDepartamento"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Departamento"
                                    :service="DepartamentoService"
                                    placeholder="Selecione o departamento"
                                    :columnsFilters="[{ field: 'empresaFilial', value: formData.empresaFilialId, matchMode: 'equal', tipoField: 'integer', fieldFilter: 'empresaFilial.id' }]"
                                />
                                <UWCalendar id="competencia" label="Competência" required v-model="formData.competencia" classContainer="col-12 md:col-3" :errors="errors.value?.competencia" />
                                <UWParceiroLocal ref="seletorParceiroLocal" id="parceiroLocal" classContainer="col-12 md:col-6" v-model="formData.parceiroLocalId" label="Parceiro" />
                                <UWSeletor
                                    id="caracteristicaMovimentoFinanceiro"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.caracteristicaMovimentoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Característica de Movimento"
                                    :service="CaracteristicaMovimentoFinanceiroService"
                                    placeholder="Selecione a característica de movimento"
                                />
                                <UWSeletor
                                    id="carteiraFinanceira"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.carteiraFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Carteira Financeira"
                                    :service="CarteiraFinanceiraService"
                                    placeholder="Selecione a carteira financeira"
                                />
                                <UWCalendar id="vencimentoInicial" label="Vencimento Inicial" required v-model="formData.vencimentoInicial" classContainer="col-12 md:col-3" :errors="errors.value?.vencimentoInicial" />
                                <UWCalendar id="vencimentoFinal" label="Vencimento Final" required v-model="formData.vencimentoFinal" classContainer="col-12 md:col-3" :errors="errors.value?.vencimentoFinal" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>
