import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrearCuentaDTO } from '../dto/crear-cuenta-dto';
import { MensajeDTO } from '../dto/mensaje-dto';
import { LoginDTO } from '../dto/login-dto';


@Injectable({
 providedIn: 'root'
})
export class AuthService {


 private authURL = "http://localhost:8081/servicios/cuenta-no-autenticada";

 public crearCuenta(cuentaDTO: CrearCuentaDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.authURL}/crear-cuenta`, cuentaDTO);
 }
 
 
 public iniciarSesion(loginDTO: LoginDTO): Observable<MensajeDTO> {
  return this.http.post<MensajeDTO>(`${this.authURL}/iniciar-sesion`, loginDTO);
 }
 
 constructor(private http: HttpClient) { }
}
