import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CorreoDTO } from '../dto/correo-dto';
import { RestabecerContrasenaDTO } from '../dto/restablecer-contrasena-dto';
import { TipoEventoDTO } from '../dto/tipo-evento-dto';
import { EventoObtenidoDTO } from '../dto/evento-obtenido-dto';
import { LoginDTO } from '../dto/login-dto';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private authURL = "https://proyecto-final-avanzada-unieventos.onrender.com/servicios/cuenta-no-autenticada";

  public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
  }

  public activarCuenta(idUsuario: string, codigo: number): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/activar-cuenta/${idUsuario}`, {
      codigo: codigo
    });
  }

  public verificarCodigo(idUsuario: string, codigo: number): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/verificar-codigo/${idUsuario}`, {
      codigo: codigo
    });
  }

  public reenviarToken(idUsuario: string): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/reenviar-token/${idUsuario}`, {});
  }

  public restablecerContrasena(restablecer: RestabecerContrasenaDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/restablecer-contrasena`, restablecer);
  }

  public obtenerTodosLosEventos(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todos-eventos`)
  }

  public obtenereventosPorCategorias(tipoEvento: string): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/obtener-todos-los-eventos-por-categoria`, {
      tipoEvento: tipoEvento
    });
  }

  public obtenereventosPorCiudad(ciudad: string): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/obtener-todos-los-eventos-por-ciudad`, {
      ciudad: ciudad
    });
  }

  public obtenerTodasLasLocalidades(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todas-localidades`)
  }

  public enviarTokenRecuperacion(correo: CorreoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/enviar-token-recuperar`, correo)
  }

  public obtenerEventoPorId(idEvento: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-evento/${idEvento}`);
  }

  public obtenerLocalidadPorId(idLocalidad: string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-por-id-localidad/${idLocalidad}`);
  }

  public obtenerTodasLasLocalidadesNombreID(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todas-localidades-id-nombre`)
  }

  public suspenderCuenta(loginDTO:LoginDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/suspender-cuenta`, loginDTO)
  }

  public enviarTokenSuspendido(correo: CorreoDTO): Observable<MensajeDTO> {
    return this.http.put<MensajeDTO>(`${this.authURL}/enviar-token-suspe`, correo)
  }

  constructor(private http: HttpClient) { }
}
