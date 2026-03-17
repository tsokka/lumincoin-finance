import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FormUtils} from "../../utils/form-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {ValidationItem} from "../../types/validation-item.type";
import type {Category} from "../../types/category-response.type";
import type {HttpResult} from "../../types/http.types";
import type {OperationResponse} from "../../types/operation.type";

declare const flatpickr: (el: HTMLElement, config: object) => any;

export class OperationsCreate {
    readonly openNewRoute: OpenNewRoute;
    readonly validations: ValidationItem[] = [];
    private typeSelectElement: HTMLSelectElement | null = null;
    private categorySelectElement: HTMLSelectElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: HTMLInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.findElements();

        this.validations = [
            {element: this.typeSelectElement},
            {element: this.categorySelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ];

        document.getElementById('create-btn')?.addEventListener('click', this.saveOperation.bind(this));

        FormUtils.initCancelButton((): void => this.openNewRoute('/operations'));
        FormUtils.initTypeChange('type', 'category-create', (type: string): Promise<void> => this.loadCategories(type));

        const type: string | null = UrlUtils.getUrlParam('type');

        if (type === 'income' || type === 'expense') {
            if (this.typeSelectElement) {
                this.typeSelectElement.value = type;
            }
            this.loadCategories(type).then();
        } else {
            if (this.categorySelectElement) {
                this.categorySelectElement.disabled = true;
            }
        }

        if (this.dateInputElement) {
            flatpickr(this.dateInputElement, {
                locale: 'ru',
                dateFormat: 'Y-m-d',
                disableMobile: true,
            });
        }
    }

    private findElements(): void {
        this.typeSelectElement = document.getElementById('type') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('category-create') as HTMLSelectElement;
        this.amountInputElement = document.getElementById('amount') as HTMLInputElement;
        this.dateInputElement = document.getElementById('date') as HTMLInputElement;
        this.commentInputElement = document.getElementById('comment') as HTMLInputElement;
    }

    private async loadCategories(type: string): Promise<void> {
        const endpoint: string = type === 'income' ? '/categories/income' : '/categories/expense';
        const result: HttpResult<Category[]> = await HttpUtils.request<Category[]>(endpoint);

        if (result.response && !result.error) {
            if (this.categorySelectElement) {
                this.categorySelectElement.innerHTML = '<option selected disabled value="">Категория...</option>';
            }
            result.response.forEach((cat: Category): void => {
                const option: HTMLOptionElement = document.createElement('option');
                option.value = String(cat.id);
                option.innerText = cat.title;
                this.categorySelectElement?.appendChild(option);
            });
            if (this.categorySelectElement) {
                this.categorySelectElement.disabled = false;
            }
        }
    }

    private async saveOperation(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const result: HttpResult<OperationResponse> = await HttpUtils.request<OperationResponse>('/operations', 'POST', true, {
                type: this.typeSelectElement?.value,
                amount: Number(this.amountInputElement?.value),
                date: this.dateInputElement?.value,
                comment: this.commentInputElement?.value,
                category_id: Number(this.categorySelectElement?.value)
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || result.response.error) {
                return ToastUtils.show('Ошибка при создании операции. Проверьте введенные данные.', 'danger');
            }

            return this.openNewRoute('/operations');
        }
    }
}