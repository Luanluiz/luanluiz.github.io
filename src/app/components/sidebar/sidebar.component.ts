import {Component, OnInit} from '@angular/core';

declare const $: any;

declare interface RouteInfo {
    path?: string;
    title: string;
    icon: string;
    class?: string;
    subMenu: Array<SubMenu>;
}

declare interface SubMenu {
    path: string;
    title: string;
    icon: string;
}

export const ROUTES: RouteInfo[] = [
    {path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '', subMenu: null},
    {
        title: 'Cadastros', icon: 'groups', subMenu:
            [
                {path: 'cadastros/clientes', title: 'Clientes', icon: 'group_add'},
                {path: 'cadastros/fornecedor', title: 'Fornecedores', icon: 'local_shipping'},
                {path: 'cadastros/usuario', title: 'Usuários', icon: 'person'},
                {path: 'cadastros/contratos', title: 'Contratos', icon: 'gavel'},
            ]
    },
    {
        title: 'Financeiro', icon: 'attach_money', subMenu:
            [
                {path: 'cadastros/contas-receber', title: 'Contas a receber', icon: 'price_check'},
                {path: 'cadastros/contas-pagar', title: 'Contas a pagar', icon: 'money_off'},
                {path: 'cadastros/caixa', title: 'Caixa', icon: 'point_of_sale'},
            ]
    }

    // { path: '/user-profile', title: 'User Profile teste',  icon:'person', class: '' },
    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    menuItems: any[];

    constructor() {
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
}
