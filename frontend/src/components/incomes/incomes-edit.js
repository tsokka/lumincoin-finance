import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";

export class IncomesEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');

        if (!id) {
            return this.openNewRoute('/incomes');
        }

        this.findElements();

        this.validations = [
            { element: this.inputElement }
        ];

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', this.updateCategory.bind(this));
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openNewRoute('/incomes');
            });
        }

        this.getCategory(id).then();
    }

    findElements() {
        this.inputElement = document.getElementById('title-input');
        this.saveBtn = document.getElementById('update-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
    }

    async getCategory(id) {
        const category = await CategoriesService.getIncome(id);

        if (category && category.redirect) {
            return this.openNewRoute(category.redirect);
        }

        if (!category) {
            return;
        }

        this.originalData = category;
        this.showCategory(category);
    }

    showCategory(category) {
        if (this.inputElement) {
            this.inputElement.value = category.title;
        }
    }

    async updateCategory(e) {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const result = await HttpUtils.request('/categories/income/' + this.originalData.id, 'PUT', true, {
                title: this.inputElement.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || (result.response && result.response.error)) {
                return ToastUtils.show('Ошибка сохранения категории дохода. Попробуйте другое название.', 'danger');
            }

            return this.openNewRoute('/incomes');
        }
    }
}