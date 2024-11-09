import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';
import { EventoDTO } from '../dto/evento-dto';
import { TokenService } from './token.service';
import { LocalidadDTO } from '../dto/localidad-dto';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  tokenUser: string | null;

  constructor(private http: HttpClient, private token: TokenService) {
    this.tokenUser = this.token.getToken();
   }

  private authURL = "http://localhost:8081/servicios/cuenta-administrador";

  public crearEvento(eventoDTO: EventoDTO): Observable<MensajeDTO> {

    if(!this.tokenUser){
      throw new Error('No token de autenticación disponible')
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`  // 'Bearer' seguido del token
    });

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-evento`, eventoDTO, {headers});
   }

   public crearLocalidad(LocalidadDTO: LocalidadDTO): Observable<MensajeDTO> {

    if(!this.tokenUser){
      throw new Error('No token de autenticación disponible')
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`  // 'Bearer' seguido del token
    });

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-localidad`, LocalidadDTO, {headers});
   }




}
