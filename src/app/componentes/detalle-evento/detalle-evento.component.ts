import { Component } from '@angular/core';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent {
  idEvento: string = '';
  evento: EventoObtenidoDTO | undefined;

  constructor(private route: ActivatedRoute, private clientService: ClientService) {
    this.route.params.subscribe((params) => {
      this.idEvento = params['id'];
      this.obtenerEvento();
    });
  }

  public obtenerEvento() {
    this.clientService.obtenerEventoPorId(this.idEvento).subscribe({
      next: (evento) => this.evento = evento,
      error: (err) => console.error("Error al obtener el evento:", err)
    });
  }
}
