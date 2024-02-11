export const requiredDirective = {
    beforeMount(el, binding) {
      console.log()
        if (binding.value === undefined || binding.value === true) {
            const asteriskElement = document.createElement('span');
            asteriskElement.textContent = ' *';
            asteriskElement.style.color = 'red';

            el.appendChild(asteriskElement);
        }
    }
};
