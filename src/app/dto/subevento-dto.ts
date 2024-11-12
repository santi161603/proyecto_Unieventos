export interface SubEventosObtenidosDto{
  idSubEvento:number,
  fechaEvento: string, // LocalDateTime en formato ISO string
  localidad: string,  //Este es el id de la localidad
  horaEvento: string, // LocalTime en formato "HH:mm:ss"
  cantidadEntradas: number,
  precioEntrada: number,
  estadoSubEvento:string,
  localidadNombre?: string; // Nombre de la localidad que asignaremos después
}
