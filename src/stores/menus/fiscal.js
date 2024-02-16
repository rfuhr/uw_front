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
            {label: 'CFOP', icon: '', to: '/fiscal/tabela/cfop'},
            {label: 'Classificação da Operação', icon: '', to: '/fiscal/tabela/classificacao-operacao'},
            {label: 'Enquadramento', icon: '', to: '/fiscal/tabela/enquadramento'},
            {label: 'Grupo Tributação', icon: '', to: '/fiscal/tabela/grupo-tributacao'},
            {label: 'Motivo de Desoneração', icon: '', to: '/fiscal/tabela/motivo-desoneracao'},
            {label: 'NCM', icon: '', to: '/fiscal/tabela/ncm'},
            {label: 'Origem', icon: '', to: '/fiscal/tabela/origem'},
            {label: 'Regime Tributário', icon: '', to: '/fiscal/tabela/regime-tributario'},
            {label: 'Tipo de Produto', icon: '', to: '/fiscal/tabela/tipo-produto'},
        ]
    },  
];