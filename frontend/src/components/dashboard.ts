import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import {DateFilterUtils} from "../utils/date-filter-utils";
import type {OpenNewRoute} from "../types/open-new-route.type";
import type {HttpResult} from "../types/http.types";
import type {Operation, ChartData} from "../types/operation.type";
import {Chart, type Plugin, type LegendElement, type ChartTypeRegistry} from "chart.js";
import "../config/chart-setup";

export class Dashboard {
    readonly openNewRoute: OpenNewRoute;
    private incomeChart: Chart | null = null;
    private expenseChart: Chart | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;
        this.setupFilters();
        this.initCharts();
        this.getOperations('today').then();
    }

    private setupFilters(): void {
        DateFilterUtils.init(
            'interval-btn',
            'date-from-btn',
            'date-to-btn',
            'date-from-input',
            'date-to-input',
            (period: string, dateFrom: string | null, dateTo: string | null): void => {
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
            return ToastUtils.show('Возникла ошибка при загрузке данных. Обратитесь в поддержку.', 'danger');
        }

        this.updateCharts(result.response);
    }

    private initCharts(): void {
        const fixedLegendPlugin: Plugin = {
            id: 'fixedLegendHeight',
            beforeInit(chart: Chart): void {
                const legend = chart.legend as LegendElement<keyof ChartTypeRegistry> | undefined;
                if (!legend) return;
                const originalFit: () => void = legend.fit;
                legend.fit = function fit(): void {
                    originalFit.bind(chart.legend)();
                    if (this.height < 70) {
                        this.height = 70;
                    }
                };
            }
        };

        const incomeCanvas = document.getElementById('income-chart') as HTMLCanvasElement | null;
        const expenseCanvas = document.getElementById('expense-chart') as HTMLCanvasElement | null;

        if (incomeCanvas) {
            this.incomeChart = new Chart(incomeCanvas, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                    datasets: [{
                        label: 'Доходы',
                        data: [30, 40, 20, 15, 10],
                        backgroundColor: [
                            '#DC3545',
                            '#FD7E14',
                            '#FFC107',
                            '#20C997',
                            '#0D6EFD'
                        ]
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 35,
                                color: '#000',
                                font: {weight: 500}
                            }
                        }
                    }
                },
                plugins: [fixedLegendPlugin]
            });
        }

        if (expenseCanvas) {
            this.expenseChart = new Chart(expenseCanvas, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
                    datasets: [{
                        label: 'Расходы',
                        data: [25, 30, 35, 20, 15],
                        backgroundColor: [
                            '#DC3545',
                            '#FD7E14',
                            '#FFC107',
                            '#20C997',
                            '#0D6EFD'
                        ]
                    }]
                },
                options: {
                    responsive: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 35,
                                color: '#000',
                                font: {weight: 500}
                            }
                        }
                    }
                },
                plugins: [fixedLegendPlugin]
            });
        }
    }

    private updateCharts(operations: Operation[]): void {
        const incomes: Operation[] = operations.filter(op => op.type === 'income');
        const expenses: Operation[] = operations.filter(op => op.type === 'expense');

        const incomeData: ChartData = this.prepareChartData(incomes);
        const expenseData: ChartData = this.prepareChartData(expenses);

        if (incomeData.data.length === 0) {
            this.showEmptyMessage('income-chart', 'Нет доходов за выбранный период');
        } else {
            this.hideEmptyMessage('income-chart');
            this.renderChart(this.incomeChart, incomeData);
        }

        if (expenseData.data.length === 0) {
            this.showEmptyMessage('expense-chart', 'Нет расходов за выбранный период');
        } else {
            this.hideEmptyMessage('expense-chart');
            this.renderChart(this.expenseChart, expenseData);
        }
    }

    private showEmptyMessage(canvasId: string, message: string): void {
        const canvas: HTMLElement | null = document.getElementById(canvasId);
        if (!canvas) return;

        const container: HTMLElement | null = canvas.parentElement;
        canvas.style.display = 'none';

        if (!container) return;

        let messageEl: Element | null = container.querySelector('.empty-chart-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'empty-chart-message text-center text-secondary py-5';
            container.appendChild(messageEl);
        }
        messageEl.textContent = message;
    }

    private hideEmptyMessage(canvasId: string): void {
        const canvas: HTMLElement | null = document.getElementById(canvasId);
        if (!canvas) return;

        const container: HTMLElement | null = canvas.parentElement;
        canvas.style.display = 'block';

        if (!container) return;
        const messageEl: Element | null = container.querySelector('.empty-chart-message');
        if (messageEl) {
            messageEl.remove();
        }
    }

    private prepareChartData(operations: Operation[]): ChartData {
        const map: Record<string, number> = {};

        operations.forEach(op => {
            const categoryName: string = op.category ? op.category : 'Без категории';
            if (!map[categoryName]) {
                map[categoryName] = 0;
            }
            map[categoryName] += op.amount;
        });

        return {
            labels: Object.keys(map),
            data: Object.values(map)
        };
    }

    private renderChart(chartInstance: Chart | null, data: ChartData): void {
        if (!chartInstance) return;

        if (data.labels) {
            chartInstance.data.labels = data.labels;
        }

        if (chartInstance.data.datasets[0]) {
            chartInstance.data.datasets[0].data = data.data;
        }

        chartInstance.update();
    }

}