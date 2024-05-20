<script setup>
import { ref } from 'vue';
import * as yup from 'yup';
import { useContexto } from '@/stores';
import { TipoTituloService, EmpresaFilialService, DepartamentoService, CaracteristicaMovimentoFinanceiroService, CarteiraFinanceiraService, GrupoFinanceiroService, FatoGeradorService } from '@/service';

const createSchema = () => {
    return yup.object().shape({
        tipoTituloId: yup.number().required('Tipo de Título é obrigatório'),
        empresaFilialId: yup.number().required('Filial é obrigatório')
    });
};

const contextoStore = useContexto();

const mode = ref('selecao');
const seletorDepartamento = ref();

const formData = ref({
    tipoTituloId: undefined
});

const handleLimpar = () => {
    formData.value.tipoTituloId = null;
    formData.value.empresaFilialId = contextoStore.contexto.empresaFilialId
    formData.value.departamentoId = null;
    seletorDepartamento.value.reload()
    formData.value.parceiroLocalId = null;
    formData.value.caracteristicaMovimentoFinanceiroId = null;
    formData.value.carteiraFinanceiraId = null;
    
}
</script>

<template>
    <UWPageBase title="Baixa de Títulos" :subtitle="mode === 'selecao' ? 'Seleção de títulos para baixa' : ''">
        <UWForm :schema="createSchema()" :values="formData" ref="formSelecaoBaixa" :visibleSave="false" :visibleCancel="false">
            <template #buttons>
                <Button label="Limpar" icon="pi pi-times" class="p-button-secondary" outlined @click="handleLimpar" />
                <Button label="Pesquisar" icon="pi pi-search" class="p-button-success" />
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
                                    required
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
                                <UWParceiroLocal ref="seletorParceiroLocal" id="parceiroLocal" classContainer="col-12 md:col-3" v-model="formData.parceiroLocalId" label="Parceiro" />
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
                                <UWSeletor
                                    id="grupoFinanceiro"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.grupoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Grupo Financeiro"
                                    :service="GrupoFinanceiroService"
                                    placeholder="Selecione o grupo financeiro"
                                />
                                <UWSeletor
                                    id="fatoGerador"
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.fatoGeradorId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    label="Fato Gerador"
                                    :service="FatoGeradorService"
                                    placeholder="Selecione o fato gerador"
                                />
                                <UWCalendar id="vencimentoInicial" label="Vencimento Inicial" v-model="formData.vencimentoInicial" classContainer="col-12 md:col-3" />                                        
                                <UWCalendar id="vencimentoFinal" label="Vencimento Final" v-model="formData.vencimentoFinal" classContainer="col-12 md:col-3" />                                        
                                <UWCalendar id="dataMovimentoInicial" label="Data Movimento Inicial" v-model="formData.dataMovimentoInicial" classContainer="col-12 md:col-3" />                                        
                                <UWCalendar id="dataMovimentoFinal" label="Data Movimento Final Final" v-model="formData.dataMovimentoFinal" classContainer="col-12 md:col-3" />                                        
                                <UWInteger id="nossoNumero" label="Nosso Número" v-model="formData.nossoNumero" classContainer="col-12 md:col-3" />
                                <UWInteger id="documento" label="Documento" v-model="formData.documento" classContainer="col-12 md:col-3" />
                            </div>
                        </UWFieldSet>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>
