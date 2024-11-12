import { ItemCarritoDTO } from "./item-carrito";

export interface CarritoObtenidoDTO {
  idCarritoCompras:string,
  usuarioId:string,
  items:ItemCarritoDTO[],
  totalPrecio: number;
}
