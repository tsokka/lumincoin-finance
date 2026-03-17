import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {LoginResponse} from "../../types/auth.types";
import type {HttpResult} from "../../types/http.types";
import type {ValidationItem} from "../../types/validation-item.type";

export class Login {
    readonly openNewRoute: OpenNewRoute;
    readonly emailElement: HTMLInputElement | null = null;
    readonly passwordElement: HTMLInputElement | null = null;
    readonly rememberMeElement: HTMLInputElement | null = null;
    readonly commonErrorElement: HTMLElement | null = null;
    readonly validations: ValidationItem[] = [];

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.emailElement = document.getElementById('email') as HTMLInputElement | null;
        this.passwordElement = document.getElementById('password') as HTMLInputElement | null;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement | null;
        this.commonErrorElement = document.getElementById('common-error');

        this.validations = [
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement}
        ];

        const registeredEmail: string | null = sessionStorage.getItem('registeredEmail');
        if (registeredEmail && this.emailElement && this.passwordElement) {
            this.emailElement.value = registeredEmail;
            this.passwordElement.focus();
            sessionStorage.removeItem('registeredEmail');
        }

        const processButton = document.getElementById('process-button') as HTMLButtonElement | null;
        if (processButton) {
            processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private async login(): Promise<void> {
        if (!this.commonErrorElement) return;

        this.commonErrorElement.style.display = 'none';

        if (ValidationUtils.validateForm(this.validations)) {

            if (!this.emailElement || !this.passwordElement || !this.rememberMeElement) {
                return;
            }

            const result: HttpResult<LoginResponse> = await HttpUtils.request(
                '/login',
                'POST',
                false,
                {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                }
            );

            if (
                result.error ||
                !result.response ||
                !result.response.tokens ||
                !result.response.user
            ) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(
                result.response.tokens.accessToken,
                result.response.tokens.refreshToken,
                result.response.user
            );

            const profileNameElement: HTMLElement | null = document.getElementById('profile-name');
            if (profileNameElement && result.response.user) {
                profileNameElement.innerText = result.response.user.name + ' ' + result.response.user.lastName;
            }

            this.openNewRoute('/');
        }
    }
}