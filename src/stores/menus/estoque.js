export const menu = [
    {
        label: 'Dashboard', 
        icon: 'fa fa-check',
        items: [
            {label: 'Dashboard', icon: '', to: '/estoque/dashboard'},
        ]
    },
    {
        label: 'Cadastros', 
        icon: 'pi pi-fw pi-table',
        items: [
            {label: 'Classificação Comercial', icon: '', to: '/estoque/cadastro/classificacao-comercial'},
            {label: 'Grupo Contábil', icon: '', to: '/estoque/cadastro/grupo-contabil'},
            {label: 'Item', icon: '', to: '/estoque/cadastro/item'},
            {label: 'Linha', icon: '', to: '/estoque/cadastro/linha'},
            {label: 'Local do Estoque', icon: '', to: '/estoque/cadastro/local-estoque'},
            {label: 'Marca', icon: '', to: '/estoque/cadastro/marca'},
            {label: 'Tipo de Local de Estoque', icon: '', to: '/estoque/cadastro/tipo-local-estoque'},
        ]
    },    
  
];