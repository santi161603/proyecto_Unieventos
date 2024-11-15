export interface CrearCuponDTO {
    nombreCupon: string,
    descripcionCupon: string,
    porcentajeDescuento: number,
    userCupon?: string,
    ciudad?:string,
    tipoEvento?:string,
    fechaVencimiento: Date,
    cantidad: number;
}
