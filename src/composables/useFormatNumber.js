export function useFormatNumber() {

    const formatNumber = (number, decimalPlaces) => {
        return new Intl.NumberFormat('pt-BR', { 
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces
        }).format(number);
    }

    return {
        formatNumber
    };
}