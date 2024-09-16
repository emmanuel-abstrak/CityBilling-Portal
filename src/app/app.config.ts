import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from '@services/api/auth.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppHttpInterceptor } from './interceptors/http.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => { },
            multi: true,
            deps: [AuthService],
        },
        {
            provide: HTTP_INTERCEPTORS,
            multi: true,
            useClass: AppHttpInterceptor,
        },
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
            withComponentInputBinding(),
            withPreloading(PreloadAllModules)
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideClientHydration(),
        importProvidersFrom(
            FormsModule,
            ReactiveFormsModule,
            CommonModule,
        ),
        provideAnimations(),
        provideToastr(),
    ],
};
