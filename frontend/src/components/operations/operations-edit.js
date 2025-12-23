import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FormUtils} from "../../utils/form-utils";

export class OperationsEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/operations');
        }

        this.findElements();

        this.validations = [
            {element: this.typeSelectElement},
            {element: this.categorySelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ];

        document.getElementById('update-btn').addEventListener('click', this.updateOperation.bind(this));

        FormUtils.initCancelButton(() => this.openNewRoute('/operations'));
        FormUtils.initTypeChange('type', 'category-edit', (type) => this.loadCategories(type));

        flatpickr(this.dateInputElement, {
            locale: 'ru',
            dateFormat: 'Y-m-d',
            altInput: true,
            altFormat: 'd.m.Y',
            disableMobile: true,
        });

        this.getOperation(id).then();
    }

    findElements() {
        this.typeSelectElement = document.getElementById('type');
        this.categorySelectElement = document.getElementById('category-edit');
        this.amountInputElement = document.getElementById('amount');
        this.dateInputElement = document.getElementById('date');
        this.commentInputElement = document.getElementById('comment');
    }

    async getOperation(id) {
        const result = await HttpUtils.request('/operations/' + id);
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return ToastUtils.show('Не удалось загрузить данные операции. Попробуйте обновить страницу.', 'danger');
        }

        const operation = result.response;
        await this.loadCategories(operation.type);

        this.operationOriginalData = result.response;
        this.showOperation(result.response);
    }

    async loadCategories(type) {
        const endpoint = type === 'income' ? '/categories/income' : '/categories/expense';
        const result = await HttpUtils.request(endpoint);

        if (result.response && !result.error) {
            this.categorySelectElement.innerHTML = '';
            result.response.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.innerText = cat.title;
                this.categorySelectElement.appendChild(option);
            });
        }
    }

    showOperation(operation) {
        this.typeSelectElement.value = operation.type;
        this.typeSelectElement.disabled = true;
        this.amountInputElement.value = operation.amount;

        if (this.dateInputElement._flatpickr) {
            this.dateInputElement._flatpickr.setDate(operation.date);
        }

        this.commentInputElement.value = operation.comment;

        for (let i = 0; i < this.categorySelectElement.options.length; i++) {
            if (this.categorySelectElement.options[i].innerText === operation.category) {
                this.categorySelectElement.selectedIndex = i;
            }
        }
    }

    async updateOperation(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const updateData = {
                type: this.typeSelectElement.value,
                category_id: Number(this.categorySelectElement.value),
                amount: Number(this.amountInputElement.value),
                date: this.dateInputElement.value,
                comment: this.commentInputElement.value
            };

            const result = await HttpUtils.request('/operations/' + this.operationOriginalData.id, 'PUT', true, updateData);
            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return ToastUtils.show('Ошибка обновления операции. Проверьте данные.', 'danger');
            }

            return this.openNewRoute('/operations');
        }
    }
}