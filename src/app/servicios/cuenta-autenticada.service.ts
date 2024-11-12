import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { ItemCarritoDTO } from '../dto/item-carrito';

@Injectable({
  providedIn: 'root'
})
export class CuentaAutenticadaService {

  constructor(private http: HttpClient) { }

  private authURL = "http://localhost:8081/servicios/cuenta-autenticada";

  public obtenerTodosLosCupones(): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-todos-los-cupones`);
   }

   public obtenerCuponPorID(idCupon: string): Observable<MensajeDTO> {

    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-cupon-id/${idCupon}`);
   }

   public anadirItemsAlCarritro(itemCarritoDTO: ItemCarritoDTO, usuarioId:string): Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/anadir-item/${usuarioId}`,itemCarritoDTO);
   }

   public eliminarItemsAlCarritro(itemCarritoDTO: ItemCarritoDTO, usuarioId:string): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/eliminar-item/${usuarioId}`,itemCarritoDTO);
   }

   public obtenerelCarritoUsuario(usuarioId:string): Observable<MensajeDTO> {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-carrito/${usuarioId}`);
   }

   public aumentarCanridad(usuarioId:string, itemCarritoDTO: ItemCarritoDTO): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/aumentar-cantidad-item/${usuarioId}`,itemCarritoDTO);
   }

   public reducirCantidad(usuarioId:string, itemCarritoDTO: ItemCarritoDTO): Observable<MensajeDTO> {

    return this.http.put<MensajeDTO>(`${this.authURL}/reducir-cantidad-item/${usuarioId}`,itemCarritoDTO);
   }


}
