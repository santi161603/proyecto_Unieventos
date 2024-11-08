import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  private publicoURL = 'http://localhost:8081/servicios/obtener-enums';

  constructor(private http: HttpClient) { }

  // Método para obtener el enum de ciudades
  public listarCiudades(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-ciudades`);
  }

  public listarTipoEvento(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-tipo-evento`);
  }

  public listarEstadoCuenta(): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicoURL}/get-estado-cuenta`);
  }
}
