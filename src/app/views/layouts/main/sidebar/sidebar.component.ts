import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem, sidebarItems } from '@constants/sidebar.items';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    public navItems: NavItem[] = sidebarItems;

    constructor(private location: Location, private router: Router) { }

    getActiveClass(item: NavItem): string {
        const [current, _] = this.location.path().split('?');;
        if (current == item.link || (item.children && item.children.includes(current))) {
            return 'active';
        }
        return '';
    }

    goTo = (link: string) => {
        // if (!link) {
        //     return;
        // }

        this.router.navigate([link]);
    }
}
