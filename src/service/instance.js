import { useAuth } from '../stores';
import Swal from 'sweetalert2';
import router from '../router/index';

const createErrorTable = (typeError, msgError, errors) => {
  let tableComplete = true;

  if (typeError.includes('UnicidadeException')) {
    tableComplete = false;
  }

  var container = document.createElement('div');
  var tableContainer = document.createElement('div');
  var label = document.createElement('p');
  label.textContent = msgError;
  label.style.fontWeight = 'bold';

  tableContainer.style.maxHeight = '60vh';
  tableContainer.style.overflowY = 'scroll';

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
};

const instance = {
  baseURL: "http://localhost:3333",
  headers: {
    "Content-Type": "application/json",
    "Accept-language": "pt-br",
  },
};

instance.interceptors = {
  request: {
    use: (config) => {
      const store = useAuth();

      config.headers["Authorization"] = 'Bearer ' + store.token;
      config.headers["X-TENANT-ID"] = store.tenant;
      return config;
    },
  },
  response: {
    use: (response) => {
      if (response.status >= 200 && response.status <= 299) {
        return response.json();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Atenção',
          text: response.message,
        });

        return Promise.reject(new Error(response.message || 'Error'));
      },
    },
  },
};

export default instance;
