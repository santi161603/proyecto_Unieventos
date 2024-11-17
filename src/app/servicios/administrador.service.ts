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
import { DTOActualizarLocalidad } from '../dto/actualizar-localidad-dto';
import { EventoActualizarDTO } from '../dto/actualizar-evento-dto';
import { CuponActualizadoDTO } from '../dto/actualizar-cupon-dto';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {


  constructor(private http: HttpClient) {}

  private authURL = "http://localhost:8081/servicios/cuenta-administrador";

  public crearEvento(eventoDTO: EventoDTO): Observable<MensajeDTO> {

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-evento`, eventoDTO);
   }

   public subirImagen(imagenSeleccionada: File): Observable<MensajeDTO> {
    // Crear FormData y agregar la imagen
    const formData = new FormData();
    formData.append('imagen', imagenSeleccionada);

    return this.http.post<MensajeDTO>(`${this.authURL}/subir-imagen`, formData);
  }


   public crearLocalidad(LocalidadDTO: LocalidadDTO): Observable<MensajeDTO> {

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-localidad`, LocalidadDTO);
   }

   public crearCupon(cuponDTO: CrearCuponDTO): Observable<MensajeDTO> {

    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cupon`, cuponDTO);
   }

   public actualizarLocalidad(idLocalidad:string, DTOActualizarLocalidad: DTOActualizarLocalidad): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/actualizar-localidad/${idLocalidad}`, DTOActualizarLocalidad);
   }

   public actualizarEvento(idEvento:string,DTOActualizarEvento: EventoActualizarDTO): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/actualizar-evento/${idEvento}`, DTOActualizarEvento);
   }
   public actualizarCupon(idCupon:string,DTOActualizarCupon: CuponActualizadoDTO): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/actualizar-cupon/${idCupon}`, DTOActualizarCupon);
   }

   public eliminarLocalidad(idLocalidad: string): Observable<MensajeDTO> {

    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-localidad/${idLocalidad}`);
   }

   public eliminarCupon(idCupon: string): Observable<MensajeDTO> {

    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-cupon/${idCupon}`);
  }

  public obtenerTodasLasOrdenes(): Observable<MensajeDTO> {

    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todas-las-ordenes`);
  }

   public eliminarEvento(idEvento: string): Observable<MensajeDTO> {
    return this.http.delete<MensajeDTO>(`${this.authURL}/eliminar-evento/${idEvento}`);
   }

}
