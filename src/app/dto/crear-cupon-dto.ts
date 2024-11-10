export interface CrearCuponDTO {
    nombreCupon: string,
    descripcionCupon: string,
    porcentajeDescuento: number,
    userCupon: string,
    fechaVencimiento: Date,
    cantidad: number;
}
