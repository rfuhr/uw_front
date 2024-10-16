import AppLayout from '@/layout/AppLayout.vue';

const financeiroRouter = {
    path: '/financeiro',
    component: AppLayout,
    redirect: '/financeiro/dashboard',
    name: 'financeiro',
    meta: {
        breadcrumb: [{ label: 'Financeiro' }],
        pathBase: 'financeiro'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/financeiro/Dashboard.vue'),
            name: 'financeiro-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Dashboard' }]
            }
        },
        {
            path: 'tabela',
            name: 'financeiro-tabela',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'tipo-titulo',
                    component: () => import('../../views/financeiro/tabela/tipoTitulo/TipoTitulo.vue'),
                    name: 'financeiro-tabela-tipoTitulo',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Tipo de Título' }],
                        tag: 'tipotitulo',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'caracteristica-movimento-financeiro',
                    component: () => import('../../views/financeiro/tabela/caracteristicaMovimentoFinanceiro/CaracteristicaMovimentoFinanceiro.vue'),
                    name: 'financeiro-tabela-caracteristicaMovimentoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Característica de Movimento' }],
                        tag: 'caracteristicamovimentofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'carteira-financeira',
                    component: () => import('../../views/financeiro/tabela/carteiraFinanceira/CarteiraFinanceira.vue'),
                    name: 'financeiro-tabela-carteiraFinanceira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Carteira Financeira' }],
                        tag: 'carteirafinanceira',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'grupo-financeiro',
                    component: () => import('../../views/financeiro/tabela/grupoFinanceiro/GrupoFinanceiro.vue'),
                    name: 'financeiro-tabela-grupoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Grupo Financeiro' }],
                        tag: 'grupofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'fato-gerador',
                    component: () => import('../../views/financeiro/tabela/fatoGerador/FatoGerador.vue'),
                    name: 'financeiro-tabela-fatoGerador',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Fato Gerador' }],
                        tag: 'fatogerador',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-operacao-financeira',
                    component: () => import('../../views/financeiro/tabela/tipoOperacaoFinanceira/TipoOperacaoFinanceira.vue'),
                    name: 'financeiro-tabela-tipoOperacaoFinanceira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Tipo Operação Financeira' }],
                        tag: 'tipooperacaofinanceira',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'motivo-estorno-financeiro',
                    component: () => import('../../views/financeiro/tabela/motivoEstornoFinanceiro/MotivoEstornoFinanceiro.vue'),
                    name: 'financeiro-tabela-motivoEstornoFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Motivo de Estorno' }],
                        tag: 'motivoestornofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'indice-financeiro',
                    component: () => import('../../views/financeiro/tabela/indiceFinanceiro/IndiceFinanceiro.vue'),
                    name: 'financeiro-tabela-indiceFinanceiro',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Índice Financeiro' }],
                        tag: 'indicefinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'banco',
                    component: () => import('../../views/financeiro/tabela/banco/Banco.vue'),
                    name: 'financeiro-tabela-banco',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Caixa e Bancos' }, { label: 'Banco' }],
                        tag: 'banco',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'agencia',
                    component: () => import('../../views/financeiro/tabela/agencia/Agencia.vue'),
                    name: 'financeiro-tabela-agencia',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Caixa e Bancos' }, { label: 'Agência' }],
                        tag: 'agencia',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'conta',
                    component: () => import('../../views/financeiro/tabela/conta/Conta.vue'),
                    name: 'financeiro-tabela-conta',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Caixa e Bancos' }, { label: 'Conta' }],
                        tag: 'conta',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-conta-cxbco',
                    component: () => import('../../views/financeiro/tabela/tipoContaCxBco/TipoContaCxBco.vue'),
                    name: 'financeiro-tabela-tipoContaCxBco',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Caixa e Bancos' }, { label: 'Tipo de Conta' }],
                        tag: 'tipocontacxbco',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'operacao-caixa-banco',
                    component: () => import('../../views/financeiro/tabela/operacaoCaixaBanco/OperacaoCaixaBanco.vue'),
                    name: 'financeiro-tabela-operacaoCaixaBanco',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Tabelas' }, { label: 'Caixa e Bancos' }, { label: 'Operação' }],
                        tag: 'operacaocaixabanco',
                        operacao: 'consultar'
                    }
                }
            ]
        },
        {
            path: 'movimento',
            name: 'financeiro-movimentos',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Movimentação' }]
            },
            children: [
                {
                    path: 'lancamento',
                    component: () => import('../../views/financeiro/movimento/lancamento/LancamentoFinanceiro.vue'),
                    name: 'financeiro-movimento-lancamento',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Lançamento' }],
                        tag: 'lancamentofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'baixa',
                    component: () => import('../../views/financeiro/movimento/baixa/BaixaFinanceiro.vue'),
                    name: 'financeiro-movimento-selecao-baixa',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Lançamento' }],
                        tag: 'baixafinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'estorno',
                    component: () => import('../../views/financeiro/movimento/estorno/EstornoFinanceiro.vue'),
                    name: 'financeiro-movimento-selecao-estorno',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Estorno' }],
                        tag: 'estornofinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'consulta',
                    component: () => import('../../views/financeiro/movimento/consulta/ConsultaFinanceiro.vue'),
                    name: 'financeiro-movimento-selecao-consulta',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Consulta' }],
                        tag: 'consultafinanceiro',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'substituicao-carteira',
                    component: () => import('../../views/financeiro/movimento/substituicaoCarteira/SubstituicaoCarteira.vue'),
                    name: 'financeiro-movimento-substituicao-carteira',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Substituição de Carteira' }],
                        tag: 'substituicaocarteira',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'negociacao',
                    name: 'financeiro-movimento-negociacao',
                    redirect: '/financeiro/movimento/negociacao',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Negociação' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/financeiro/movimento/negociacao/NegociacaoListagem.vue'),
                            name: 'financeiro-movimento-negociacao-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Negociação' }],
                                tag: 'negociacaofinanceira',
                                operacao: 'consultar'
                            }
                        },

                        {
                            path: 'novo',
                            component: () => import('@/views/financeiro/movimento/negociacao/NegociacaoFinanceira.vue'),
                            name: 'financeiro-movimento-negociacao-nova',
                            meta: {
                                breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Negociação' }, { label: 'Nova' }],
                                tag: 'negociacaofinanceira',
                                operacao: 'inserir'
                            }
                        }
                    ]
                },
                {
                    path: 'lancamento-caixa-banco',
                    name: 'financeiro-movimento-lancamento-caixa-banco',
                    redirect: '/financeiro/movimento/lancamento-caixa-banco',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Caixa e Bancos' }, { label: 'Lançamento' }]
                    },

                    children: [
                        {
                            path: '',
                            component: () => import('@/views/financeiro/movimento/lancamentoCaixaBanco/LancamentoCaixaBancoListagem.vue'),
                            name: 'financeiro-movimento-lancamento-caixa-banco-listagem',
                            meta: {
                                breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Caixa e Bancos' }, { label: 'Lançamento' }],
                                tag: 'lancamentocaixabanco',
                                operacao: 'consultar'
                            }
                        },

                        {
                            path: 'novo',
                            component: () => import('@/views/financeiro/movimento/lancamentoCaixaBanco/LancamentoCaixaBanco.vue'),
                            name: 'financeiro-movimento-lancamento-caixa-banco-novo',
                            meta: {
                                breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Caixa e Bancos' }, { label: 'Lançamento' }, { label: 'Novo' }],
                                tag: 'lancamentocaixabanco',
                                operacao: 'inserir'
                            }
                        }
                    ]
                },
                {
                    path: 'saldo-caixa-banco',
                    component: () => import('../../views/financeiro/movimento/saldoCaixaBanco/SaldoCaixaBanco.vue'),
                    name: 'financeiro-movimento-saldo-caixa-banco',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Movimentação' }, { label: 'Caixa e Bancos' }, { label: 'Saldo' }],
                        tag: 'saldocaixabanco',
                        operacao: 'consultar'
                    }
                }
            ]
        },
        {
            path: 'configuracao',
            name: 'financeiro-configuracao',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Configurações' }],
            },
            children: [
              {
                path: 'classificacao-financeira',
                component: () => import('../../views/financeiro/configuracao/classificacaoFinanceira/ClassificacaoFinanceira.vue'),
                name: 'financeiro-configuracao-classificacaoFinanceira',
                meta: {
                    breadcrumb: [{label: 'Financeiro'}, {label: 'Configurações'}, {label: 'Classificação Financeira'}],
                    tag: 'classificacaofinanceira',
                    operacao: 'consultar'
                },
              },
              {
                path: 'parametro-financeiro',
                component: () => import('../../views/financeiro/configuracao/parametroFinanceiro/ParametroFinanceiro.vue'),
                name: 'financeiro-configuracao-parametroFinanceiro',
                meta: {
                    breadcrumb: [{label: 'Financeiro'}, {label: 'Configurações'}, {label: 'Parâmetro Financeiro'}],
                    tag: 'parametrofinanceiro',
                    operacao: 'consultar'
                },
              },
            ]
        },   
        {
            path: 'relatorio',
            name: 'financeiro-relatorios',
            meta: {
                breadcrumb: [{ parent: 'Financeiro', label: 'Relatório' }]
            },
            children: [
                {
                    path: 'posicao-titulo-aberto',
                    component: () => import('../../views/financeiro/relatorio/posicaoTituloAberto/PosicaoTituloAberto.vue'),
                    name: 'financeiro-relatorio-posicao-titulo-aberto',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Aberto' }],
                        tag: 'relatorioposicaotituloaberto',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'adiantamento-devolucao-aberto',
                    component: () => import('../../views/financeiro/relatorio/adiantamentoDevolucaoAberto/AdiantamentoDevolucaoAberto.vue'),
                    name: 'financeiro-relatorio-adiantamento-devolucao-aberto',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Adiantamento / Devoluções em Aberto' }],
                        tag: 'relatorioadiantamentodevolucaoaberto',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'posicao-titulo-baixados',
                    component: () => import('../../views/financeiro/relatorio/posicaoTituloBaixados/PosicaoTituloBaixados.vue'),
                    name: 'financeiro-relatorio-posicao-titulo-baixados',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Baixados' }],
                        tag: 'relatorioposicaotitulobaixados',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'posicao-titulo-aberto-vencimento',
                    component: () => import('../../views/financeiro/relatorio/posicaoTituloAbertoVencimento/PosicaoTituloAbertoVencimento.vue'),
                    name: 'financeiro-relatorio-posicao-titulo-aberto-vencimento',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Vencimento' }],
                        tag: 'relatorioposicaotituloabertovencimento',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'sintetico-geral',
                    component: () => import('../../views/financeiro/relatorio/sinteticoGeral/SinteticoGeral.vue'),
                    name: 'financeiro-relatorio-sintetico-geral',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Sintético Geral' }],
                        tag: 'relatoriosinteticogeral',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'sintetico-vencer',
                    // component: () => import('../../views/financeiro/relatorio/sinteticoAberto/SinteticoAberto.vue'),
                    name: 'financeiro-relatorio-sintetico-aberto',
                    meta: {
                        breadcrumb: [{ label: 'Financeiro' }, { label: 'Relatório' }, { label: 'Contas Pagar e Receber' }, { label: 'Posição de Títulos' }, { label: 'Sintético Aberto' }],
                        tag: 'relatoriosinteticoaberto',
                        operacao: 'consultar'
                    }
                },
            ]
        },        
    ]
};

export default financeiroRouter;
