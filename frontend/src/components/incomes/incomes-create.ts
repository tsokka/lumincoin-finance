import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {ValidationItem} from "../../types/validation-item.type";
import type {HttpResult} from "../../types/http.types";
import type {CategoryResponse} from "../../types/category-response.type";

export class IncomesCreate {
    readonly openNewRoute: OpenNewRoute;
    readonly validations: ValidationItem[] = [];
    private inputElement: HTMLInputElement | null = null;
    private createBtn: HTMLButtonElement | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;

        this.findElements();

        this.validations = [
            {element: this.inputElement}
        ];

        if (this.createBtn) {
            this.createBtn.addEventListener('click', this.saveCategory.bind(this));
        }

        const cancelBtn: HTMLElement | null = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e: MouseEvent): void => {
                e.preventDefault();
                window.history.back();
            });
        }
    }

    private findElements(): void {
        this.inputElement = document.getElementById('category-name') as HTMLInputElement;
        this.createBtn = document.getElementById('create-btn') as HTMLButtonElement;
    }

    private async saveCategory(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {

            const result: HttpResult<CategoryResponse> = await HttpUtils.request<CategoryResponse>('/categories/income', 'POST', true, {
                title: this.inputElement?.value
            });

            if (result.redirect) {
                return this.openNewRoute(result.redirect);
            }

            if (result.error || !result.response) {
                return ToastUtils.show('Не удалось создать. Возможно, категория с таким именем уже существует.', 'danger');
            }

            return this.openNewRoute('/incomes');
        }
    }
}