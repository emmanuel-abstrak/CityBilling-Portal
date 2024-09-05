import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
    selector: 'app-page-loader',
    standalone: true,
    imports: [],
    templateUrl: './page-loader.component.html',
    styleUrl: './page-loader.component.scss'
})
export class PageLoaderComponent implements OnInit {
    public loading: boolean = true;

    constructor(private router: Router) { }

    ngOnInit() {
        this.router.events
            .pipe(
                tap((event) => {
                    if (event instanceof RouteConfigLoadStart) {
                        this.loading = true;
                    } else if (event instanceof RouteConfigLoadEnd) {
                        this.loading = false;
                    }
                })
            )
            .subscribe();
    }
}
