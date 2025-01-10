import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../services/auth.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only add auth header for API requests to backend
        if (request.url.startsWith(environment.apiEndpoint)) {
            console.log('API Request to Backend found, Interceptor working');
            const authHeader = this.authService.getAuthHeader();
            if (authHeader) {
                request = request.clone({
                    setHeaders: {
                        Authorization: authHeader
                    }
                });
            }
        }

        console.log(request.headers);

        return next.handle(request);
    }
}
