import Swal from 'sweetalert2';

export function useDelete() {

    const execute = async (service, id, textoConfirmacao, textoSucesso, textoCancelado, title = 'Você confirma a exclusão?') => {
        try {
            const result = await Swal.fire({
                title: title,
                text: textoConfirmacao,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                reverseButtons: true
            });

            if (result.value) {
                try {
                    await service.delete(id)
                    Swal.fire('Excluído!', textoSucesso, 'success');
                    return true;
                } catch {
                    Swal.fire('Falha', "Ocorreu uma falha no processo de exclusão", 'error');
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelado', textoCancelado, 'warning');
                return false; // Retorna false em caso de cancelamento
            } else {
                Swal.fire('Falha', "Ocorreu uma falha no processo de exclusão", 'error');
                return false; // Retorna false em caso de erro
            }
        } catch {}
    }

    return {
        execute
    };
}

