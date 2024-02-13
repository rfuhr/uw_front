export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/fiscal/dashboard'},
        ]
    },
    {
        label: 'Tabelas', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Grupo Tributação', icon: '', to: '/fiscal/tabela/grupo-tributacao'},
            {label: 'NCM', icon: '', to: '/fiscal/tabela/ncm'},
            {label: 'Regime Tributário', icon: '', to: '/fiscal/tabela/regime-tributario'},
        ]
    },  
];