import axios from "axios";
import { useAuth, useContexto } from '../stores'
import Swal from 'sweetalert2'
import router from '../router/index';

const createErrorTable = (typeError, msgError, errors) => {
    let tableComplete = true

    if (typeError.includes('UnicidadeException'))  {
        tableComplete = false;
    }

    var container = document.createElement('div');
    var tableContainer = document.createElement('div'); // Container para a tabela
    var label = document.createElement('p');
    label.textContent = msgError;
    label.style.fontWeight = 'bold';

    tableContainer.style.maxHeight = '60vh'; // Altura máxima da tabela (adicione um valor adequado)
    tableContainer.style.overflowY = 'scroll'; // Barra de rolagem vertical

    var table = document.createElement('table');
    table.style.width = '98%';
    table.style.borderCollapse = 'collapse';

    var thead = document.createElement('thead');
    var tbody = document.createElement('tbody');

    var headerRow = thead.insertRow(0);
    var fieldHeader = document.createElement('th');
    
    fieldHeader.textContent = tableComplete ? 'Campo' : 'Validação';
    fieldHeader.style.border = '1px solid black';
    fieldHeader.style.padding = '8px';
    headerRow.appendChild(fieldHeader);
    
    if (tableComplete) {
        var messageHeader = document.createElement('th');
        messageHeader.textContent = 'Erro';
        messageHeader.style.border = '1px solid black';
        messageHeader.style.padding = '8px';
        headerRow.appendChild(messageHeader);
    }


    for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        var row = tbody.insertRow(i);
        var fieldCell = row.insertCell(0);
        fieldCell.style.border = '1px solid black';
        fieldCell.style.padding = '8px';
        fieldCell.textContent = error.field;
        if (tableComplete) {
            var messageCell = row.insertCell(1);
            messageCell.style.border = '1px solid black';
            messageCell.style.padding = '8px';
            messageCell.textContent = error.message;
        }
    }

    table.appendChild(thead);

    table.appendChild(tbody);

    tableContainer.appendChild(table);

    container.appendChild(label);
    container.appendChild(tableContainer);

    return container;
}

const instance = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
    "Accept-language": "pt-br"
  },
});

instance.interceptors.request.use(
    (config) => {
        const store = useAuth()
        const contexto = useContexto()

        config.headers["Authorization"] = 'Bearer ' + store.token
        config.headers["X-TENANT-ID"] = store.tenant
        config.headers["X-EMPRESA-ID"] = contexto.contexto.empresaId
        config.headers["X-EMPRESA-FILIAL-ID"] = contexto.contexto.empresaFilialId
        return config;
    }
)

instance.interceptors.response.use(
    (response) => {
        if (response.status >= 200 && response.status <= 299) {
            if (response.request.responseType === 'blob') 
                return response;
            else
                return response.data;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção',
                text: response.message,
            });

            return Promise.reject(new Error(response.message || 'Error'));
        }
    },
    (error) => {
        const data = error.response && error.response.data || undefined;
        let msgErro = '';
        const requestUrl = error.response.config.url;

        if (error.response.status === 501 && !requestUrl.includes('login')) {
            router.push({ path: `/notFound` });	
        } else if (error.response.status === 401 && !requestUrl.includes('login')) {
            // Adicione uma propriedade personalizada para evitar redirecionamentos duplicados
            if (!router.currentRoute.value.meta.redirected) {
                router.currentRoute.value.meta.redirected = true;
                router.push({ path: `/accessDenied` });
            }
        } else if (error.response.status === 403 && !requestUrl.includes('login')) {
            router.push({ path: `/notPermission` });	
        } else if (error.response.status === 404) {
            return Promise.reject(error);
        } else {
            if (error.response.data && error.response.data.errors) {
                msgErro = createErrorTable(error.response.data.exceptionName, error.response.data.message, error.response.data.errors);
            } else  {
                if (error.response.data.message) {
                    msgErro = error.response.data.message;
                }
            }
            Swal.fire({
                icon: 'error',
                title: 'Atenção',
                html: msgErro || 'Erro não identificado',
                customClass: {
                    popup: 'swal-custom-popup-error',
                }
            });
        }

        return Promise.reject(error);
    }
);

export default instance;