import { ItemCarritoDTO } from "./item-carrito";


export interface TransaccionDto{
  productos: ItemCarritoDTO[],
  idCliente: string;
}
