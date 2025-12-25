import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {ValidationUtils} from "../../utils/validation-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {
                element: this.nameElement,
                options: { pattern: /^[А-ЯЁ][а-яё\s]*$/ }
            },
            {
                element: this.lastNameElement,
                options: { pattern: /^[А-ЯЁ][а-яё\s]*$/ }
            },
            {
                element: this.emailElement,
                options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ }
            },
            {
                element: this.passwordElement,
                options: { pattern: /^(?=.*\d)(?=.*[A-Z]).{8,}$/ }
            },
            {
                element: this.passwordRepeatElement,
                options: { compareTo: this.passwordElement.value }
            }
        ];

        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastNameElement = document.getElementById('last-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signUp() {
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: this.nameElement.value,
                lastName: this.lastNameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (result.error || !result.response || (result.response && !result.response.user)) {
                this.commonErrorElement.style.display = 'block';
                return;
            }

            sessionStorage.setItem('registeredEmail', result.response.user.email);

            this.openNewRoute('/login');
        }
    }
}