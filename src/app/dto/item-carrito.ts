export interface ItemCarritoDTO {
  eventoId:string,
  idSubevento:number,
  cantidadEntradas:number,
  cupon?:string,
  cuponRedimido?:boolean,
  textIngresado?:string;
}
