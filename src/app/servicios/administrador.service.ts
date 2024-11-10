import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';
import { EventoDTO } from '../dto/evento-dto';
import { TokenService } from './token.service';
import { LocalidadDTO } from '../dto/localidad-dto';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { CrearCuponDTO } from '../dto/crear-cupon-dto';

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

   public subirImagen(imagenSeleccionada: File): Observable<MensajeDTO> {
    if (!this.tokenUser) {
      throw new Error('No token de autenticación disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`
    });

    // Crear FormData y agregar la imagen
    const formData = new FormData();
    formData.append('imagen', imagenSeleccionada);

    return this.http.post<MensajeDTO>(`${this.authURL}/subir-imagen`, formData, { headers });
  }

  public obtenerTodasLasLocalidadesNombreID(): Observable<MensajeDTO> {

    if (!this.tokenUser) {
      throw new Error('No token de autenticación disponible');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`
    });

    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todas-localidades-id-nombre`, {headers})
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

   public crearCupon(cuponDTO: CrearCuponDTO): Observable<MensajeDTO> {

    if(!this.tokenUser){
      throw new Error('No token de autenticación disponible')
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.tokenUser}`  // 'Bearer' seguido del token
    });

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cupon`, cuponDTO, {headers});
   }




}
