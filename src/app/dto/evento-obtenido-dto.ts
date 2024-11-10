import { SubEventosDto } from "./subevento-dto";

export interface EventoObtenidoDTO {
   idEvento: string;
   nombre:string,
   descripcion:string,
   estadoEvento:string,
   TipoEvento:string,
   subEventos: SubEventosDto[],
   imagenPoster: string;
   mostrarDetalles?: boolean;
}

