export class Charts {
    constructor() {
        const incomeCtx = document.getElementById('incomeChart').getContext('2d');
        const incomeChart = new Chart(incomeCtx, {
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
            plugins: [{
                id: 'legendMargin',
                beforeInit(chart) {
                    const originalFit = chart.legend.fit;
                    chart.legend.fit = function fit() {
                        originalFit.bind(chart.legend)();
                        this.height += 30;
                    };
                }
            }]
        });

        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        const expenseChart = new Chart(expenseCtx, {
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
            plugins: [{
                id: 'legendMargin',
                beforeInit(chart) {
                    const originalFit = chart.legend.fit;
                    chart.legend.fit = function fit() {
                        originalFit.bind(chart.legend)();
                        this.height += 30;
                    };
                }
            }]
        });
    }
}