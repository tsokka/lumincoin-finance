import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {FormUtils} from "../../utils/form-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {ValidationItem} from "../../types/validation-item.type";
import type {Category} from "../../types/category-response.type";
import type {Operation, OperationResponse} from "../../types/operation.type";
import type {HttpResult} from "../../types/http.types";
import type {DateInputElement} from "../../types/date-input-element.type";

declare const flatpickr: (el: HTMLElement, config: object) => any;

export class OperationsEdit {
    readonly openNewRoute: OpenNewRoute;
    readonly validations: ValidationItem[] = [];
    private typeSelectElement: HTMLSelectElement | null = null;
    private categorySelectElement: HTMLSelectElement | null = null;
    private amountInputElement: HTMLInputElement | null = null;
    private dateInputElement: DateInputElement | null = null;
    private commentInputElement: HTMLInputElement | null = null;
    private operationOriginalData: Operation | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');
        if (!id) {
            this.openNewRoute('/operations');
            return;
        }

        this.findElements();

        this.validations = [
            {element: this.typeSelectElement},
            {element: this.categorySelectElement},
            {element: this.amountInputElement},
            {element: this.dateInputElement},
            {element: this.commentInputElement}
        ];

        document.getElementById('update-btn')?.addEventListener('click', this.updateOperation.bind(this));

        FormUtils.initCancelButton((): void => this.openNewRoute('/operations'));
        FormUtils.initTypeChange('type', 'category-edit', (type: string): Promise<void> => this.loadCategories(type));

        if (this.dateInputElement) {
            flatpickr(this.dateInputElement, {
                locale: 'ru',
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'd.m.Y',
                disableMobile: true,
            });
        }

        this.getOperation(id).then();
    }

    private findElements(): void {
        this.typeSelectElement = document.getElementById('type') as HTMLSelectElement;
        this.categorySelectElement = document.getElementById('category-edit') as HTMLSelectElement;
        this.amountInputElement = document.getElementById('amount') as HTMLInputElement;
        this.dateInputElement = document.getElementById('date') as DateInputElement;
        this.commentInputElement = document.getElementById('comment') as HTMLInputElement;
    }

    private async getOperation(id: string): Promise<void> {
        const result: HttpResult<Operation> = await HttpUtils.request<Operation>('/operations/' + id);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response) {
            return ToastUtils.show('Не удалось загрузить данные операции. Попробуйте обновить страницу.', 'danger');
        }

        await this.loadCategories(result.response.type);

        this.operationOriginalData = result.response;
        this.showOperation(result.response);
    }

    private async loadCategories(type: string): Promise<void> {
        const endpoint: string = type === 'income' ? '/categories/income' : '/categories/expense';
        const result: HttpResult<Category[]> = await HttpUtils.request<Category[]>(endpoint);

        if (result.response && !result.error) {
            if (this.categorySelectElement) {
                this.categorySelectElement.innerHTML = '';
            }
            result.response.forEach(cat => {
                const option: HTMLOptionElement = document.createElement('option');
                option.value = String(cat.id);
                option.innerText = cat.title;
                this.categorySelectElement?.appendChild(option);
            });
        }
    }

    private showOperation(operation: Operation): void {
        if (this.typeSelectElement && this.amountInputElement) {
            this.typeSelectElement.value = operation.type;
            this.typeSelectElement.disabled = true;
            this.amountInputElement.value = String(operation.amount);
        }

        if (this.dateInputElement?._flatpickr) {
            this.dateInputElement._flatpickr.setDate(operation.date);
        }

        if (this.commentInputElement) {
            this.commentInputElement.value = operation.comment;
        }

        if (this.categorySelectElement) {
            for (let i: number = 0; i < this.categorySelectElement.options.length; i++) {
                const option = this.categorySelectElement.options[i];
                if (option && option.innerText === operation.category) {
                    this.categorySelectElement.selectedIndex = i;
                }
            }
        }
    }

    private async updateOperation(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            const result: HttpResult<OperationResponse> = await HttpUtils.request<OperationResponse>(
                '/operations/' + this.operationOriginalData?.id, 'PUT', true, {
                    type: this.typeSelectElement?.value,
                    category_id: Number(this.categorySelectElement?.value),
                    amount: Number(this.amountInputElement?.value),
                    date: this.dateInputElement?.value,
                    comment: this.commentInputElement?.value
                });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response || result.response.error) {
                return ToastUtils.show('Ошибка обновления операции. Проверьте данные.', 'danger');
            }

            return this.openNewRoute('/operations');
        }
    }
}