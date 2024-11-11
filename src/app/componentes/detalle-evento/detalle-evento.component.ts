import { Component } from '@angular/core';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';

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
  localidades: LocalidadNombreIdDTO[] = [];

  constructor(private route: ActivatedRoute, private clientService: ClientService) {

      this.idEvento = sessionStorage.getItem('idEvento');

      if (this.idEvento) {
        this.obtenerEvento(this.idEvento);
      } else {
        console.error("No se encontró el ID del evento en sessionStorage");
      }
  }
  public obtenerLocalidades() {
    this.clientService.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (data) => {
        this.localidades = data.respuesta;
      },
      error: (err) => console.error("Error al obtener las localidades:", err)
    });
  }

  public obtenerEvento(idEvento: string) {
    this.clientService.obtenerEventoPorId(idEvento).subscribe({
      next: (data) => {
        this.evento = data.respuesta;
        this.asignarNombresLocalidades();
      },
      error: (err) => console.error("Error al obtener el evento:", err)
    });
  }

   private asignarNombresLocalidades() {
    if (this.evento && this.localidades.length) {
      this.evento.subEventos.forEach(subevento => {
        const localidad = this.localidades.find(loc => loc.IdLocalidad === subevento.localidad);
        if (localidad) {
          subevento.localidadNombre = localidad.nombreLocalidad;
        }
      });
    }
  }
}
