import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/clients', title: 'Clients',  icon:'pe-7s-user', class: '' },
    { path: '/questions', title: 'Questions',  icon:'pe-7s-news-paper', class: '' },
    // { path: '/user', title: 'Replies',  icon:'pe-7s-user', class: '' },
    { path: '/login', title: 'Sign In',  icon: 'pe-7s-graph', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'pe-7s-bell', class: '' },
    { path: '/logout', title: 'Sign Out',  icon:'pe-7s-rocket', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
  toggled = false;

onToggle(){
  this.toggled = !this.toggled;
}
  
  HideItem(url) 
  {
    if (url === '/login') {
      if (sessionStorage.getItem('AgentToken') && sessionStorage.getItem('isValid') === '1')
        return true;
    }
    else if (url === '/logout')
    {
      if (!sessionStorage.getItem('AgentToken') || sessionStorage.getItem('isValid') === '0')      
        return true;
      
    }
    return false;
  }

}
