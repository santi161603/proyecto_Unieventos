import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaAutenticadaService {
  tokenUser: string | null;

  constructor(private http: HttpClient, private token: TokenService) {
    this.tokenUser = this.token.getToken();
   }

  private authURL = "http://localhost:8081/servicios/cuenta-autenticada";

  public obtenerTodosLosCupones(): Observable<MensajeDTO> {

    if(!this.tokenUser){
      throw new Error('No token de autenticación disponible')
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`  // 'Bearer' seguido del token
    });

    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todos-los-cupones`, {headers});
   }

}
