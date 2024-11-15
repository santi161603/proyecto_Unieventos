import { PagoObtenidoDTO } from "./pago-obtenido-dto";
import { TransaccionDto } from "./transaccion-dto";

export interface OrdenInfoDTO{

  idOrden:string,
  transaccion:TransaccionDto,
  pago: PagoObtenidoDTO,
  montoTotal:number,
  montoTotalSinDescuento:number,

}
