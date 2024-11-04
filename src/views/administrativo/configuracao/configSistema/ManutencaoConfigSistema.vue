<script setup>
import { ref, onMounted } from 'vue';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import {
    ConfigSistemaService,
    OperacaoMovimentacaoFinanceiroService,
    OperacaoAcessoriaFinanceiraService,
    TipoOperacaoFinanceiraService,
    GrupoFinanceiroService,
    FatoGeradorService,
    CaracteristicaMovimentoFinanceiroService,
    HistoricoPadraoService,
    CarteiraFinanceiraService,
    TipoDocumentoService,
    TipoTituloService,
} from '@/service';

const createSchema = () => {
    return yup.object().shape({
        id: yup.string().required('Id é obrigatório.'),
        tipoTituloReceberId: yup.string().required('Tipo de título a receber é obrigatório.'),
        tipoTituloPagarId: yup.string().required('Tipo de título a pagar é obrigatório.'),
        operacaoMovimentoFinanceiroInclusaoId: yup.string().required('Operação de movimentação de inclusão é obrigatória.'),
        operacaoMovimentoFinanceiroBaixaId: yup.string().required('Operação de movimentação de baixa é obrigatória.'),
        operacaoAcessoriaFinanceiraPrincipalId: yup.string().required('Operação acessória principal é obrigatória.'),
        operacaoAcessoriaFinanceiraJurosPactuadoId: yup.string().required('Operação acessória de juros pactuado é obrigatória.'),
        tipoOperacaoFinanceiraLancamentoId: yup.string().required('Tipo de operação para lançamentos é obrigatório.'),
        tipoOperacaoFinanceiraEstornoId: yup.string().required('Tipo de operação para estornos é obrigatório.'),
        grupoFinanceiroNegociacaoId: yup.string().required('Grupo financeiro é obrigatório.'),
        fatoGeradorNegociacaoId: yup.string().required('Fato gerador é obrigatório.'),
        carteiraFinanceiraNegociacaoId: yup.string().required('Carteira financeira é obrigatório.'),
        caracteristicaMovimentoFinanceiroNegociacaoId: yup.string().required('Característica de movimento é obrigatório.'),
        historicoPadraoNegociacaoId: yup.string().required('Histórico padrão é obrigatório.'),
        tipoDocumentoRomaneioId: yup.string().required('Tipo de documento de romaneio é obrigatório.'),
        tipoDocumentoSolicitacaoId: yup.string().required('Tipo de documento de solicitação é obrigatório.'),
        tipoDocumentoCotacaoId: yup.string().required('Tipo de documento de cotação é obrigatório.'),
    });
};

const toast = useToast();
const formData = ref({});

const salvarRegistro = async () => {
    const payload = montaRequest();
    ConfigSistemaService.update(payload)
        .then(() => {
            toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Configuração de sistema alterada com sucesso', life: 5000 });
            carregarRegistro();
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Falha', detail: 'Não foi possível alterar a configuração de sistema.', life: 5000 });
        });
};

