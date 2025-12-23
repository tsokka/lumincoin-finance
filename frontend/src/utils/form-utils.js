export class FormUtils {
    static initCancelButton(openNewRouteCallback = null) {
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (openNewRouteCallback) {
                    openNewRouteCallback('/operations');
                } else {
                    window.history.back();
                }
            });
        }
    }

    static initTypeChange(typeSelectId, categorySelectId, loadCategoriesCallback) {
        const typeSelectElement = document.getElementById(typeSelectId);
        if (typeSelectElement) {
            typeSelectElement.addEventListener('change', () => {
                loadCategoriesCallback(typeSelectElement.value).then();
            });
        }
    }
}