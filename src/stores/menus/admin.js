export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/admin/dashboard'},
        ]
    },
    {
        label: 'Configurações', 
        icon: 'pi pi-fw pi-cog',
        items: [
            {label: 'Sistema', icon: '', to: ''},
            {label: 'Empresa', icon: '', to: ''},
        ]
    },        
    {
        label: 'Organograma', 
        icon: 'pi pi-fw pi-sitemap',
        items: [
            {label: 'Departamento', icon: '', to: '/admin/organograma/departamentos'},
        ]
    },
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {
                label: 'Apoio',
                items: [
                    {label: 'Estado Civil', icon: '', to: '/admin/tabela/estadoCivil'},
                    {label: 'Nacionalidade', icon: '', to: '/admin/tabela/nacionalidade'},
                    {label: 'Profissão', icon: '', to: '/admin/tabela/profissao'},
                    {label: 'Sexo', icon: '', to: '/admin/tabela/sexo'},
                ]
            },

            {
                label: 'Localidades',
                items: [
                    {label: 'Cidades', icon: '', to: '/admin/tabela/cidades'},
                    {label: 'Países', icon: '', to: '/admin/tabela/paises'},
                    {label: 'Estados', icon: '', to: '/admin/tabela/ufs'},
                ]
            },
            {
                label: 'Relacionamento',
                items: [
                    {label: 'Tipo de Parceiro', icon: '', to: '/admin/tabela/tipoParceiro'},
                ]
            },
        ]
    },     
    {
        label: 'Relacionamento', 
        icon: 'pi pi-fw pi-slack',
        items: [
            {label: 'Parceiro', icon: '', to: '/admin/relacionamento/parceiros'},
        ]
    },
    {
        label: 'Segurança', 
        icon: 'pi pi-fw pi-lock',
        items: [
            {label: 'Usuários', icon: '', to: '/admin/seguranca/usuarios'},
            {label: 'Perfis de Acesso', icon: '', to: '/admin/seguranca/perfis'},
        ]
    },    
];