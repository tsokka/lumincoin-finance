export class DeleteModalUtils {
    static init(deleteCallback, modalId = 'delete-modal', confirmBtnId = 'confirm-delete-btn') {
        const deleteModal = document.getElementById(modalId);
        const confirmDeleteBtn = document.getElementById(confirmBtnId);

        let currentId = null;

        if (deleteModal) {
            deleteModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                currentId = button.getAttribute('data-id');
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (currentId) {
                    deleteCallback(currentId);
                    currentId = null;
                }
            });
        }
    }
}