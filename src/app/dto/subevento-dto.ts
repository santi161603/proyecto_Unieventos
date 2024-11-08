export interface SubEventosDto{
  fechaEvento: string; // LocalDateTime en formato ISO string
  localidad: string;
  horaEvento: string; // LocalTime en formato "HH:mm:ss"
  cantidadEntradas: number;
  precioEntrada: number;
}
