import {AuthUtils} from "./auth-utils";
import config from "../config/config";

export class HttpUtils {
    static async request(url, method = 'GET', body = null) {
        const result = {
            error: false,
            response: null
        };

        const params = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                // 'authorization': 'token'
            },
        };

        // let token = null;
        // if (useAuth) {
        //     token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
        //     if (token) {
        //         params.headers['authorization'] = token;
        //     }
        // }

        if (body) {
            params.body = JSON.stringify(body);
        }

        let response = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }

        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            // if (useAuth && response.status === 401) {
            //     if (!token) {
            //         // 1 - токена нет
            //         result.redirect = '/login';
            //     } else {
            //         // 2 - токен устарел/невалидный (надо обновить)
            //         const updateTokenResult = await AuthUtils.updateRefreshToken();
            //
            //         if (updateTokenResult) {
            //             // запрос повторно
            //             return this.request(url, useAuth, method, body);
            //         } else {
            //             result.redirect = '/login';
            //         }
            //     }
            // }
        }

        return result;
    }
}