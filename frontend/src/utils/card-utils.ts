export class CardUtils {
    public static createCard(
        title: string,
        id: number,
        editUrl: string,
        deleteCallback: ((id: string) => void | Promise<void>) | null = null
    ): HTMLDivElement {
        const cardContainer: HTMLDivElement = document.createElement('div');
        cardContainer.className = 'col-12 col-sm-6 col-md-12 col-lg-6 col-xl-4';

        const cardElement: HTMLDivElement = document.createElement('div');
        cardElement.className = 'card border rounded-3 h-100 border-light-gray';

        const cardBody: HTMLDivElement = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle: HTMLHeadingElement = document.createElement('h5');
        cardTitle.className = 'card-title text-dark-purple mb-2 fs-3';
        cardTitle.innerText = title;
        cardBody.appendChild(cardTitle);

        const buttonContainer: HTMLDivElement = document.createElement('div');
        buttonContainer.className = 'd-flex gap-2';

        const editButton: HTMLAnchorElement = document.createElement('a');
        editButton.className = 'btn btn-primary fw-medium';
        editButton.innerText = 'Редактировать';
        editButton.href = editUrl;
        buttonContainer.appendChild(editButton);

        if (deleteCallback) {
            const deleteButton: HTMLButtonElement = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerText = 'Удалить';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#delete-modal');
            deleteButton.setAttribute('data-id', String(id));
            buttonContainer.appendChild(deleteButton);
        }

        cardBody.appendChild(buttonContainer);
        cardElement.appendChild(cardBody);
        cardContainer.appendChild(cardElement);

        return cardContainer;
    }
}