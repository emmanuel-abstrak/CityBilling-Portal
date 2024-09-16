import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from '@models/user.model';
import { AuthService } from '@services/api/auth.service';
import { AuthState } from '@states/auth.state';
import { filter, map, mergeMap, Observable } from 'rxjs';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [NgIf, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    @Output() toggleCollapsed = new EventEmitter<boolean>();
    public sidebarExpanded: boolean = true;
    public currentUser: any;
    public title: string;

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private titleService: Title,
        private authState: AuthState
    ) {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(map(() => this.activatedRoute))
            .pipe(
                map((route) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                })
            )
            .pipe(filter((route) => route.outlet === 'primary'))
            .pipe(mergeMap((route) => route.data))
            .subscribe((event) => {
                this.titleService.setTitle('CityBilling - ' + event['title']);
                this.title = event['title'];
            });
    }

    ngOnInit() {
        this.currentUser = this.authState.GetUser();
    }

    toggleSidebar() {
        this.sidebarExpanded = !this.sidebarExpanded;
        this.toggleCollapsed.emit(this.sidebarExpanded);
    }

    logout() {
        this.authService.Logout(true);
    }
}