const carregarRegistro = () => {
    ConfigSistemaService.getById(1).then((response) => {
        formData.value.id = response.id;
        formData.value.configuracoesFinanceiroId = response.configuracoesFinanceiro[0].id,
        formData.value.tipoTituloReceberId = response.configuracoesFinanceiro[0].tipoTituloReceberId
        formData.value.tipoTituloPagarId = response.configuracoesFinanceiro[0].tipoTituloPagarId
        formData.value.operacaoMovimentoFinanceiroInclusaoId = response.configuracoesFinanceiro[0].operacaoMovimentoFinanceiroInclusaoId
        formData.value.operacaoMovimentoFinanceiroBaixaId  = response.configuracoesFinanceiro[0].operacaoMovimentoFinanceiroBaixaId
        formData.value.operacaoAcessoriaFinanceiraPrincipalId = response.configuracoesFinanceiro[0].operacaoAcessoriaFinanceiraPrincipalId
        formData.value.operacaoAcessoriaFinanceiraJurosPactuadoId = response.configuracoesFinanceiro[0].operacaoAcessoriaFinanceiraJurosPactuadoId
        formData.value.tipoOperacaoFinanceiraLancamentoId = response.configuracoesFinanceiro[0].tipoOperacaoFinanceiraLancamentoId
        formData.value.tipoOperacaoFinanceiraEstornoId = response.configuracoesFinanceiro[0].tipoOperacaoFinanceiraEstornoId
        formData.value.grupoFinanceiroNegociacaoId = response.configuracoesFinanceiro[0].grupoFinanceiroNegociacaoId
        formData.value.fatoGeradorNegociacaoId = response.configuracoesFinanceiro[0].fatoGeradorNegociacaoId
        formData.value.carteiraFinanceiraNegociacaoId = response.configuracoesFinanceiro[0].carteiraFinanceiraNegociacaoId
        formData.value.caracteristicaMovimentoFinanceiroNegociacaoId = response.configuracoesFinanceiro[0].caracteristicaMovimentoFinanceiroNegociacaoId
        formData.value.historicoPadraoNegociacaoId = response.configuracoesFinanceiro[0].historicoPadraoNegociacaoId

        formData.value.configuracoesAgricolaId = response.configuracoesAgricola[0].id,
        formData.value.tipoDocumentoRomaneioId = response.configuracoesAgricola[0].tipoDocumentoRomaneioId

        formData.value.tipoDocumentoSolicitacaoId = response.configuracoesCompra[0].tipoDocumentoSolicitacaoId
        formData.value.tipoDocumentoCotacaoId = response.configuracoesCompra[0].tipoDocumentoCotacaoId
    });
};

const montaRequest = () => {
    return {
        id: formData.value.id,
        configuracoesFinanceiro: [
            {
                id: formData.value.configuracoesFinanceiroId,
                configSistemaId: formData.value.id,
                tipoTituloReceberId: formData.value.tipoTituloReceberId,
                tipoTituloPagarId: formData.value.tipoTituloPagarId,
                operacaoMovimentoFinanceiroInclusaoId: formData.value.operacaoMovimentoFinanceiroInclusaoId,
                operacaoMovimentoFinanceiroBaixaId: formData.value.operacaoMovimentoFinanceiroBaixaId,
                operacaoAcessoriaFinanceiraPrincipalId: formData.value.operacaoAcessoriaFinanceiraPrincipalId,
                operacaoAcessoriaFinanceiraJurosPactuadoId: formData.value.operacaoAcessoriaFinanceiraJurosPactuadoId,
                tipoOperacaoFinanceiraLancamentoId: formData.value.tipoOperacaoFinanceiraLancamentoId,
                tipoOperacaoFinanceiraEstornoId: formData.value.tipoOperacaoFinanceiraEstornoId,
                grupoFinanceiroNegociacaoId: formData.value.grupoFinanceiroNegociacaoId,
                fatoGeradorNegociacaoId: formData.value.fatoGeradorNegociacaoId,
                carteiraFinanceiraNegociacaoId: formData.value.carteiraFinanceiraNegociacaoId,
                caracteristicaMovimentoFinanceiroNegociacaoId: formData.value.caracteristicaMovimentoFinanceiroNegociacaoId,
                historicoPadraoNegociacaoId: formData.value.historicoPadraoNegociacaoId,
            }
        ],
        configuracoesAgricola: [
            {
                id: formData.value.configuracoesFinanceiroId,
                configSistemaId: formData.value.id,
                tipoDocumentoRomaneioId: formData.value.tipoDocumentoRomaneioId                
            }
        ],
        configuracoesCompra: [
            {
                id: formData.value.configuracoesCompraId,
                configSistemaId: formData.value.id,
                tipoDocumentoSolicitacaoId: formData.value.tipoDocumentoSolicitacaoId,
                tipoDocumentoCotacaoId: formData.value.tipoDocumentoCotacaoId                
            }
        ]
    };
};

