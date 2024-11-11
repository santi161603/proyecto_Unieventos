import { SubEventosCreadosDto } from "./subevento-crear-dto";

export interface EventoDTO {
   nombre:string,
   descripcion:string,
   tipoEvento:string,
   estadoEvento:string,
   subEvento: SubEventosCreadosDto[],
   imageEvento: string;
}

