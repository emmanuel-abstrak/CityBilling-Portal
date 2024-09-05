import { Component, Inject, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DOCUMENT, NgClass } from '@angular/common';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [RouterModule, HeaderComponent, SidebarComponent, NgClass],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
})
export class MainComponent {
    public sidebarExpanded: boolean = true;

    constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) { }

    toggleSidebar(v: boolean) {
        this.sidebarExpanded = v;
        this.renderer.removeAttribute(this.document.body, 'data-sidebartype');
        if (this.sidebarExpanded) {
            this.renderer.setAttribute(this.document.body, 'data-sidebartype', 'full');
        } else {
            this.renderer.setAttribute(this.document.body, 'data-sidebartype', 'mini-sidebar');
        }
    }
}
