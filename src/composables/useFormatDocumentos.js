import { ref } from 'vue';

export function useFormatDocumentos() {
    const formattedDocumento = ref('');

    function formatDocumento(documento) {
        if (documento.length === 11) {
            // Format CPF
            return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (documento.length === 14) {
            // Format CNPJ
            return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            return documento;
        }
    }

    return {
        formattedDocumento,
        formatDocumento
    };
}