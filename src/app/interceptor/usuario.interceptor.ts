import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TokenService } from '../servicios/token.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../servicios/auntentication.service';

export const usuarioInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const authService = inject(AuthService)
  const isApiAuth = req.url.includes("/servicios/autenticacion");
  const isAPiPublico = req.url.includes("/servicios/cuenta-no-autenticada");
  const isEnumsServie = req.url.includes("/servicios/obtener-enums");

  if (!tokenService.isLogged() || isApiAuth || isAPiPublico || isEnumsServie) {
    return next(req);
  }

  const token = tokenService.getToken();

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !authService.refreshTokenInProgress) {
        authService.refreshTokenInProgress = true;
        return authService.refresh().pipe(
          switchMap((newToken: string) => {
            if (newToken) {
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            } else {
              return throwError(error); // Si no se obtiene un nuevo token, lanzamos el error
            }
          }),
          catchError(refreshError => {
            authService.refreshTokenInProgress = false;
            return throwError(refreshError); // Reseteamos el estado y lanzamos el error
          })
        );
      }
      return throwError(error); // Si el error no es 401, lo lanzamos tal cual
    })
  );
};
