import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import {UrlUtils} from "../../utils/url-utils";
import {CategoriesService} from "../../services/categories-service";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {ValidationItem} from "../../types/validation-item.type";
import type {CategoryResponse} from "../../types/category-response.type";
import type {HttpResult} from "../../types/http.types";

export class ExpensesEdit {
    readonly openNewRoute: OpenNewRoute;
    readonly validations: ValidationItem[] = [];
    private inputElement: HTMLInputElement | null = null;
    private saveBtn: HTMLButtonElement | null = null;
    private cancelBtn: HTMLButtonElement | null = null;
    private originalData: CategoryResponse | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;

        const id: string | null = UrlUtils.getUrlParam('id');

        if (!id) {
            this.openNewRoute('/expenses');
            return
        }

        this.findElements();

        this.validations = [
            {element: this.inputElement}
        ];

        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', this.updateCategory.bind(this));
        }

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', (e: MouseEvent): void => {
                e.preventDefault();
                this.openNewRoute('/expenses');
            });
        }

        this.getCategory(id).then();
    }

    private findElements(): void {
        this.inputElement = document.getElementById('title-input') as HTMLInputElement;
        this.saveBtn = document.getElementById('update-btn') as HTMLButtonElement;
        this.cancelBtn = document.getElementById('cancel-btn') as HTMLButtonElement;
    }

    private async getCategory(id: string): Promise<void> {
        const category: CategoryResponse | null = await CategoriesService.getExpense(id);

        if (category && category.redirect) {
            return this.openNewRoute(category.redirect);
        }

        if (!category) {
            return;
        }

        this.originalData = category;
        this.showCategory(category);
    }

    private showCategory(category: CategoryResponse): void {
        if (this.inputElement && category.title != null) {
            this.inputElement.value = String(category.title);
        }
    }

    private async updateCategory(e: MouseEvent): Promise<void> {
        e.preventDefault();

        if (ValidationUtils.validateForm(this.validations)) {
            if (this.originalData && this.inputElement) {
                const result: HttpResult<CategoryResponse> = await HttpUtils.request<CategoryResponse>('/categories/expense/' + String(this.originalData.id), 'PUT', true, {
                    title: this.inputElement.value
                });

                if (result.redirect) {
                    return this.openNewRoute(result.redirect);
                }

                if (result.error || !result.response || (result.response && result.response.error)) {
                    return ToastUtils.show('Ошибка сохранения категории расхода. Попробуйте другое название.', 'danger');
                }
            }
            return this.openNewRoute('/expenses');
        }
    }
}