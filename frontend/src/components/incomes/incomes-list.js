import {HttpUtils} from "../../utils/http-utils";

export class IncomesList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.getIncomes().then();
    }

    async getIncomes() {
        const result = await HttpUtils.request('/categories/income');
        if (result.redirect) {
            return this.openNewRoute(result.redirect);
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            return alert('Возникла ошибка при получении списка доходов. Обратитесь в поддержку.');
        }

        this.showRecords(result.response);
    }

    showRecords(incomes) {
        console.log(incomes);
    }
}