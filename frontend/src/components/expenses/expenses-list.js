import {HttpUtils} from "../../utils/http-utils";

export class ExpensesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getExpenses().then();
    }

    async getExpenses() {
        const result = await HttpUtils.request('/categories/expense');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при получении списка расходов. Обратитесь в поддержку.');
        }

        this.showRecords(result.response);
    }

    showRecords(expenses) {
        const recordsElement = document.getElementById('records');

        expenses.forEach(expense => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4';

            const cardElement = document.createElement('div');
            cardElement.className = 'card border rounded-3 h-100 border-light-gray';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title text-dark-purple mb-2 fs-3';
            cardTitle.innerText = expense.title;

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex gap-2';

            const editButton = document.createElement('a');
            editButton.className = 'btn btn-primary fw-medium';
            editButton.innerText = 'Редактировать';
            editButton.href = '/expenses/edit?id=' + expense.id;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal');
            deleteButton.setAttribute('data-id', expense.id); // точно надо?

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(buttonContainer);

            cardElement.appendChild(cardBody);

            cardContainer.appendChild(cardElement);

            recordsElement.appendChild(cardContainer);
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