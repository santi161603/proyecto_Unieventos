export interface PagoObtenidoDTO{

    metodoPago:string,
    estadoPago:string,
    fechaPago:string,
    detalleEstadoPago:string,
    tipoPago:string,
    moneda:string,
    nuevaFechaPago?:Date | null
}
