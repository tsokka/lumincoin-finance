import {HttpUtils} from "../utils/http-utils";
import {ToastUtils} from "../utils/toast-utils";
import type {HttpResult} from "../types/http.types";
import {Modal} from "bootstrap";
import type {CategoryResponse} from "../types/category-response.type";

export class CategoriesService {
    private static async getCategory(type: string, id: number): Promise<CategoryResponse | null> {
        const result: HttpResult<CategoryResponse> = await HttpUtils.request(`/categories/${type}/${id}`);

        if (result.redirect) {
            return {redirect: result.redirect};
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            ToastUtils.show('Не удалось загрузить данные категории. Попробуйте обновить страницу.', 'danger');
            return null;
        }

        return result.response;
    }

    public static async getExpense(id: string): Promise<CategoryResponse | null> {
        return this.getCategory('expense', Number(id));
    }

    public static async getIncome(id: string): Promise<CategoryResponse | null> {
        return this.getCategory('income', Number(id));
    }

    private static async deleteCategory(type: string, id: number, openNewRouteCallback: ((url: string) => void) | null = null): Promise<boolean> {
        const result: HttpResult<CategoryResponse> = await HttpUtils.request(`/categories/${type}/${id}`, 'DELETE', true);

        if (result.redirect) {
            if (openNewRouteCallback) openNewRouteCallback(result.redirect);
            return true;
        }

        if (result.error || !result.response || (result.response && result.response.error)) {
            ToastUtils.show('Не удалось удалить категорию. Возможно, она используется в операциях.', 'danger');
            return false;
        }

        const deleteModalElement: HTMLElement | null = document.getElementById('delete-modal');
        if (deleteModalElement) {
            const modalInstance: Modal | null = Modal.getInstance(deleteModalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }

        return true;
    }

    public static async deleteExpense(id: number, openNewRouteCallback: ((url: string) => void) | null = null): Promise<boolean> {
        return this.deleteCategory('expense', id, openNewRouteCallback);
    }

    public static async deleteIncome(id: number, openNewRouteCallback: ((url: string) => void) | null = null): Promise<boolean> {
        return this.deleteCategory('income', id, openNewRouteCallback);
    }
}