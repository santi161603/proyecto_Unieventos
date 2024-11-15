import { PagoDTO } from "./pago-dto-pago";
import { TransaccionDto } from "./transaccion-dto";


export interface DTOCrearOrden{
  transaccion:TransaccionDto,
  pago:PagoDTO
}
