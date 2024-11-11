import { SubEventosDto } from "./subevento-dto";

export interface EventoDTO {
   nombre:string,
   descripcion:string,
   tipoEvento:string,
   estadoEvento:string,
   subEvento: SubEventosDto[],
   imageEvento: string;
}

