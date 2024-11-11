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
        this.obtenerLocalidades();
        this.obtenerEvento(this.idEvento);
      } else {
        console.error("No se encontró el ID del evento en sessionStorage");
      }
  }
  private obtenerLocalidades() {
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
    console.log("estoy dentro de asignar nombres")
    if (this.evento && this.localidades.length) {
      // Imprimir las localidades y los subeventos para depuración
      console.log('Localidades:', this.localidades);
      console.log('Subeventos:', this.evento.subEventos);

      this.evento.subEventos.forEach(subevento => {
        // Asegurarse de que los tipos sean iguales para evitar problemas de comparación
        const localidad = this.localidades.find(loc => loc.IdLocalidad === String(subevento.localidad));

        // Verificar si la localidad fue encontrada y asignarla
        if (localidad) {
          subevento.localidadNombre = localidad.nombreLocalidad;
        } else {
          console.warn('No se encontró la localidad para el subevento:', subevento);
        }
      });
    }
    else{
      console.log("error")
      console.log(this.evento)
      console.log(this.localidades.length)
    }
  }
}
