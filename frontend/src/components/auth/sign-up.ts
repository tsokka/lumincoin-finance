import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";
import type {OpenNewRoute} from "../../types/open-new-route.type";
import type {ValidationItem} from "../../types/validation-item.type";
import type {SignUpResponse} from "../../types/auth.types";

export class SignUp {
    readonly openNewRoute: OpenNewRoute;
    readonly validations: ValidationItem[] = [];
    private nameElement: HTMLInputElement | null = null;
    private lastNameElement: HTMLInputElement | null = null;
    private emailElement: HTMLInputElement | null = null;
    private passwordElement: HTMLInputElement | null = null;
    private passwordRepeatElement: HTMLInputElement | null = null;
    private commonErrorElement: HTMLElement | null = null;

    constructor(openNewRoute: OpenNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.findElements();

        this.validations = [
            {
                element: this.nameElement,
                options: {pattern: /^[А-ЯЁ][а-яё\s]*$/}
            },
            {
                element: this.lastNameElement,
                options: {pattern: /^[А-ЯЁ][а-яё\s]*$/}
            },
            {
                element: this.emailElement,
                options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}
            },
            {
                element: this.passwordElement,
                options: {pattern: /^(?=.*\d)(?=.*[A-Z]).{8,}$/}
            },
            {
                element: this.passwordRepeatElement,
                options: {compareTo: this.passwordElement?.value ?? ''}
            }
        ];

        document.getElementById('process-button')?.addEventListener('click', this.signUp.bind(this));
    }

    private findElements(): void {
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.lastNameElement = document.getElementById('last-name') as HTMLInputElement;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;
        this.commonErrorElement = document.getElementById('common-error');
    }

    private async signUp(): Promise<void> {
        if (this.commonErrorElement) {
            this.commonErrorElement.style.display = 'none';
        }

        for (const item of this.validations) {
            if (item.element === this.passwordRepeatElement && item.options && 'compareTo' in item.options) {
                item.options.compareTo = this.passwordElement?.value ?? '';
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const result = await HttpUtils.request<SignUpResponse>('/signup', 'POST', false, {
                name: this.nameElement?.value,
                lastName: this.lastNameElement?.value,
                email: this.emailElement?.value,
                password: this.passwordElement?.value,
                passwordRepeat: this.passwordRepeatElement?.value
            });

            if (result.error || !result.response || !result.response.user) {
                if (this.commonErrorElement) {
                    this.commonErrorElement.style.display = 'block';
                }
                return;
            }

            sessionStorage.setItem('registeredEmail', result.response.user.email);

            this.openNewRoute('/login');
        }
    }
}