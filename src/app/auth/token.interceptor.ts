import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // if (this.authService.getJwtToken()) {
    //   request = this.addToken(request, this.authService.getJwtToken());
    // }

    // return next.handle(request).pipe(catchError(error => {
    //   if (error instanceof HttpErrorResponse && error.status === 401) {
    //     return this.handle401Error(request, next);
    //   } else {
    //     return throwError(error);
    //   }
    // }));

    const authToken = this.authService.getJwtToken();
    let authRequest = request;
    if (!!authToken) {
      authRequest = this.addToken(request, authToken);
    }

    return next.handle(authRequest);

  }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
    }

    // private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    //     if (!this.isRefreshing) {
    //       this.isRefreshing = true;
    //       this.refreshTokenSubject.next(null);

    //       return this.authService.refreshToken().pipe(
    //         switchMap((token: any) => {
    //           this.isRefreshing = false;
    //           this.refreshTokenSubject.next(token.jwt);
    //           return next.handle(this.addToken(request, token.jwt));
    //         }));

    //     } else {
    //       return this.refreshTokenSubject.pipe(
    //         filter(token => token != null),
    //         take(1),
    //         switchMap(jwt => {
    //           return next.handle(this.addToken(request, jwt));
    //         }));
    //     }
    //   }
}
