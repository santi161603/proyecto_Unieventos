import { SubEventosDto } from "./subevento-dto";

export interface EventoDTO {
   nombre:string,
   descripcion:string,
   TipoEvento:string,
   estadoEvento:string,
   subEvento: SubEventosDto[];
}

