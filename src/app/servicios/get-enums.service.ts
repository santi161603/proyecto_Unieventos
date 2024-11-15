import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  private publicoURL = 'https://proyecto-final-avanzada-unieventos.onrender.com:8080/servicios/obtener-enums';

  constructor(private http: HttpClient) { }

  // Método para obtener el enum de ciudades
  public listarCiudades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-ciudades`);
  }
  public listarTipoLocalidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-tipo-localidad`);
  }
  public listarEstadoLocalidades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-estado-localidad`);
  }

  public listarTipoEvento(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-tipo-evento`);
  }

  public listarEstadoCuenta(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-estado-cuenta`);
  }
  public listarEstadoCupones(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-estado-cupones`);
  }
}
