import { Component, EventEmitter, Input, Output } from '@angular/core';

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

    toggleSidebar() {
        this.sidebarExpanded = !this.sidebarExpanded;
        this.toggleCollapsed.emit(this.sidebarExpanded);
    }
}
