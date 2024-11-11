import { SubEventosObtenidosDto } from "./subevento-dto";

export interface EventoActualizarDTO {
  nombre:string,
  descripcion:string,
  imagenPoster: string;
  tipoEvento:string,
  estadoEvento:string,
  subEvento: SubEventosObtenidosDto[],
}

