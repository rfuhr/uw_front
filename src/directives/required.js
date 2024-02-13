export const requiredDirective = {
    beforeMount(el, binding) {
        if (binding.value === undefined || binding.value === true) {
            appendAsterisk(el);
        }
    },
    updated(el, binding) {
        if (binding.value === undefined || binding.value === true) {
            appendAsterisk(el);
        } else {
            removeAsterisk(el);
        }
    }
};

function appendAsterisk(el) {
    if (!el.querySelector('[data-asterisk]')) { // Verifica se já existe um asterisco adicionado
        const asteriskElement = document.createElement('span');
        asteriskElement.textContent = ' *';
        asteriskElement.style.color = 'red';
        asteriskElement.setAttribute('data-asterisk', ''); // Optional: You can set a data attribute to identify this asterisk.
        el.appendChild(asteriskElement);
    }
}

function removeAsterisk(el) {
    const asteriskElement = el.querySelector('[data-asterisk]');
    if (asteriskElement) {
        el.removeChild(asteriskElement);
    }
}
