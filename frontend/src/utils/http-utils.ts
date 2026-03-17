import {AuthUtils} from "./auth-utils";
import config from "../config/config";
import type {HttpResult} from "../types/http.types";

export class HttpUtils {
    public static async request<T>(
        url: string,
        method: string = 'GET',
        useAuth: boolean = true,
        body?: unknown
    ): Promise<HttpResult<T>> {
        const result: HttpResult<T> = {
            error: false,
            response: null
        };

        const headers: Record<string, string> = {
            'Content-type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': 'token'
        };

        const params: RequestInit = {
            method: method,
            headers: headers
        };

        let token: string | null = null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
            if (token) {
                headers['x-auth-token'] = token;
            }
        }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response: Response | null = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json() as T;
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    // 1 - токена нет
                    result.redirect = '/login';
                } else {
                    // 2 - токен устарел/невалидный (надо обновить)
                    const updateTokenResult: boolean = await AuthUtils.updateRefreshToken();

                    if (updateTokenResult) {
                        // запрос повторно
                        return this.request(url, method, useAuth, body);
                    } else {
                        result.redirect = '/login';
                    }
                }
            }
        }

        return result;
    }
}