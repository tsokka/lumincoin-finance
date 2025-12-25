import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import {DateFilterUtils} from "../utils/date-filter-utils";

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.setupFilters();
        this.initCharts();
        this.getOperations('today').then();
    }

    setupFilters() {
        DateFilterUtils.init(
            'interval-btn',
            'date-from-btn',
            'date-to-btn',
            'date-from-input',
            'date-to-input',
            (period, dateFrom, dateTo) => {
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
            return ToastUtils.show('Возникла ошибка при загрузке данных. Обратитесь в поддержку.', 'danger');
        }

        this.updateCharts(result.response);
    }

    initCharts() {
        const fixedLegendPlugin = {
            id: 'fixedLegendHeight',
            beforeInit(chart) {
                const originalFit = chart.legend.fit;
                chart.legend.fit = function fit() {
                    originalFit.bind(chart.legend)();

                    if (this.height < 70) {
                        this.height = 70;
                    }
                };
            }
        };

        const incomeCtx = document.getElementById('income-chart').getContext('2d');
        this.incomeChart = new Chart(incomeCtx, {
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
                            font: {
                                weight: '500'
                            }
                        }
                    }
                }
            },
            plugins: [fixedLegendPlugin]
        });

        const expenseCtx = document.getElementById('expense-chart').getContext('2d');
        this.expenseChart = new Chart(expenseCtx, {
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
                            font: {
                                weight: '500'
                            }
                        }
                    }
                }
            },
            plugins: [fixedLegendPlugin]
        });
    }

    updateCharts(operations) {
        const incomes = operations.filter(op => op.type === 'income');
        const expenses = operations.filter(op => op.type === 'expense');

        const incomeData = this.prepareChartData(incomes);
        const expenseData = this.prepareChartData(expenses);

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

    showEmptyMessage(canvasId, message) {
        const canvas = document.getElementById(canvasId);
        const container = canvas.parentElement;

        canvas.style.display = 'none';

        let messageEl = container.querySelector('.empty-chart-message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'empty-chart-message text-center text-secondary py-5';
            container.appendChild(messageEl);
        }
        messageEl.textContent = message;
    }

    hideEmptyMessage(canvasId) {
        const canvas = document.getElementById(canvasId);
        const container = canvas.parentElement;

        canvas.style.display = 'block';

        const messageEl = container.querySelector('.empty-chart-message');
        if (messageEl) {
            messageEl.remove();
        }
    }

    prepareChartData(operations) {
        const map = {};
        operations.forEach(op => {
            const categoryName = op.category ? op.category : 'Без категории';

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

    renderChart(chartInstance, data) {
        if (!chartInstance) return;

        chartInstance.data.labels = data.labels;
        chartInstance.data.datasets[0].data = data.data;

        chartInstance.update();
    }

}