export function useFormatString() {

    const truncate = (text, maxSize) => {
        if (text.length > maxSize) {
            return text.substring(0, maxSize) + '...';
        }
        return text;
    };

    return {
        truncate
    };
}