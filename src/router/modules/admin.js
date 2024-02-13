import AppLayout from '@/layout/AppLayout.vue';

const adminRouter = { 
    path: '/admin',
    component: AppLayout,
    redirect: '/admin/dashboard',
    name: 'admin',
    meta: {
        breadcrumb: [{ label: 'Administrativo' }],
        pathBase: 'admin'
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('../../views/administrativo/Dashboard.vue'),
        name: 'admin-dashboard',
        meta: {
            breadcrumb: [{ parent: 'Administrativo', label: 'Dashboard' }],
        }
      },
      {
        path: 'seguranca',
        name: 'admin-seguranca',
        meta: {
            breadcrumb: [{ parent: 'Administrativo', label: 'Segurança' }],
        },
        children: [
          {
            path: 'usuarios',
            name: 'admin-seguranca-usuarios',
            redirect: '/admin/seguranca/usuarios',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Usuário'}],
            },
            children: [
              {
                path: '',
                component: () => import('@/views/administrativo/seguranca/usuario/Usuario.vue'),
                name: 'admin-seguranca-usuarios-listagem',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Usuário'}],
                  tag: 'usuario',
                  operacao: 'consultar'
                },
              },

              {
                path: 'novo',
                component: () => import('@/views/administrativo/seguranca/usuario/ManutencaoUsuario.vue'),
                name: 'admin-seguranca-usuarios-novo',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Usuário'}, {label: 'Novo'}],
                  tag: 'usuario',
                  operacao: 'inserir'
                },
              },
              {
                path: ':id(\\d+)',
                component: () => import('@/views/administrativo/seguranca/usuario/ManutencaoUsuario.vue'),
                name: 'admin-seguranca-usuarios-editar',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Usuário'}, {label: 'Editar'}],
                  tag: 'usuario',
                  operacao: 'alterar'
                },
              },
            ]
          },
          {
            path: 'perfis',
            name: 'admin-seguranca-perfis',
            redirect: '/admin/seguranca/perfis',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Perfil'}],
            },
            children: [
              {
                path: '',
                component: () => import('@/views/administrativo/seguranca/perfil/Perfil.vue'),
                name: 'admin-seguranca-perfis-listagem',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Perfil'}],
                  tag: 'perfil',
                  operacao: 'consultar'
                },
              },

              {
                path: 'novo',
                component: () => import('@/views/administrativo/seguranca/perfil/ManutencaoPerfil.vue'),
                name: 'admin-seguranca-perfis-novo',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Perfil'}, {label: 'Novo'}],
                  tag: 'perfil',
                  operacao: 'inserir'
                },
              },
              {
                path: ':id(\\d+)',
                component: () => import('@/views/administrativo/seguranca/perfil/ManutencaoPerfil.vue'),
                name: 'admin-seguranca-perfis-editar',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Segurança'}, {label: 'Perfil'}, {label: 'Editar'}],
                  tag: 'perfil',
                  operacao: 'alterar'
                },
              },
            ]
          },
        ]
      },
      {
        path: 'relacionamento',
        name: 'admin-relacionamento',
        meta: {
            breadcrumb: [{ parent: 'Administrativo', label: 'Relacionamento' }],
        },
        children: [
          {
            path: 'parceiros',
            name: 'admin-relacionamento-parceiros',
            redirect: '/admin/relacionamento/parceiros',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Relacionamento'}, {label: 'Parceiro'}],
            },
            children: [
              {
                path: '',
                component: () => import('@/views/administrativo/relacionamento/parceiro/Parceiro.vue'),
                name: 'admin-relacionamento-parceiros-listagem',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Relacionamento'}, {label: 'Parceiro'}],
                  tag: 'parceiro',
                  operacao: 'consultar'
                },
              },

              {
                path: 'novo',
                component: () => import('@/views/administrativo/relacionamento/parceiro/ManutencaoParceiro.vue'),
                name: 'admin-relacionamento-parceiros-novo',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Relacionamento'}, {label: 'Parceiro'}, {label: 'Novo'}],
                  tag: 'parceiro',
                  operacao: 'inserir'
                },
              },
              {
                path: ':id(\\d+)',
                component: () => import('@/views/administrativo/relacionamento/parceiro/ManutencaoParceiro.vue'),
                name: 'admin-relacionamento-parceiros-editar',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Relacionamento'}, {label: 'Parceiro'}, {label: 'Editar'}],
                  tag: 'parceiro',
                  operacao: 'alterar'
                },
              },
            ]
          }          
        ]
      },
      {
        path: 'organograma',
        name: 'admin-organograma',
        meta: {
            breadcrumb: [{ parent: 'Administrativo', label: 'Organograma' }],
        },
        children: [
          {
            path: 'departamentos',
            name: 'admin-organograma-departamentos',
            redirect: '/admin/organograma/departamentos',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Organograma'}, {label: 'Departamento'}],
            },
            children: [
              {
                path: '',
                component: () => import('@/views/administrativo/organograma/departamento/Departamento.vue'),
                name: 'admin-organograma-departamentos-listagem',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Organograma'}, {label: 'Departamento'}],
                  tag: 'departamento',
                  operacao: 'consultar'
                },
              },

              {
                path: 'novo',
                component: () => import('@/views/administrativo/organograma/departamento/ManutencaoDepartamento.vue'),
                name: 'admin-organograma-departamentos-novo',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Organograma'}, {label: 'Departamento'}, {label: 'Novo'}],
                  tag: 'departamento',
                  operacao: 'inserir'
                },
              },
              {
                path: ':id(\\d+)',
                component: () => import('@/views/administrativo/organograma/departamento/ManutencaoDepartamento.vue'),
                name: 'admin-organograma-departamentos-editar',
                meta: {
                  breadcrumb: [{label: 'Administrativo'}, {label: 'Organograma'}, {label: 'Departamento'}, {label: 'Editar'}],
                  tag: 'departamento',
                  operacao: 'alterar'
                },
              },
            ]
          }          
        ]
      },
      {
        path: 'tabela',
        name: 'admin-tabela',
        meta: {
            breadcrumb: [{ parent: 'Administrativo', label: 'Tabela' }],
        },
        children: [
    //       {
    //         path: 'parceiro',
    //         component: () => import('../../views/administrativo/tabela/parceiro/Parceiro.vue'),
    //         name: 'admin-tabela-parceiro',
    //         meta: {
    //             breadcrumb: [{ parent: 'Administrativo', label: 'Parceiros' }],
    //         },
    //       },
          {
            path: 'paises',
            component: () => import('../../views/administrativo/tabela/pais/Pais.vue'),
            name: 'admin-tabela-paises',
            meta: {
                breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Localidades'}, { label: 'Países' }],
                tag: 'pais',
                operacao: 'consultar'
            },
          },
          {
            path: 'ufs',
            component: () => import('../../views/administrativo/tabela/uf/Uf.vue'),
            name: 'admin-tabela-ufs',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Localidades'}, { label: 'UFs' }],
              tag: "uf",
              operacao: 'consultar'
            },
          },
          {
            path: 'cidades',
            component: () => import('../../views/administrativo/tabela/cidade/Cidade.vue'),
            name: 'admin-tabela-cidade',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Localidades'}, { label: 'Cidades' }],
                tag: 'cidade',
                operacao: 'consultar'
            },
          },
          {
            path: 'sexo',
            component: () => import('../../views/administrativo/tabela/sexo/Sexo.vue'),
            name: 'admin-tabela-sexo',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Apoio'}, { label: 'Sexo' }],
              tag: 'sexo',
              operacao: 'consultar'
            },
          },
          {
            path: 'profissao',
            component: () => import('../../views/administrativo/tabela/profissao/Profissao.vue'),
            name: 'admin-tabela-profissao',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Apoio'}, { label: 'Profissão' }],
              tag: 'profissao',
              operacao: 'consultar'
            },
          },
          {
            path: 'nacionalidade',
            component: () => import('../../views/administrativo/tabela/nacionalidade/Nacionalidade.vue'),
            name: 'admin-tabela-nacionalidade',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Apoio'}, { label: 'Nacionalidade' }],
              tab: 'nacionalidade',
              operacao: 'consultar'
            },
          },
          {
            path: 'estadoCivil',
            component: () => import('../../views/administrativo/tabela/estadoCivil/EstadoCivil.vue'),
            name: 'admin-tabela-estadoCivil',
            meta: {
              breadcrumb: [{label: 'Administrativo'}, {label: 'Tabelas'}, {label: 'Apoio'}, { label: 'Estado Civil' }],
              tag: 'estadocivil',
              operacao: 'consultar'
            },
          },
    //       {
    //         path: 'tipoParceiro',
    //         component: () => import('../../views/administrativo/tabela/tipoParceiro/TipoParceiro.vue'),
    //         name: 'admin-tabela-tipoParceiro',
    //         meta: {
    //             breadcrumb: [{ parent: 'Administrativo', label: 'Tipo de Parceiro' }],
    //         },
    //       }
        ]
      },      
    ]
}

export default adminRouter