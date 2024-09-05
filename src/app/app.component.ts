import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLoaderComponent } from '@components/page-loader/page-loader.component';
import { ToastComponent } from '@components/toast/toast.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, PageLoaderComponent, ToastComponent],
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'PORTAL';
}
