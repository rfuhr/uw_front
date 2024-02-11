<template>
    <div>
        <span class="empresa"><span class="label">Empresa:</span>{{contextoStore.getNomeEmpresaContexto}}</span>
        <span class="filial"><span class="label">Filial:</span>{{contextoStore.getNomeEmpresaFilialContexto}}</span>
    </div>
  </template>
  
  <script>
  import { useContexto } from '../../stores';
  
  export default {
      setup() {
          const contextoStore = useContexto()
          return {
              contextoStore,
          }			
      },   
  }
  </script>
  
  <style scoped lang="scss">
      .empresa {
          line-height: 52px;
          -webkit-transition: background 0.3s;
          transition: background 0.3s;
          -webkit-tap-highlight-color: transparent;
          font-size: 20px;
          color: whitesmoke;
  
          display: inline-block;
          font-weight: 400;
      }
  
      .filial {
           line-height: 52px;
          -webkit-transition: background 0.3s;
          transition: background 0.3s;
          -webkit-tap-highlight-color: transparent;
          font-size: 16px;
          color: whitesmoke;
  
          display: inline-block;
          font-weight: 400;
          margin-left: 12px;
  }    
  .label {
      font-size: 12px;
      margin-right: 10px;
      color: rgba(255, 255, 255, 0.668);
  }
  </style>