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
              }          
            ]
          },
        
    ]
};

export default estoqueRouter;
