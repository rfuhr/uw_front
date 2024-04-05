import CrudService from './CrudService';
import api from './api';

class CertificadoService extends CrudService {
    upload(formData) {
        return api.post(`${this.pathService}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }});
    }
}

export default new CertificadoService('configuracao/certificado');
