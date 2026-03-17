import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {DeleteModalUtils} from "../../utils/delete-modal-utils";
import {CategoriesService} from "../../services/categories-service";
import {CardUtils} from "../../utils/card-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {HttpResult} from "../../types/http.types";
import type {Category} from "../../types/category-response.type";

export class IncomesList {
    readonly openNewRoute: OpenNewRoute;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getIncomes().then();

        DeleteModalUtils.init((id: string): Promise<void> => this.deleteCategory(id));
    }

    private async deleteCategory(id: string): Promise<void> {
        const success: boolean = await CategoriesService.deleteIncome(Number(id), this.openNewRoute);
        if (success) {
            await this.getIncomes();
        }
    }

    private async getIncomes(): Promise<void> {
        const result: HttpResult<Category[]> = await HttpUtils.request<Category[]>('/categories/income');

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response) {
            return ToastUtils.show('Не удалось загрузить список доходов. Обратитесь в поддержку.', 'danger');
        }

        this.showRecords(result.response);
    }

    private showRecords(incomes: Category[]): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (recordsElement) {
            recordsElement.innerHTML = '';
        }

        incomes.forEach((income: Category): void => {
            const card: HTMLDivElement = CardUtils.createCard(
                income.title,
                income.id,
                `/incomes/edit?id=${income.id}`,
                (id: string): Promise<void> => this.deleteCategory(id)
            );
            recordsElement?.appendChild(card);
        });

        const addCardContainer: HTMLDivElement = document.createElement('div');
        addCardContainer.className = 'col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4';

        const addCard: HTMLDivElement = document.createElement('div');
        addCard.className = 'card border rounded-3 h-100 border-light-gray';

        const addCardLink: HTMLAnchorElement = document.createElement('a');
        addCardLink.href = '/incomes/create';
        addCardLink.className = 'card-body d-flex align-items-center justify-content-center';

        addCardLink.innerHTML = `
            <button class="btn btn-link text-secondary border-0 p-0">
                <i class="bi bi-plus-lg fs-3 text-light-gray"></i>
            </button>
        `;

        addCard.appendChild(addCardLink);
        addCardContainer.appendChild(addCard);

        recordsElement?.appendChild(addCardContainer);
    }
}