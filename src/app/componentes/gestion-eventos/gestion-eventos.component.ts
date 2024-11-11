import { Component } from '@angular/core';
import { ClientService } from '../../servicios/auth.service';
import { Router, RouterModule } from '@angular/router';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { AdministradorService } from '../../servicios/administrador.service';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';

@Component({
  selector: 'app-gestion-eventos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.css']
})
export class GestionEventosComponent {
  eventos: EventoObtenidoDTO[] = [];
  localidades: LocalidadNombreIdDTO[] = [];
  seleccionados: EventoObtenidoDTO[] = [];
  textoBtnEliminar: string = "";

  constructor(private clientServicio: ClientService, private adminService: AdministradorService, private router: Router) {
    this.cargarLocalidades();
    this.cargarEventos();
  }

  public navegarEditar() {
    if (this.seleccionados.length === 1) {
      const eventoId = this.seleccionados[0].idEvento;
      sessionStorage.removeItem("idEventoActualizar")
      sessionStorage.setItem("idEventoActualizar", eventoId.toString()); // Guarda el ID en el sessionStorage
      this.router.navigate(['/actualizar-evento']); // Redirige a la página de edición
    }
  }

  private cargarLocalidades(): void {
    this.clientServicio.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (response) => {
        this.localidades = response.respuesta;  // Almacena todas las localidades
      },
      error: (err) => {
        console.error('Error al cargar localidades', err);
      }
    });
  }

  private obtenerNombreLocalidad(localidadId: string): string {
    const localidad = this.localidades.find(l => l.IdLocalidad === localidadId); // Busca la localidad por IdLocalidad
    return localidad ? localidad.nombreLocalidad : 'Desconocido'; // Retorna el nombre o 'Desconocido' si no se encuentra
  }

  private cargarEventos(): void {
    this.clientServicio.obtenerTodosLosEventos().subscribe({
      next: (response) => {
        this.eventos = response.respuesta.map((evento: EventoObtenidoDTO) => ({
          ...evento,
          mostrarDetalles: false,
          subEventos: evento.subEventos.map((subEvento: SubEventosObtenidosDto) => {
            return {
              ...subEvento,
              localidadNombre: this.obtenerNombreLocalidad(subEvento.localidad)
            };
          })
        }));
      },
      error: (err) => {
        console.error('Error al cargar eventos', err);
      }
    });
  }

  public seleccionar(evento: EventoObtenidoDTO) {
    // Si el evento ya está seleccionado, desmarcarlo
    if (this.seleccionados.includes(evento)) {
      this.seleccionados = []; // Se desmarcan todos
    } else {
      // Si no está seleccionado, seleccionarlo
      this.seleccionados = [evento]; // Solo se puede seleccionar un evento a la vez
    }
    this.actualizarMensaje(); // Actualiza el mensaje para mostrar la cantidad de elementos seleccionados
  }



  private actualizarMensaje() {
    const tam = this.seleccionados.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} elemento${tam > 1 ? 's' : ''}` : "";
  }

  public confirmarEliminacion() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cambiará el estado del evento a Eliminado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEventos();
      }
    });
  }

  public eliminarEventos() {
    if (this.seleccionados.length === 1) {
      // Redirigir o mostrar una vista para actualizar la localidad
      const idEvento = this.seleccionados[0].idEvento;

      this.adminService.eliminarEvento(idEvento).subscribe({
        next:(value) => {
          Swal.fire({
            title: "Eliminado con exito",
            text: "Se a eliminado exitosamente la localidad",
            icon: "info",
          })
        },
        error:(err) => {
          Swal.fire({
            title: "no se a podido eliminar",
            text: "A surgido un error al intentar eliminar la localidad"+ err,
            icon: "error",
          })
        }
      })

     }
  }

  public alternarDetalles(evento: EventoObtenidoDTO) {
    evento.mostrarDetalles = !evento.mostrarDetalles;
  }

  trackByIndex(index: number, item: EventoObtenidoDTO): number {
    return index;
  }
}

