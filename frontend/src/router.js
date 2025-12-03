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

export class Router {
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
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [
                    'chart.umd.min.js',
                    'chart.js',
                ]
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/incomes/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes/create',
                title: 'Создание дохода',
                filePathTemplate: '/templates/pages/incomes/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/incomes/edit',
                title: 'Редактирование дохода',
                filePathTemplate: '/templates/pages/incomes/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomesEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/expenses/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/create',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/expenses/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expenses/edit',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/expenses/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/create',
                title: 'Создание расхода',
                filePathTemplate: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Редактирование расхода',
                filePathTemplate: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            // проверить изменилось ли это
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            // if (currentRoute.scripts && currentRoute.scripts.length > 0) {
            //     currentRoute.scripts.forEach(script => {
            //         document.querySelector(`script[src='/js/${script}']`).remove();
            //     });
            // }
            //
            // if (currentRoute.unload && typeof currentRoute.unload === 'function') {
            //     currentRoute.unload();
            // }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            // if (newRoute.scripts && newRoute.scripts.length > 0) {
            //     for (const script of newRoute.scripts) {
            //         await FileUtils.loadPageScript('/js/' + script);
            //     }
            // }

            if (newRoute.useLayout) {
                const accessToken = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);

                if (!accessToken) {
                    history.pushState({}, '', '/login');
                    await this.activateRoute();
                    return;
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');

                    this.profileNameElement = document.getElementById('profile-name');

                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                            if (userInfo.name && userInfo.lastName) {
                                this.userName = userInfo.name + ' ' + userInfo.lastName;
                            }
                        }
                    }
                    this.profileNameElement.innerText = this.userName;

                    this.activateMenuItem(newRoute);
                }

                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/');
            await this.activateRoute();
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.nav-link').forEach(item => {
            item.classList.remove('active');
        });

        const categoriesBtn = document.getElementById('category');
        const categoriesCollapse = document.getElementById('categories-collapse');

        if (categoriesBtn) {
            categoriesBtn.addEventListener('click', () => {
                document.querySelectorAll('.nav-link').forEach(item => {
                    if (item.id !== 'category') {
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
                const href = item.getAttribute('href');

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
                const href = item.getAttribute('href');

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