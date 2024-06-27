export function useFormatNumber() {

    const formatNumber = (number, decimalPlaces) => {
        if (!decimalPlaces) 
            decimalPlaces = 2;

        return new Intl.NumberFormat('pt-BR', { 
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(number);
    }

    return {
        formatNumber
    };
}