onMounted(() => {
    carregarRegistro();
});
</script>

<template>
    <UWPageBase title="Configuração do Sistema" subtitle="Parametrizações globais necessárias para funcionamento do sistema. ">
        <UWForm :schema="createSchema()" :values="formData" ref="formConfigGerais" @doSubmit="salvarRegistro" @doCancel="cancelar">
            <template #errors="{ errors }">
                <div class="grid nested-grid">
                    <div class="col-12">
                        <TabView class="col-12">
                            <TabPanel header="Financeiro" class="col-12">
                                <div class="grid nested-grid">
                                    <div class="col-12">
                                        <UWFieldSet title="Operações de Movimentação Financeira" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="tipoTituloReceber"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.tipoTituloReceberId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo do Título a Receber"
                                                    :service="TipoTituloService"
                                                    placeholder="Selecione o tipo de título"
                                                    :erros="errors.value?.tipoTituloReceberId"
                                                />
                                                <UWSeletor
                                                    id="tipoTituloPagar"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.tipoTituloPagarId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo do Título a Pagar"
                                                    :service="TipoTituloService"
                                                    placeholder="Selecione o tipo de título"
                                                    :erros="errors.value?.tipoTituloPagarId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-6">
                                        <UWFieldSet title="Operações de Movimentação Financeira" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="operacaoMovimentoFinanceiroInclusao"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.operacaoMovimentoFinanceiroInclusaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Operação de Movimentação de Inclusão"
                                                    :service="OperacaoMovimentacaoFinanceiroService"
                                                    placeholder="Selecione a operação de movimentação"
                                                    :erros="errors.value?.operacaoMovimentoFinanceiroInclusaoId"
                                                />
                                                <UWSeletor
                                                    id="operacaoMovimentoFinanceiroBaixa"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.operacaoMovimentoFinanceiroBaixaId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Operação de Movimentação de Baixa"
                                                    :service="OperacaoMovimentacaoFinanceiroService"
                                                    placeholder="Selecione a operação de movimentação"
                                                    :erros="errors.value?.operacaoMovimentoFinanceiroBaixaId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-6">
                                        <UWFieldSet title="Operações Acessórias Financeiras" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="operacaoAcessoriaFinanceiraPrincipal"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.operacaoAcessoriaFinanceiraPrincipalId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Op. Acessória Principal"
                                                    :service="OperacaoAcessoriaFinanceiraService"
                                                    placeholder="Selecione a operação acessória principal"
                                                    :erros="errors.value?.operacaoAcessoriaFinanceiraPrincipalId"
                                                />
                                                <UWSeletor
                                                    id="operacaoAcessoriaFinanceiraJurosPactuado"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.operacaoAcessoriaFinanceiraJurosPactuadoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Op. Acessória Juros Pactuado"
                                                    :service="OperacaoAcessoriaFinanceiraService"
                                                    placeholder="Selecione a operação acessória juros pactuado"
                                                    :erros="errors.value?.operacaoAcessoriaFinanceiraJurosPactuadoId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12">
                                        <UWFieldSet title="Tipo de Operações Financeiras" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="tipoOperacaoFinanceiraLancamento"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.tipoOperacaoFinanceiraLancamentoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo para Lançamento de Título"
                                                    :service="TipoOperacaoFinanceiraService"
                                                    placeholder="Selecione o tipo de operação"
                                                    :erros="errors.value?.tipoOperacaoFinanceiraLancamentoId"
                                                />
                                                <UWSeletor
                                                    id="tipoOperacaoFinanceiraEstorno"
                                                    classContainer="col-12 md:col-6"
                                                    v-model="formData.tipoOperacaoFinanceiraEstornoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo para Estorno de Baixas"
                                                    :service="TipoOperacaoFinanceiraService"
                                                    placeholder="Selecione o tipo de operação"
                                                    :erros="errors.value?.tipoOperacaoFinanceiraEstornoId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                    <div class="col-12">
                                        <UWFieldSet title="Parâmetros para Negociação" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="grupoFinanceiroNegociacao"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.grupoFinanceiroNegociacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Grupo Financeiro"
                                                    :service="GrupoFinanceiroService"
                                                    placeholder="Selecione o grupo financeiro"
                                                    :erros="errors.value?.grupoFinanceiroNegociacaoId"
                                                />
                                                <UWSeletor
                                                    id="fatogeradorNegociacao"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.fatoGeradorNegociacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Fato Gerador"
                                                    :service="FatoGeradorService"
                                                    placeholder="Selecione o fato gerador"
                                                    :erros="errors.value?.fatoGeradorNegociacaoId"
                                                />
                                                <UWSeletor
                                                    id="carteiraFinanceiraNegociacao"
                                                    classContainer="col-12 md:col-2"
                                                    v-model="formData.carteiraFinanceiraNegociacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Carteira Financeira"
                                                    :service="CarteiraFinanceiraService"
                                                    placeholder="Selecione a carteira financeira"
                                                    :erros="errors.value?.carteiraFinanceiraNegociacaoId"
                                                />
                                                <UWSeletor
                                                    id="caracteristicaMovimentoFinanceiroNegociacao"
                                                    classContainer="col-12 md:col-2"
                                                    v-model="formData.caracteristicaMovimentoFinanceiroNegociacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Característica de Movimento"
                                                    :service="CaracteristicaMovimentoFinanceiroService"
                                                    placeholder="Selecione a característica de movimento"
                                                    :erros="errors.value?.caracteristicaMovimentoFinanceiroNegociacaoId"
                                                />
                                                <UWSeletor
                                                    id="historicoPadraoNegociacao"
                                                    classContainer="col-12 md:col-2"
                                                    v-model="formData.historicoPadraoNegociacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Histórico Padrão"
                                                    :service="HistoricoPadraoService"
                                                    placeholder="Selecione o histórico padrão"
                                                    :erros="errors.value?.historicoPadraoNegociacaoId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Agrícola" class="col-12">
                                <div class="grid nested-grid">
                                    <div class="col-12">
                                        <UWSeletor
                                            id="tipoDocumentoRomaneio"
                                            classContainer="col-12 md:col-3"
                                            v-model="formData.tipoDocumentoRomaneioId"
                                            optionLabel="nome"
                                            optionValue="id"
                                            required
                                            label="Tipo de Documento para Romaneio"
                                            :service="TipoDocumentoService"
                                            placeholder="Selecione o tipo de documento"
                                            :erros="errors.value?.tipoDocumentoRomaneioId"
                                        />
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel header="Compras" class="col-12">
                                <div class="grid nested-grid">
                                    <div class="col-12">
                                        <UWFieldSet title="Tipos de Documento" class="h-full">
                                            <div class="p-fluid formgrid grid">
                                                <UWSeletor
                                                    id="tipoDocumentoSolicitacao"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.tipoDocumentoSolicitacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo de Documento para Solicitação"
                                                    :service="TipoDocumentoService"
                                                    placeholder="Selecione o tipo de solicitacao"
                                                    :erros="errors.value?.tipoDocumentoSolicitacaoId"
                                                />
                                                <UWSeletor
                                                    id="tipoDocumentoCotacao"
                                                    classContainer="col-12 md:col-3"
                                                    v-model="formData.tipoDocumentoCotacaoId"
                                                    optionLabel="nome"
                                                    optionValue="id"
                                                    required
                                                    label="Tipo de Documento para Cotação"
                                                    :service="TipoDocumentoService"
                                                    placeholder="Selecione o tipo de cotação"
                                                    :erros="errors.value?.tipoDocumentoCotacaoId"
                                                />
                                            </div>
                                        </UWFieldSet>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </template>
        </UWForm>
    </UWPageBase>
</template>
