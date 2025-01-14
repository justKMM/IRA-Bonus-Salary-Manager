import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('API Request to Backend found');
        // Only add auth header for API requests to backend
        if (request.url.startsWith(environment.apiEndpoint) && !request.url.includes('login')) {
            console.log('API Request to Backend found, Interceptor working');
            const authHeader = localStorage.getItem('authHeader');
            if (authHeader) {
                request = request.clone({
                    setHeaders: {
                        Authorization: authHeader,
                    }
                });
            }
        }

        console.log(request.headers);

        return next.handle(request);
    }
}
