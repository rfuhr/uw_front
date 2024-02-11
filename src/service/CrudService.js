import api from './api';

export default class CrudService {

    constructor(pathService) {
        this.pathService = pathService;
    }

    getPageAll(filtros) {
        return api.post(`/${this.pathService}/paginada`, JSON.stringify(filtros));
    }

    create(data) {
        return api.post(`/${this.pathService}`, data);
    }

    update(data) {
        return api.put(`/${this.pathService}`, data);
    }

    delete(id) {
        return api.delete(`/${this.pathService}/${id}`)
    }

    getRange(filtros) {
        return api.post(`/${this.pathService}/range`, filtros);
    }

    getById(id) {
        return api.get(`/${this.pathService}/${id}`);
    }

    getAll() {
        return api.get(`/${this.pathService}`);
    }
}



