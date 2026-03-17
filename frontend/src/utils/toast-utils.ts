import {Toast} from 'bootstrap';

export class ToastUtils {
    public static show(message: string, type = 'danger'): void {
        const container: HTMLElement | null = document.getElementById('toast-container');
        if (!container) return;

        const toastElement: HTMLDivElement = document.createElement('div');
        toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toastElement);

        const toast = new Toast(toastElement, {delay: 3000});
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', (): void => {
            toastElement.remove();
        });
    }
}
