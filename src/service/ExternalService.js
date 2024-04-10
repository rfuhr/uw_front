import axios from 'axios';

class ExternalService {

    constructor() {
        this.api = axios.create({});
      }
    
      async getEnderecoByCep (cep) {
        try {
            const { data } = await this.api.get(
              `https://viacep.com.br/ws/${cep}/json/`
            );
            if (!data.erro) {
              return data;
            }
            return null;
          } catch (error) {
            return null;
          }
        }
    
}

export default new ExternalService();