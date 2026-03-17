export class DeleteModalUtils {
    public static init(
        deleteCallback: (id: string) => void | Promise<void>,
        modalId: string = 'delete-modal',
        confirmBtnId: string = 'confirm-delete-btn'
    ): void {
        const deleteModal: HTMLElement | null = document.getElementById(modalId);
        const confirmDeleteBtn: HTMLElement | null = document.getElementById(confirmBtnId);

        let currentId: string | null = null;

        if (deleteModal) {
            deleteModal.addEventListener('show.bs.modal', (event: Event): void => {
                const button: Element | null = (event as Event & { relatedTarget: Element | null }).relatedTarget;
                if (button) {
                    currentId = button.getAttribute('data-id');
                }
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (): void => {
                if (currentId) {
                    deleteCallback(currentId);
                    currentId = null;
                }
            });
        }
    }
}