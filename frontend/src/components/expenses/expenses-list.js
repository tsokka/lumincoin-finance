import {HttpUtils} from "../../utils/http-utils";
import {ToastUtils} from "../../utils/toast-utils";
import {DeleteModalUtils} from "../../utils/delete-modal-utils";
import {CategoriesService} from "../../services/categories-service";
import {CardUtils} from "../../utils/card-utils";

export class ExpensesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.getExpenses().then();

        DeleteModalUtils.init((id) => {
            this.deleteCategory(id).then();
        });
    }

    async deleteCategory(id) {
        const success = await CategoriesService.deleteExpense(id, this.openNewRoute);
        if (success) {
            await this.getExpenses();
        }
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return ToastUtils.show('Не удалось загрузить список расходов. Обратитесь в поддержку.', 'danger');
        }

        this.showRecords(result.response);
    }

    showRecords(expenses) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        expenses.forEach(expense => {
            const card = CardUtils.createCard(
                expense.title,
                expense.id,
                `/expenses/edit?id=${expense.id}`,
                (id) => this.deleteCategory(id)
            );
            recordsElement.appendChild(card);
        });

        const addCardContainer = document.createElement('div');
        addCardContainer.className = 'col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4';

        const addCard = document.createElement('div');
        addCard.className = 'card border rounded-3 h-100 border-light-gray';

        const addCardLink = document.createElement('a');
        addCardLink.href = '/expenses/create';
        addCardLink.className = 'card-body d-flex align-items-center justify-content-center';

        addCardLink.innerHTML = `
            <button class="btn btn-link text-secondary border-0 p-0">
                <i class="bi bi-plus-lg fs-3 text-light-gray"></i>
            </button>
        `;

        addCard.appendChild(addCardLink);
        addCardContainer.appendChild(addCard);

        recordsElement.appendChild(addCardContainer);
    }
}