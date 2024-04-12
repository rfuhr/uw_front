export function useFormatString() {

    const truncate = (text, maxSize) => {
        if (!text) return text
        if (text.length > maxSize) {
            return text.substring(0, maxSize) + '...';
        }
        return text;
    };

    return {
        truncate
    };
}