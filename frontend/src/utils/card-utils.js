export class CardUtils {
    static createCard(title, id, editUrl, deleteCallback = null) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4';

        const cardElement = document.createElement('div');
        cardElement.className = 'card border rounded-3 h-100 border-light-gray';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title text-dark-purple mb-2 fs-3';
        cardTitle.innerText = title;
        cardBody.appendChild(cardTitle);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex gap-2';

        const editButton = document.createElement('a');
        editButton.className = 'btn btn-primary fw-medium';
        editButton.innerText = 'Редактировать';
        editButton.href = editUrl;
        buttonContainer.appendChild(editButton);

        if (deleteCallback) {
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#delete-modal');
            deleteButton.setAttribute('data-id', id);
            buttonContainer.appendChild(deleteButton);
        }

        cardBody.appendChild(buttonContainer);
        cardElement.appendChild(cardBody);
        cardContainer.appendChild(cardElement);

        return cardContainer;
    }
}