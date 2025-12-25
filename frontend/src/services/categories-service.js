import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";

export class CategoriesService {
    static async getCategory(type, id) {
        const result = await HttpUtils.request(`/categories/${type}/${id}`);

        if (result.redirect) {
            return {redirect: result.redirect};
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            ToastUtils.show('Не удалось загрузить данные категории. Попробуйте обновить страницу.', 'danger');
            return null;
        }

        return result.response;
    }

    static async getExpense(id) {
        return this.getCategory('expense', id);
    }

    static async getIncome(id) {
        return this.getCategory('income', id);
    }

    static async deleteCategory(type, id, openNewRouteCallback = null) {
        const result = await HttpUtils.request(`/categories/${type}/${id}`, 'DELETE', true);

        if (result.redirect) {
            if (openNewRouteCallback) openNewRouteCallback(result.redirect);
            return true;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            ToastUtils.show('Не удалось удалить категорию. Возможно, она используется в операциях.', 'danger');
            return false;
        }

        const deleteModalElement = document.getElementById('delete-modal');
        if (deleteModalElement) {
            const modalInstance = bootstrap.Modal.getInstance(deleteModalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }

        return true;
    }

    static async deleteExpense(id, openNewRouteCallback = null) {
        return this.deleteCategory('expense', id, openNewRouteCallback);
    }

    static async deleteIncome(id, openNewRouteCallback = null) {
        return this.deleteCategory('income', id, openNewRouteCallback);
    }
}