import { of, Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { TokenDTO } from '../dto/token-dto';
import { LoginDTO } from '../dto/login-dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MensajeDTO } from '../dto/mensaje-dto';
import { TokenService } from './token.service';

@Injectable({
 providedIn: 'root'
})
export class AuthService {
  refreshTokenInProgress = false;

  private authURL = "http://localhost:8081/servicios/autenticacion";

  constructor(private http: HttpClient, private router: Router, private tokenservice: TokenService) { }

  public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
  }

  public refresh(): Observable<any> {
    const token = this.tokenservice.getToken();
    if (!token) {
      this.tokenservice.logout();
      return of(null); // Devuelve un Observable nulo si no hay token
    }

    this.refreshTokenInProgress = true;

    return this.http.post<TokenDTO>(`${this.authURL}/refresh`, { token }).pipe(
      switchMap((response) => {
        this.tokenservice.setToken(response.token);
        this.refreshTokenInProgress = false;
        return of(response.token);
      }),
      catchError((error) => {
        this.refreshTokenInProgress = false;
        this.tokenservice.logout(); // Si falla el refresh, hacer logout
        return throwError(error);
      })
    );
  }
}
