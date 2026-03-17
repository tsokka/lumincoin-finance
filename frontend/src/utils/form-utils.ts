export class FormUtils {
    public static initCancelButton(
        openNewRouteCallback: ((path: string) => void) | null = null
    ): void {
        const cancelBtn: HTMLElement | null = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e: PointerEvent): void => {
                e.preventDefault();
                if (openNewRouteCallback) {
                    openNewRouteCallback('/operations');
                } else {
                    window.history.back();
                }
            });
        }
    }

    public static initTypeChange(
        typeSelectId: string,
        _categorySelectId: string,
        loadCategoriesCallback: (type: string) => Promise<void>
    ): void {
        const typeSelectElement = document.getElementById(typeSelectId) as HTMLSelectElement | null;
        if (typeSelectElement) {
            typeSelectElement.addEventListener('change', (): void => {
                loadCategoriesCallback(typeSelectElement.value).then();
            });
        }
    }
}