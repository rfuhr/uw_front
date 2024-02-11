export const lowercaseDirective = {
    // O gancho `beforeMount` é chamado antes do componente ser montado.
    beforeMount(el, binding) {
        if (binding.value === undefined || binding.value === true) {
            // Aplica o estilo CSS para transformar o texto em maiúsculas.
            el.style.textTransform = 'lowercase';

            // Adiciona um ouvinte de evento de input para manter o valor em maiúsculas.
            el.addEventListener('input', function () {
                if (el.value !== el.value.toLowerCase()) {
                    el.value = el.value.toLowerCase();
                    // Emita o evento 'input' para atualizar o valor do componente pai.
                    el.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                }
            });
        }
    }
};
