import { SubEventosDto } from "./subevento-dto";

export interface EventoObtenidoDTO {
   idEvento: string;
   nombre:string,
   descripcion:string,
   estadoEvento:string,
   tipoEvento:string,
   subEventos: SubEventosDto[],
   imagenPoster: string;
   mostrarDetalles?: boolean;
}

