import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FormUtils} from "../../utils/form-utils";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.typeSelectElement},
            {element: this.categorySelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ];

        document.getElementById('create-btn').addEventListener('click', this.saveOperation.bind(this));

        FormUtils.initCancelButton(() => this.openNewRoute('/operations'));
        FormUtils.initTypeChange('type', 'category-create', (type) => this.loadCategories(type));

        const type = UrlUtils.getUrlParam('type');

        if (type === 'income' || type === 'expense') {
            this.typeSelectElement.value = type;
            this.loadCategories(type).then();
        } else {
            this.categorySelectElement.disabled = true;
        }

        flatpickr(this.dateInputElement, {
            locale: 'ru',
            dateFormat: 'Y-m-d',
            disableMobile: true,
        });
    }

    findElements() {
        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category-create');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
    }

    async loadCategories(type) {
        const endpoint = type === 'income' ? '/categories/income' : '/categories/expense';
        const result = await HttpUtils.request(endpoint);

        if (result.response && !result.error) {
            this.categorySelectElement.innerHTML = '<option selected disabled value="">Категория...</option>';
            result.response.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.innerText = cat.title;
                this.categorySelectElement.appendChild(option);
            });
            this.categorySelectElement.disabled = false;
        }
    }

    async saveOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const result = await HttpUtils.request('/operations', 'POST', true, {
                type: this.typeSelectElement.value,
                amount: Number(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value,
                category_id: Number(this.categorySelectElement.value)
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return ToastUtils.show('Ошибка при создании операции. Проверьте введенные данные.', 'danger');
            }

            return this.openNewRoute('/operations');
        }
    }
}