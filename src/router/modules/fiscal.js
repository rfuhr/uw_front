import AppLayout from '@/layout/AppLayout.vue';

const fiscalRouter = {
    path: '/fiscal',
    component: AppLayout,
    redirect: '/fiscal/dashboard',
    name: 'fis',
    meta: {
        breadcrumb: [{ label: 'Fiscal' }],
        pathBase: 'fis'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/fiscal/Dashboard.vue'),
            name: 'fin-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Dashboard' }]
            },
        },
        {
            path: 'gerenciador-nfe',
            redirect: '/fiscal/gerenciador-nfe',
            // component: () => import('../../views/fiscal/gerenciador/GerenciadorNFe.vue'),
            name: 'fis-gerenciador-nfe',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Gerenciador de NFe' }]
            },
            children: [
                {
                  path: '',
                  component: () => import('@/views/fiscal/gerenciador/GerenciadorNFe.vue'),
                  name: 'fis-gerenciador-nfe-listagem',
                  meta: {
                    breadcrumb: [{label: 'Fiscal'}, {label: 'Gerenciador de NFe'}, {label: 'Listagem'}],
                    tag: 'gerenciador-nfe',
                    operacao: 'consultar'
                  },
                },
                {
                    path: 'nova',
                    component: () => import('@/views/fiscal/nfe/NovaNFe.vue'),
                    name: 'fis-nfe-nova',
                    meta: {
                      breadcrumb: [{label: 'Fiscal'}, {label: 'Nota Fiscal Eletrônica'}, {label: 'Nova'}],
                      tag: 'nfe',
                      operacao: 'inserir'
                    },
                  }, 
                  {
                    path: 'editar/:id(\\d+)/:visualizacao(\\d+)',
                    component: () => import('@/views/fiscal/nfe/NovaNFe.vue'),
                    name: 'fis-nfe-editar',
                    meta: {
                      breadcrumb: [{label: 'Fiscal'}, {label: 'Nota Fiscal Eletrônica'}, {label: 'Editar'}],
                      tag: 'nfe',
                      operacao: 'editar'
                    },
                  },                   
            ]
        },
        {
            path: 'tabela',
            name: 'fis-tabela',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Tabela' }]
            },
            children: [
                {
                    path: 'cfop',
                    component: () => import('../../views/fiscal/tabela/cfop/Cfop.vue'),
                    name: 'fis-tabela-cfop',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'CFOP' }],
                        tag: 'cfop',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'classificacao-operacao',
                    component: () => import('../../views/fiscal/tabela/classificacaoOperacao/ClassificacaoOperacao.vue'),
                    name: 'fis-tabela-classificacaooperacao',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Classificação da Operação' }],
                        tag: 'classificacaooperacao',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'enquadramento',
                    component: () => import('../../views/fiscal/tabela/enquadramento/Enquadramento.vue'),
                    name: 'fis-tabela-enquadramento',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Enquadramento' }],
                        tag: 'enquadramento',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'grupo-tributacao',
                    component: () => import('../../views/fiscal/tabela/grupoTributacao/GrupoTributacao.vue'),
                    name: 'fis-tabela-grupotributacao',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Grupo Tributação' }],
                        tag: 'grupotributacao',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'mensagem-fiscal',
                    component: () => import('../../views/fiscal/tabela/mensagemFiscal/MensagemFiscal.vue'),
                    name: 'fis-tabela-mensagemfiscal',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Mensagem Fiscal' }],
                        tag: 'mensagemfiscal',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'motivo-desoneracao',
                    component: () => import('../../views/fiscal/tabela/motivoDesoneracao/MotivoDesoneracao.vue'),
                    name: 'fis-tabela-motivodesoneracao',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Motivo de Desoneração' }],
                        tag: 'motivodesoneracao',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'ncm',
                    component: () => import('../../views/fiscal/tabela/ncm/Ncm.vue'),
                    name: 'fis-tabela-ncm',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'NCM' }],
                        tag: 'ncm',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'origem',
                    component: () => import('../../views/fiscal/tabela/origem/Origem.vue'),
                    name: 'fis-tabela-origem',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Origem' }],
                        tag: 'origem',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'regime-tributario',
                    component: () => import('../../views/fiscal/tabela/regimeTributario/RegimeTributario.vue'),
                    name: 'fis-tabela-regimetributario',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Regime Tributário' }],
                        tag: 'regimetributario',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'situacao-tributaria',
                    component: () => import('../../views/fiscal/tabela/situacaoTributaria/SituacaoTributaria.vue'),
                    name: 'fis-tabela-situacaotributaria',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Situacao Tributária' }],
                        tag: 'situacaotributaria',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-incentivo-fiscal',
                    component: () => import('../../views/fiscal/tabela/tipoIncentivoFiscal/TipoIncentivoFiscal.vue'),
                    name: 'fis-tabela-tipoincentivofical',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Tipo de Incentivo Fiscal' }],
                        tag: 'tipoincentivofical',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'tipo-produto',
                    component: () => import('../../views/fiscal/tabela/tipoProduto/TipoProduto.vue'),
                    name: 'fis-tabela-tipoproduto',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Tabelas' }, { label: 'Tipo de Produto' }],
                        tag: 'tipoproduto',
                        operacao: 'consultar'
                    }
                }
            ]
        },
        {
            path: 'configuracoes',
            name: 'fis-configuracoes',
            meta: {
                breadcrumb: [{ parent: 'Fiscal', label: 'Configurações' }]
            },
            children: [
                {
                    path: 'configuracao-fiscal',
                    component: () => import('../../views/fiscal/configuracoes/configuracaoFiscal/ConfiguracaoFiscal.vue'),
                    name: 'fis-configuracoes-configuracaofiscal',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Configurações' }, { label: 'Configuração Fiscal' }],
                        tag: 'configuracaofiscal',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'config-incentivo-fiscal',
                    component: () => import('../../views/fiscal/configuracoes/configIncentivoFiscal/ConfigIncentivoFiscal.vue'),
                    name: 'fis-configuracoes-configIncentivofiscal',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Configurações' }, { label: 'Configuração de Incentivo Fiscal' }],
                        tag: 'configIncentivofiscal',
                        operacao: 'consultar'
                    }
                },
                {
                    path: 'config-mensagem-fiscal',
                    component: () => import('../../views/fiscal/configuracoes/configMensagemFiscal/ConfigMensagemFiscal.vue'),
                    name: 'fis-configuracoes-configMensagemfiscal',
                    meta: {
                        breadcrumb: [{ label: 'Fiscal' }, { label: 'Configurações' }, { label: 'Configuração da Mensagem Fiscal' }],
                        tag: 'configMensagemfiscal',
                        operacao: 'consultar'
                    }
                },
            ]
        }
    ]
};

export default fiscalRouter;
