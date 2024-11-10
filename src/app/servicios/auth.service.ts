import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { CorreoDTO } from '../dto/correo-dto';
import { RestabecerContrasenaDTO } from '../dto/restablecer-contrasena-dto';
import { TipoEventoDTO } from '../dto/tipo-evento-dto';


@Injectable({
 providedIn: 'root'
})
export class ClientService {

 private authURL = "http://localhost:8081/servicios/cuenta-no-autenticada";

 public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
 }

 public activarCuenta(idUsuario: string, codigo: number): Observable<MensajeDTO> {
  return this.http.put<MensajeDTO>(`${this.authURL}/activar-cuenta/${idUsuario}`, {
    codigo:codigo
  });
}

public verificarCodigo(idUsuario: string, codigo: number): Observable<MensajeDTO> {
  return this.http.put<MensajeDTO>(`${this.authURL}/verificar-codigo/${idUsuario}`, {
    codigo:codigo
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

public obtenereventosPorCategorias(tipoEvento: string): Observable<MensajeDTO>{
  return this.http.put<MensajeDTO>(`${this.authURL}/obtener-todos-los-eventos-por-categoria`, {
    tipoEvento : tipoEvento
  });
}

public obtenerTodasLasLocalidades(): Observable<MensajeDTO> {
  return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todas-localidad`)
}

public enviarTokenRecuperacion(correo: CorreoDTO): Observable<MensajeDTO> {

  return this.http.put<MensajeDTO>(`${this.authURL}/enviar-token-recuperar`, correo)
}

 constructor(private http: HttpClient) { }
}
