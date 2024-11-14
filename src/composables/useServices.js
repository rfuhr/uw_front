import { ref } from 'vue';

// Mapeamento de nomes para funções de importação
const serviceImports = {
  AuthService: () => import('@/service/AuthService'),
  UsuarioService: () => import('@/service/UsuarioService'),
  ContextoService: () => import('@/service/ContextoService'),
  // Adicione outros serviços conforme necessário
};

export default async function useServices(serviceNames, servicesRef) {
  const loadedServices = {};

  // Carregar todos os serviços passados
  for (const serviceName of serviceNames) {
    if (serviceImports[serviceName]) {
      try {
        const module = await serviceImports[serviceName](); // Importação dinâmica
        loadedServices[serviceName] = module.default;
      } catch (error) {
        console.error(`Erro ao carregar o serviço ${serviceName}:`, error);
      }
    } else {
      console.error(`Serviço não encontrado: ${serviceName}`);
    }
  }

  // Preenche o ref com os serviços carregados
  servicesRef.value = loadedServices;
}