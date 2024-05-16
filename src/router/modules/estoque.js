import AppLayout from '@/layout/AppLayout.vue';

const estoqueRouter = {
    path: '/estoque',
    component: AppLayout,
    redirect: '/estoque/dashboard',
    name: 'est',
    meta: {
        breadcrumb: [{ label: 'Estoque' }],
        pathBase: 'est'
    },
    children: [
        {
            path: 'dashboard',
            component: () => import('../../views/estoque/Dashboard.vue'),
            name: 'est-dashboard',
            meta: {
                breadcrumb: [{ parent: 'Estoque', label: 'Dashboard' }]
            }
        },
        {
            path: 'cadastro',
            name: 'est-cadastro',
            meta: {
                breadcrumb: [{ parent: 'Estoque', label: 'Cadastro' }],
            },
            children: [
              {
                path: 'grupo-contabil',
                component: () => import('../../views/estoque/cadastro/grupoContabil/GrupoContabil.vue'),
                name: 'est-cadastro-grupo-contabil',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Grupo Contábil'}],
                    tag: 'grupocontabil',
                    operacao: 'consultar'
                },
              },    
              {
                path: 'item',
                name: 'est-cadastro-item',
                redirect: '/estoque/cadastro/item',
                meta: {
                  breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Item'}],
                },
                children: [
                  {
                    path: '',
                    component: () => import('@/views/estoque/cadastro/item/Item.vue'),
                    name: 'est-cadastro-item-listagem',
                    meta: {
                      breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Item'}],
                      tag: 'itemestoque',
                      operacao: 'consultar'
                    },
                  },
    
                  {
                    path: 'novo',
                    component: () => import('@/views/estoque/cadastro/item/ManutencaoItem.vue'),
                    name: 'est-cadastro-item-novo',
                    meta: {
                      breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Item'}, {label: 'Novo'}],
                      tag: 'itemestoque',
                      operacao: 'inserir'
                    },
                  },
                  {
                    path: ':id(\\d+)',
                    component: () => import('@/views/estoque/cadastro/item/ManutencaoItem.vue'),
                    name: 'est-cadastro-item-editar',
                    meta: {
                      breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Item'}, {label: 'Editar'}],
                      tag: 'itemestoque',
                      operacao: 'alterar'
                    },
                  },
                ]
              },
              {
                path: 'marca',
                component: () => import('../../views/estoque/cadastro/marca/Marca.vue'),
                name: 'est-cadastro-marca',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Marca'}],
                    tag: 'marca',
                    operacao: 'consultar'
                },
              },    
              {
                path: 'linha',
                component: () => import('../../views/estoque/cadastro/linha/Linha.vue'),
                name: 'est-cadastro-linha',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Linha'}],
                    tag: 'linha',
                    operacao: 'consultar'
                },
              },       
              {
                path: 'local-estoque',
                component: () => import('../../views/estoque/cadastro/localEstoque/LocalEstoque.vue'),
                name: 'est-cadastro-local-estoque',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Local do Estoque'}],
                    tag: 'localestoque',
                    operacao: 'consultar'
                },
              },       
              {
                path: 'classificacao-comercial',
                component: () => import('../../views/estoque/cadastro/classificacaoComercial/ClassificacaoComercial.vue'),
                name: 'est-cadastro-classificacao-comercial',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Classificação Comercial'}],
                    tag: 'classificacaocomercial',
                    operacao: 'consultar'
                },
              },  
              {
                path: 'tipo-local-estoque',
                component: () => import('../../views/estoque/cadastro/tipoLocalEstoque/TipoLocalEstoque.vue'),
                name: 'est-cadastro-tipo-local-estoque',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Cadastro'}, {label: 'Tipo de Local do Estoque'}],
                    tag: 'tipolocalestoque',
                    operacao: 'consultar'
                },
              },  
            ]
          },
          {
            path: 'relatorio',
            name: 'est-relatorio',
            meta: {
                breadcrumb: [{ parent: 'Estoque', label: 'Relatório' }],
            },
            children: [
              {
                path: 'posicao-fisico-financeira',
                component: () => import('../../views/estoque/relatorio/posicaoFisicoFinanceira/PosicaoFisicoFinanceira.vue'),
                name: 'est-relatorio-posicao-fisico-financeira',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Relatório'}, {label: 'Posição de Estoque Físico/Financeira'}],
                    tag: 'posicaofisicofinanceira',
                    operacao: 'consultar'
                },
              },    
              {
                path: 'razao-estoque',
                component: () => import('../../views/estoque/relatorio/razaoEstoque/RazaoEstoque.vue'),
                name: 'est-relatorio-razao-estoque',
                meta: {
                    breadcrumb: [{label: 'Estoque'}, {label: 'Relatório'}, {label: 'Razão de Estoque'}],
                    tag: 'razaoestoque',
                    operacao: 'consultar'
                },
              },    
            ]
          },          
    ]
};

export default estoqueRouter;
