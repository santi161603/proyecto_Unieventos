import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TokenService } from './token.service';
import { MensajeDTO } from '../dto/mensaje-dto';
import { Observable } from 'rxjs';
import { ItemCarritoDTO } from '../dto/item-carrito';
import { CuentaActualizarDto } from '../dto/cuenta-actualizar-dto';
import { DTOCrearOrden } from '../dto/dto-crear-orden';

@Injectable({
  providedIn: 'root'
})
export class CuentaAutenticadaService {


  constructor(private http: HttpClient) { }

  private authURL = "https://proyecto-final-avanzada-unieventos.onrender.com/servicios/cuenta-autenticada";

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

   public obtenerUsuarioPorID(usuarioId:string): Observable<MensajeDTO> {

    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-cuentaid/${usuarioId}`);
   }

   public actualizarImagenPerfil(usuarioId:string, imagenPerfil:File): Observable<MensajeDTO> {

    const formData = new FormData();
    formData.append('imageProfile', imagenPerfil, imagenPerfil.name);

    return this.http.post<MensajeDTO>(`${this.authURL}/actualizar-imagen-perfil/${usuarioId}`, formData);
   }

  public actualizarUsuario(updatedData: CuentaActualizarDto): Observable<MensajeDTO>  {
  return this.http.put<MensajeDTO>(`${this.authURL}/actualizar-cuenta`, updatedData);
  }

  public crearOrden(orden: DTOCrearOrden) : Observable<MensajeDTO> {
    return this.http.post<MensajeDTO>(`${this.authURL}/crear-orden`, orden);
  }

  public realizarPago(idOrden: string): Observable<MensajeDTO>  {
    return this.http.get<MensajeDTO>(`${this.authURL}/realizar-pago/${idOrden}`);
  }

  public getOrdenesByCliente(idCliente: string): Observable<MensajeDTO>  {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-ordenes-cliente/${idCliente}`)
  }

  actualizarItemCarrito(item: ItemCarritoDTO, usuarioId:string): Observable<MensajeDTO>  {
    return this.http.put<MensajeDTO>(`${this.authURL}/actualizar-item-carrito/${usuarioId}`, item)
  }

  ordenDesdeCarrito(usuarioId:string): Observable<MensajeDTO>  {
    return this.http.get<MensajeDTO>(`${this.authURL}/crear-orden-desde-carrito/${usuarioId}`)
  }
  vaciarCarrito(usuarioId:string): Observable<MensajeDTO>  {
    return this.http.delete<MensajeDTO>(`${this.authURL}/limpiar-carrito/${usuarioId}`)
  }
  obtenerOrdenPorId(ordenId:string): Observable<MensajeDTO>  {
    return this.http.get<MensajeDTO>(`${this.authURL}/obtener-orden-por-id/${ordenId}`)
  }
}
