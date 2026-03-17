import {Dashboard} from "./components/dashboard";
import {Login} from "./components/auth/login";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {IncomesList} from "./components/incomes/incomes-list";
import {IncomesCreate} from "./components/incomes/incomes-create";
import {IncomesEdit} from "./components/incomes/incomes-edit";
import {ExpensesList} from "./components/expenses/expenses-list";
import {ExpensesCreate} from "./components/expenses/expenses-create";
import {ExpensesEdit} from "./components/expenses/expenses-edit";
import {OperationsList} from "./components/operations/operations-list";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsCreate} from "./components/operations/operations-create";
import {AuthUtils} from "./utils/auth-utils";
import {FileUtils} from "./utils/file-utils";
import {HttpUtils} from "./utils/http-utils";
import {ToastUtils} from "./utils/toast-utils";
import type {Route} from "./types/route.type";
import type {User} from "./types/auth.types";
import type {HttpResult} from "./types/http.types";
import type {BalanceResponse} from "./types/balance-response.type";
import {Modal} from "bootstrap";

export class Router {
    private readonly titlePageElement: HTMLElement | null = null;
    private readonly contentPageElement: HTMLElement | null = null;
    private profileNameElement: HTMLElement | null = null;
    private routes: Route[];

    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [
                    'chart.umd.min.js',
                    'flatpickr.min.js',
                    'ru.js'
                ],
                styles: [
                    'flatpickr.min.css',
                ]
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: (): void => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: (): void => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: (): void => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new IncomesList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new IncomesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new IncomesEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ExpensesList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/create',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations',
                title: 'Операции',
                filePathTemplate: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsList(this.openNewRoute.bind(this));
                },
                scripts: [
                    'flatpickr.min.js',
                    'ru.js'
                ],
                styles: [
                    'flatpickr.min.css',
                ]
            },
            {
                route: '/operations/create',
                title: 'Создание операции',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                },
                scripts: [
                    'flatpickr.min.js',
                    'ru.js'
                ],
                styles: [
                    'flatpickr.min.css',
                ]
            },
            {
                route: '/operations/edit',
                title: 'Редактирование операции',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: (): void => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                },
                scripts: [
                    'flatpickr.min.js',
                    'ru.js'
                ],
                styles: [
                    'flatpickr.min.css',
                ]
            }
        ];
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async clickHandler(e: MouseEvent): Promise<void> {
        let element: HTMLAnchorElement | null = null;
        const target = e.target as HTMLElement;

        if (target.nodeName === 'A') {
            element = target as HTMLAnchorElement;
        } else if (target.parentNode && (target.parentNode as HTMLElement).nodeName === 'A') {
            element = target.parentNode as HTMLAnchorElement;
        }

        if (element) {
            e.preventDefault();

            const currentRoute: string = window.location.pathname;
            const url: string = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async activateRoute(_e: Event | null = null, oldRoute: string | null = null): Promise<void> {
        if (oldRoute) {
            const currentRoute: Route | undefined = this.routes.find(item => item.route === oldRoute);
            if (currentRoute) {
                currentRoute.styles?.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`)?.remove();
                });
                currentRoute.scripts?.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`)?.remove();
                });
            }

            document.querySelectorAll('.flatpickr-calendar').forEach(calendar => calendar.remove());
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: Route | undefined = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles) {
                newRoute.styles.forEach(style => FileUtils.loadPageStyle('/css/' + style));
            }
            if (newRoute.scripts) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.useLayout) {
                const accessToken: string | null = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                if (!accessToken) {
                    history.pushState({}, '', '/login');
                    await this.activateRoute();
                    return;
                }
            }

            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate && this.contentPageElement) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('profile-name');

                    let rawUserInfo: string | null = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (rawUserInfo) {
                        const userInfo: User = JSON.parse(rawUserInfo) as User;
                        if (userInfo.name && userInfo.lastName && this.profileNameElement) {
                            this.profileNameElement.innerText = userInfo.name + ' ' + userInfo.lastName;
                        }
                    }

                    await this.initBalance();
                    this.activateMenuItem(newRoute);
                }

                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            history.pushState({}, '', '/');
            await this.activateRoute();
        }
    }

    private async initBalance(): Promise<void> {
        const balanceBlock: HTMLElement | null = document.getElementById('balance');
        const balanceAmount: HTMLElement | null = document.getElementById('balance-amount');

        if (!balanceBlock || !balanceAmount) return;

        try {
            const result: HttpResult<BalanceResponse> = await HttpUtils.request<BalanceResponse>('/balance');
            if (result.response && typeof result.response.balance !== 'undefined') {
                balanceAmount.innerText = result.response.balance.toLocaleString() + '$';
            }
        } catch (e) {
            console.error('Не удалось загрузить баланс');
        }

        if (!balanceBlock.dataset.listenerAdded) {
            balanceBlock.dataset.listenerAdded = "true";

            balanceBlock.addEventListener('click', (): void => {
                const modalElement: HTMLElement | null = document.getElementById('balance-modal');
                const inputElement = document.getElementById('balance-input') as HTMLInputElement | null;
                const saveBtn: HTMLElement | null = document.getElementById('save-balance-btn');

                if (!modalElement || !inputElement || !saveBtn) return;

                inputElement.classList.remove('is-invalid');

                const currentBalance: number = parseFloat(balanceAmount.innerText.replace(/[^0-9.-]+/g, ""));
                inputElement.value = String(isNaN(currentBalance) ? 0 : currentBalance);

                const modal: Modal = new Modal(modalElement);
                modal.show();

                saveBtn.onclick = async (): Promise<void> => {
                    const newBalance: number = Number(inputElement.value);
                    if (inputElement.value.trim() === '' || isNaN(newBalance)) {
                        inputElement.classList.add('is-invalid');
                        return;
                    } else {
                        inputElement.classList.remove('is-invalid');
                    }

                    const updateResult: HttpResult<BalanceResponse> = await HttpUtils.request<BalanceResponse>('/balance', 'PUT', true, {
                        newBalance: newBalance
                    });

                    if (updateResult.response && !updateResult.error) {
                        balanceAmount.innerText = updateResult.response.balance.toLocaleString() + '$';
                        modal.hide();
                    } else {
                        ToastUtils.show('Не удалось обновить баланс. Попробуйте позже.', 'danger');
                    }
                };
            });
        }
    }

    private activateMenuItem(route: Route): void {
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });

        const categoriesBtn: HTMLElement | null = document.getElementById('category');
        const categoriesCollapse: HTMLElement | null = document.getElementById('categories-collapse');

        if (categoriesBtn && !categoriesBtn.dataset.listenerAdded) {
            categoriesBtn.dataset.listenerAdded = 'true';

            categoriesBtn.addEventListener('click', () => {
                document.querySelectorAll('.nav-link').forEach(item => {
                    if (item.id !== 'category' && !item.closest('#categories-collapse')) {
                        item.classList.remove('active');
                    }
                });
                categoriesBtn.classList.add('active');
            });
        }

        if (route.route.includes('/incomes') || route.route.includes('/expenses')) {
            if (categoriesBtn && categoriesCollapse) {
                categoriesBtn.classList.add('active');
                categoriesCollapse.classList.add('show');
                categoriesBtn.setAttribute('aria-expanded', 'true');
            }

            document.querySelectorAll('.collapse .nav-link').forEach(item => {
                const href: string | null = item.getAttribute('href');

                if ((route.route.includes('/incomes') && href === '/incomes') ||
                    (route.route.includes('/expenses') && href === '/expenses')) {
                    item.classList.add('active');
                }
            });
        } else {
            if (categoriesBtn && categoriesCollapse) {
                categoriesBtn.classList.remove('active');
                categoriesCollapse.classList.remove('show');
                categoriesBtn.setAttribute('aria-expanded', 'false');
            }

            document.querySelectorAll('.nav-link').forEach(item => {
                const href: string | null = item.getAttribute('href');
                if (item.id === 'category') {
                    return;
                }
                if ((route.route === href) || (route.route === '/' && href === '/')) {
                    item.classList.add('active');
                }
            });
        }
    }
}