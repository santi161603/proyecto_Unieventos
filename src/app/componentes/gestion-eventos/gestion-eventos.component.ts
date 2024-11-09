import { Component } from '@angular/core';
import { ClientService } from '../../servicios/auth.service';
import { RouterModule } from '@angular/router';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-eventos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './gestion-eventos.component.html',
  styleUrls: ['./gestion-eventos.component.css']
})
export class GestionEventosComponent {
  eventos: EventoObtenidoDTO[] = [];
  seleccionados: EventoObtenidoDTO[] = [];
  textoBtnEliminar: string = "";

  constructor(private clientSer: ClientService) {
    this.cargarEventos();
  }

  private cargarEventos(): void {
     this.clientSer.obtenerTodosLosEventos().subscribe({
       next: (response) => {
        this.eventos = response.respuesta.map((evento: EventoObtenidoDTO) => ({
          ...evento,
          mostrarDetalles: false // Inicializa `mostrarDetalles` en `false`
        })); // Asegúrate de que 'data' coincide con la estructura de tu DTO
        console.log(this.eventos); // Verifica los datos de subEvento aquí
         }, error: (err) => {
           console.error('Error al cargar eventos', err);
          } }); }

  public seleccionar(evento: EventoObtenidoDTO, estado: boolean) {
    if (estado) {
      this.seleccionados.push(evento);
    } else {
      const index = this.seleccionados.indexOf(evento);
      if (index !== -1) {
        this.seleccionados.splice(index, 1);
      }
    }
    this.actualizarMensaje();
  }

  private actualizarMensaje() {
    const tam = this.seleccionados.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} elemento${tam > 1 ? 's' : ''}` : "";
  }

  public confirmarEliminacion() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cambiará el estado de los eventos a Inactivos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEventos();
        Swal.fire("Eliminados!", "Los eventos seleccionados han sido eliminados.", "success");
      }
    });
  }

  public eliminarEventos() {
    this.seleccionados.forEach(evento => {
      // Descomenta la siguiente línea cuando tengas el servicio implementado
      // this.eventosService.eliminar(evento.nombre).subscribe(() => {
        this.eventos = this.eventos.filter(e => e !== evento);
      // });
    });
    this.seleccionados = [];
    this.actualizarMensaje();
  }

  public editarEvento(evento: EventoObtenidoDTO) {
    // Implementa la lógica de edición, como redirigir a un formulario de edición
    console.log("Editar evento:", evento);
  }

  public eliminarEvento(evento: EventoObtenidoDTO) {
    // Descomenta la siguiente línea cuando tengas el servicio implementado
    // this.eventosService.eliminar(evento.nombre).subscribe(() => {
      this.eventos = this.eventos.filter(e => e !== evento);
      this.actualizarMensaje();
    // });
  }

  public alternarDetalles(evento: EventoObtenidoDTO) {
    evento.mostrarDetalles = !evento.mostrarDetalles;
  }

  trackByIndex(index: number, item: EventoObtenidoDTO): number {
    return index;
  }
}

