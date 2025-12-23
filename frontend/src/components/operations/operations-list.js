import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {ToastUtils} from "../../utils/toast-utils";
import {DateFilterUtils} from "../../utils/date-filter-utils";

export class OperationsList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationIdToDelete = null;

        this.currentPeriod = 'today';
        this.currentDateFrom = null;
        this.currentDateTo = null;

        this.setupFilters();
        this.setupDeleteModal();
        this.getOperations('today').then();
    }

    setupDeleteModal() {
        const deleteModal = document.getElementById('delete-modal');
        const confirmDeleteBtn = deleteModal ? deleteModal.querySelector('#confirm-delete-btn') : null;

        if (deleteModal) {
            deleteModal.addEventListener('show.bs.modal', (event) => {
                const button = event.relatedTarget;
                this.operationIdToDelete = button.getAttribute('data-id');
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                if (this.operationIdToDelete) {
                    this.deleteOperation(this.operationIdToDelete).then();
                }
            });
        }
    }

    async deleteOperation(id) {
        const result = await HttpUtils.request('/operations/' + id, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return ToastUtils.show('Не удалось удалить операцию. Обратитесь в поддержку.', 'danger');
        }

        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('delete-modal'));
        if (deleteModal) {
            deleteModal.hide();
        }

        await this.getOperations(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
    }

    setupFilters() {
        DateFilterUtils.init(
            'interval-btn',
            'date-from-btn',
            'date-to-btn',
            'date-from-input',
            'date-to-input',
            (period, dateFrom, dateTo) => {
                this.currentPeriod = period;
                this.currentDateFrom = dateFrom;
                this.currentDateTo = dateTo;
                this.getOperations(period, dateFrom, dateTo).then();
            }
        );
    }

    async getOperations(period = 'all', dateFrom = null, dateTo = null) {
        let url = '/operations?period=' + period;

        if (period === 'interval' && dateFrom && dateTo) {
            url += '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const result = await HttpUtils.request(url);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return ToastUtils.show('Ошибка загрузки данных. Обратитесь в поддержку.', 'danger');
        }

        this.showRecords(result.response);
    }

    showRecords(operations) {
        const recordsElement = document.getElementById('records');
        recordsElement.innerHTML = '';

        if (!operations || operations.length === 0) {
            const trElement = document.createElement('tr');
            const tdElement = trElement.insertCell();
            tdElement.colSpan = 7;
            tdElement.className = 'text-center text-secondary py-5';
            tdElement.innerText = 'Нет операций за выбранный период';
            recordsElement.appendChild(trElement);
            return;
        }

        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            trElement.insertCell().innerText = (i + 1).toString();

            let typeHtml = null;
            switch (operations[i].type) {
                case config.operationsType.income:
                    typeHtml = '<span class="text-success">доход</span>';
                    break;
                case config.operationsType.expense:
                    typeHtml = '<span class="text-danger">расход</span>';
                    break;
                default:
                    typeHtml = '<span class="text-secondary">неизвестно</span>';
            }

            trElement.insertCell().innerHTML = typeHtml;
            trElement.insertCell().innerText = (operations[i].category || 'без категории').toLowerCase();
            trElement.insertCell().innerText = operations[i].amount.toLocaleString() + '$';
            trElement.insertCell().innerText = operations[i].date.split('-').reverse().join('.');
            trElement.insertCell().innerText = String(operations[i].comment || '').toLowerCase();
            trElement.insertCell().innerHTML =
                '<button class="btn btn-link text-dark p-0 me-2" data-bs-toggle="modal" data-bs-target="#delete-modal" data-id="' + operations[i].id + '">' +
                '<i class="bi bi-trash"></i>' +
                '</button>' +
                '<a href="/operations/edit?id=' + operations[i].id + '" class="btn btn-link text-dark p-0">' +
                '<i class="bi bi-pencil"></i>' +
                '</a>';

            recordsElement.appendChild(trElement);
        }
    }
}