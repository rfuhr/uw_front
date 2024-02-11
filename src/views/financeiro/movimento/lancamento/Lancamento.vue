<template>
    <UWPageBase title="Lançamento de Título" subtitle="Realiza lançamento manual de títulos financeiro">
        <UWForm :schema="schema" :values="formData" ref="formLancamentoTitulo" @doCancel="hideDialog" @doSubmit="salvarRegistro">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <UWFieldSet title="Classificação do Título" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.departamentoId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Departamento"
                                    :service="EmpresaFilialService"
                                    placeholder="Selecione o departamento"
                                    :erros="errors.value?.departamentoId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.tipoTituloId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Tipo de Título"
                                    :service="TipoTituloService"
                                    placeholder="Selecione o tipo de título"
                                    :erros="errors.value?.departamentoId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.caracteristicaMovimentoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Característica de Movimento"
                                    :service="CaracteristicaMovimentoFinanceiroService"
                                    placeholder="Selecione a característica de movimento"
                                    :erros="errors.value?.caracteristicaMovimentoFinanceiroId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.grupoFinanceiroId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Grupo Financeiro"
                                    :service="GrupoFinanceiroService"
                                    placeholder="Selecione o grupo financeiro"
                                    :erros="errors.value?.grupoFinanceiroId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.fatoGeradorId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Fato Gerador"
                                    :service="FatoGeradorService"
                                    placeholder="Selecione o fato gerador"
                                    :erros="errors.value?.fatoGeradorId"
                                />
                                <UWSeletor
                                    classContainer="col-12 md:col-3"
                                    v-model="formData.carteiraFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Carteira Financeira"
                                    :service="CarteiraFinanceiraService"
                                    placeholder="Selecione a carteira financeira"
                                    :erros="errors.value?.carteiraFinanceiraId"
                                />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Parceiro" class="h-full"> </UWFieldSet>
                    </div>
                    <div class="col-12">
                        <UWFieldSet title="Identificação do Documento" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWSeletor
                                    classContainer="col-12 md:col-2"
                                    v-model="formData.carteiraFinanceiraId"
                                    optionLabel="nome"
                                    optionValue="id"
                                    required
                                    label="Histórico Padrão"
                                    :service="CarteiraFinanceiraService"
                                    placeholder="Selecione a carteira financeira"
                                    :erros="errors.value?.carteiraFinanceiraId"
                                />
                                <UWInput id="razaoSocial" label="Documento" uppercase required v-model="formData.nomeRazaoSocial" :errors="errors.value?.nomeRazaoSocial" classContainer="col-12 md:col-2" />
                                <UWCalendar id="dataNascimento" label="Data do Documento" required v-model="formData.dataDocumento" :errors="errors.value?.dataDocumento" classContainer="col-12 md:col-2" />
                                <UWInput id="razaoSocial" label="Histórico" uppercase required v-model="formData.historico" :errors="errors.value?.nomeRazaoSocial" classContainer="col-12 md:col-6" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-6">
                        <UWFieldSet title="Valores do Título" class="h-full" style="background-color: silver">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="valorTotal" label="Valor Total" uppercase required v-model="formData.valorTotal" :errors="errors.value?.valorTotal" classContainer="col-12 md:col-4" />
                                <UWInput id="valorRetenções" disabled label="Valor Retençoes" uppercase required v-model="formData.valorTotal" :errors="errors.value?.valorTotal" classContainer="col-12 md:col-4" />
                                <UWInput id="valorLiquido" disabled label="Valor Líquido" uppercase required v-model="formData.valorTotal" :errors="errors.value?.valorTotal" classContainer="col-12 md:col-4" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <div class="col-6">
                        <UWFieldSet title="Observação" class="h-full">
                            <div class="p-fluid formgrid grid">
                                <UWInput id="valorTotal" label="" uppercase v-model="formData.valorTotal" :errors="errors.value?.valorTotal" classContainer="col-12 md:col-12" />
                            </div>
                        </UWFieldSet>
                    </div>
                    <TabView class="col-12">
                        <TabPanel header="Parcelas" class="col-12"> </TabPanel>
                        <TabPanel header="Retenções" class="col-12"> </TabPanel>
                    </TabView>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>

<script setup>
import { ref } from 'vue';
import { EmpresaFilialService, TipoTituloService, CaracteristicaMovimentoFinanceiroService, GrupoFinanceiroService, FatoGeradorService, CarteiraFinanceiraService } from '@/service';

const formData = ref({
    departamentoId: undefined
});
</script>

<style></style>
