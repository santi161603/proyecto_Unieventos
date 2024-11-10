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
  idEvento: string | null = null;
  evento: EventoObtenidoDTO | undefined;

  constructor(private route: ActivatedRoute, private clientService: ClientService) {

      this.idEvento = sessionStorage.getItem('idEvento');

      if (this.idEvento) {
        this.obtenerEvento(this.idEvento);
      } else {
        console.error("No se encontró el ID del evento en sessionStorage");
      }
  }

  public obtenerEvento(idEvento: string) {
    this.clientService.obtenerEventoPorId(idEvento).subscribe({
      next: (evento) => this.evento = evento,
      error: (err) => console.error("Error al obtener el evento:", err)
    });
  }
}
