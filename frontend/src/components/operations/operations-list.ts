import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {ToastUtils} from "../../utils/toast-utils";
import {DateFilterUtils} from "../../utils/date-filter-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {Operation, OperationResponse} from "../../types/operation.type";
import {Modal} from "bootstrap";
import type {HttpResult} from "../../types/http.types";
import type {ModalEvent} from "../../types/bootstrap.type";

export class OperationsList {
    readonly openNewRoute: OpenNewRoute;
    private operationIdToDelete: string | null = null;
    private currentPeriod: string = 'today';
    private currentDateFrom: string | null = null;
    private currentDateTo: string | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.setupFilters();
        this.setupDeleteModal();
        this.getOperations('today').then();
    }

    private setupDeleteModal(): void {
        const deleteModal: HTMLElement | null = document.getElementById('delete-modal');
        const confirmDeleteBtn: Element | null = deleteModal ? deleteModal.querySelector('#confirm-delete-btn') : null;

        if (deleteModal) {
            deleteModal.addEventListener('show.bs.modal', (event: Event): void => {
                const button = (event as ModalEvent).relatedTarget as HTMLElement | null;
                this.operationIdToDelete = button?.getAttribute('data-id') ?? null;
            });
        }

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (): void => {
                if (this.operationIdToDelete) {
                    this.deleteOperation(this.operationIdToDelete).then();
                }
            });
        }
    }

    private async deleteOperation(id: string): Promise<void> {
        const result: HttpResult<OperationResponse> = await HttpUtils.request<OperationResponse>('/operations/' + id, 'DELETE', true);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || result.response.error) {
            return ToastUtils.show('Не удалось удалить операцию. Обратитесь в поддержку.', 'danger');
        }

        const modalElement: HTMLElement | null = document.getElementById('delete-modal');
        if (modalElement) {
            const deleteModal: Modal | null = Modal.getInstance(modalElement);
            if (deleteModal) deleteModal.hide();
        }

        await this.getOperations(this.currentPeriod, this.currentDateFrom, this.currentDateTo);
    }

    private setupFilters(): void {
        DateFilterUtils.init(
            'interval-btn',
            'date-from-btn',
            'date-to-btn',
            'date-from-input',
            'date-to-input',
            (period: string, dateFrom: string | null, dateTo: string | null): void => {
                this.currentPeriod = period;
                this.currentDateFrom = dateFrom;
                this.currentDateTo = dateTo;
                this.getOperations(period, dateFrom, dateTo).then();
            }
        );
    }

    private async getOperations(period: string = 'all', dateFrom: string | null = null, dateTo: string | null = null): Promise<void> {
        let url: string = '/operations?period=' + period;

        if (period === 'interval' && dateFrom && dateTo) {
            url += '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
        }

        const result: HttpResult<Operation[]> = await HttpUtils.request<Operation[]>(url);

        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response) {
            return ToastUtils.show('Ошибка загрузки данных. Обратитесь в поддержку.', 'danger');
        }

        this.showRecords(result.response);
    }

    private showRecords(operations: Operation[]): void {
        const recordsElement: HTMLElement | null = document.getElementById('records');
        if (recordsElement) {
            recordsElement.innerHTML = '';
        }

        if (!operations || operations.length === 0) {
            const trElement: HTMLTableRowElement = document.createElement('tr');
            const tdElement: HTMLTableCellElement = trElement.insertCell();
            tdElement.colSpan = 7;
            tdElement.className = 'text-center text-secondary py-5';
            tdElement.innerText = 'Нет операций за выбранный период';
            if (recordsElement) {
                recordsElement.appendChild(trElement);
            }
            return;
        }

        operations.forEach((operation: Operation, i: number): void => {
            const trElement: HTMLTableRowElement = document.createElement('tr');

            trElement.insertCell().innerText = (i + 1).toString();

            let typeHtml: string;
            switch (operation.type) {
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
            trElement.insertCell().innerText = (operation.category || 'без категории').toLowerCase();
            trElement.insertCell().innerText = operation.amount.toLocaleString() + '$';
            trElement.insertCell().innerText = operation.date.split('-').reverse().join('.');
            trElement.insertCell().innerText = String(operation.comment || '').toLowerCase();
            trElement.insertCell().innerHTML =
                '<button class="btn btn-link text-dark p-0 me-2" data-bs-toggle="modal" data-bs-target="#delete-modal" data-id="' + operation.id + '">' +
                '<i class="bi bi-trash"></i>' +
                '</button>' +
                '<a href="/operations/edit?id=' + operation.id + '" class="btn btn-link text-dark p-0">' +
                '<i class="bi bi-pencil"></i>' +
                '</a>';

            if (recordsElement) {
                recordsElement.appendChild(trElement);
            }
        });
    }
}