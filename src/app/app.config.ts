import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from '@services/auth.service';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppHttpInterceptor } from './interceptors/http.interceptor';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
            withComponentInputBinding()
        ),
        provideHttpClient(withInterceptorsFromDi()),
        provideClientHydration(),
        importProvidersFrom(
            FormsModule,
            ReactiveFormsModule
        ),
    ],
};
