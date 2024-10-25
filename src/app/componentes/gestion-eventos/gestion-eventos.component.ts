import { Component } from '@angular/core';
import { EventosService } from '../../servicios/eventos.service';
import { RouterModule } from '@angular/router';
import { EventoDTO } from '../../dto/evento-dto';


@Component({
  selector: 'app-gestion-eventos',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './gestion-eventos.component.html',
  styleUrl: './gestion-eventos.component.css'
})
export class GestionEventosComponent {
  eventos: EventoDTO[];


  constructor(public eventosService:EventosService) {
    this.eventos = eventosService.listar();
  }
 
}
