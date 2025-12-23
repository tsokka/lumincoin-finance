import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class IncomesCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            { element: this.inputElement }
        ];

        if (this.createBtn) {
            this.createBtn.addEventListener('click', this.saveCategory.bind(this));
        }

        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.back();
            });
        }
    }

    findElements() {
        this.inputElement = document.getElementById('category-name');
        this.createBtn = document.getElementById('create-btn');
    }

    async saveCategory(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const result = await HttpUtils.request('/categories/income', 'POST', true, {
                title: this.inputElement.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return ToastUtils.show('Не удалось создать. Возможно, категория с таким именем уже существует.', 'danger');
            }

            return this.openNewRoute('/incomes');
        }
    }
}