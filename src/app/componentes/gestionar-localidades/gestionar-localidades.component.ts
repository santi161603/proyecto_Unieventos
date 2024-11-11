import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { ClientService } from '../../servicios/auth.service';
import { LocalidadObtenidaDTO } from '../../dto/localidad-obtenida-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-localidades',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './gestionar-localidades.component.html',
  styleUrls: ['./gestionar-localidades.component.css']
})
export class GestionLocalidadesComponent {
  localidades: LocalidadObtenidaDTO[] = [];
  seleccionadas: LocalidadObtenidaDTO[] = [];
  textoBtnEliminar: string = "";

  constructor(public localidadesService: ClientService, private router: Router) {
    this.obtenerLocalidades();
  }

  public seleccionar(localidad: LocalidadObtenidaDTO) {
    // Si ya está seleccionada, la deseleccionamos
    if (this.seleccionadas.includes(localidad)) {
      this.seleccionadas = [];
    } else {
      // Si no está seleccionada, seleccionamos la nueva
      this.seleccionadas = [localidad];
    }
    this.actualizarMensaje();
  }

  public navegarActualizar() {
    if (this.seleccionadas.length === 1) {
     // Redirigir o mostrar una vista para actualizar la localidad
     const localidadId = this.seleccionadas[0].idLocalidad;

     sessionStorage.removeItem("idLocalidadActualizar")
     sessionStorage.setItem("idLocalidaActualizar", localidadId)

     console.log(localidadId)

     this.router.navigate(['/actualizar-localidad'])
    }
  }

  obtenerLocalidades() {
    console.log("estoy dentro de obtenerLocalidades")
    this.localidadesService.obtenerTodasLasLocalidades().subscribe({
      next: (data) => {
        console.log(data.respuesta)
        this.localidades = data.respuesta;
      },
      error(err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudimos obtener todas las localidad por favor vuelve a intentarlo' + err,
        });
      },
    })
  }

  private actualizarMensaje() {
    const tam = this.seleccionadas.length;
    this.textoBtnEliminar = tam > 0 ? `${tam} ${tam === 1 ? 'elemento' : 'elementos'}` : "";
  }

  public confirmarEliminacion() {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la localidad seleccionada.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarLocalidades();
        Swal.fire("Eliminada!", "La localidad seleccionada ha sido eliminada.", "success");
      }
    });
  }

  public eliminarLocalidades() {
    this.localidades = this.localidades.filter(l => !this.seleccionadas.includes(l));
    this.seleccionadas = [];
    this.actualizarMensaje();
  }

  trackByIndex(index: number, item: LocalidadObtenidaDTO): number {
    return index;
  }
}
