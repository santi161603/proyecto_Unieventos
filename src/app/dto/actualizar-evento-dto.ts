import { SubEventosDto } from "./subevento-dto";

export interface EventoActualizarDTO {
  nombre:string,
  descripcion:string,
  imagenPoster: string;
  tipoEvento:string,
  estadoEvento:string,
  subEvento: SubEventosDto[],
}

