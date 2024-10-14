export const requiredDirective = {
    beforeMount(el, binding) {
        handleAsterisk(el, binding.value);
    },
    updated(el, binding) {
        handleAsterisk(el, binding.value);
    }
};

function handleAsterisk(el, value) {
    if (value === undefined || value === true) {
        appendAsterisk(el, 'red'); // Valor padrão ou true = asterisco vermelho
    } else if (value === 'opcional') {
        appendAsterisk(el, 'orange'); // Se for 'opcional' = asterisco laranja
    } else {
        removeAsterisk(el); // Remove o asterisco se o valor não for 'true', 'undefined' ou 'opcional'
    }
}

function appendAsterisk(el, color) {
    let asteriskElement = el.querySelector('[data-asterisk]');
    if (!asteriskElement) {
        asteriskElement = document.createElement('span');
        asteriskElement.setAttribute('data-asterisk', '');
        el.appendChild(asteriskElement);
    }
    asteriskElement.textContent = ' *';
    asteriskElement.style.color = color; // Define a cor com base no parâmetro recebido
}

function removeAsterisk(el) {
    const asteriskElement = el.querySelector('[data-asterisk]');
    if (asteriskElement) {
        el.removeChild(asteriskElement);
    }
}
