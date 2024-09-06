import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { AuthState } from '@states/auth.state';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    @Output() toggleCollapsed = new EventEmitter<boolean>();
    public sidebarExpanded: boolean = true;

    constructor(private authService: AuthService) { }

    toggleSidebar() {
        this.sidebarExpanded = !this.sidebarExpanded;
        this.toggleCollapsed.emit(this.sidebarExpanded);
    }

    logout() {
        this.authService.Logout(true);
    }
}
