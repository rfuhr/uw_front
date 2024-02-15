import { format, parseISO, isValid } from 'date-fns';

export default function useFormatDate() {
    
    function formatDate(date, formatString) {
        return format(isValid(date) ? date : parseISO(date), formatString);
    }

    function formatToISO(date) {
        return format(isValid(date) ? date : parseISO(date), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }

    function formatToUTC(date) {
        return format(isValid(date) ? date : parseISO(date), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }

    function formatToDDMMYYYY(date) {
        return format(isValid(date) ? date : parseISO(date), 'dd/MM/yyyy');
    }

    function formatToDDMMYYYYHHMMSS(date) {
        return format(isValid(date) ? date : parseISO(date), 'dd/MM/yyyy HH:mm:ss');
    }

    function formatToHHMMSS(date) {
        return format(isValid(date) ? date : parseISO(date), 'HH:mm:ss');
    }

    return {
        formatDate,
        formatToISO,
        formatToUTC,
        formatToDDMMYYYY,
        formatToDDMMYYYYHHMMSS,
        formatToHHMMSS
    };
}
