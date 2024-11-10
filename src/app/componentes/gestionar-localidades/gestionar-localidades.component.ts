import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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

  constructor(public localidadesService: ClientService) {
    this.obtenerLocalidades();
  }

  public seleccionar(localidad: LocalidadObtenidaDTO, estado: boolean) {
    if (estado) {
      this.seleccionadas.push(localidad);
    } else {
      this.seleccionadas = this.seleccionadas.filter(item => item !== localidad);
    }
    this.actualizarMensaje();


  }
  obtenerLocalidades() {
    console.log("estoy dentro de obtenerLocalidades")
    this.localidadesService.obtenerTodasLasLocalidades().subscribe({
      next: (data) =>{
        console.log(data.respuesta)
        this.localidades = data.respuesta
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
      text: "Esta acción eliminará las localidades seleccionadas.",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarLocalidades();
        Swal.fire("Eliminadas!", "Las localidades seleccionadas han sido eliminadas.", "success");
      }
    });
  }

  public eliminarLocalidades() {
    this.seleccionadas.forEach(loc => {
      // this.localidadesService.eliminar(loc.id); // Descomentar cuando se implemente el servicio
      this.localidades = this.localidades.filter(l => l !== loc);
    });
    this.seleccionadas = [];
    this.actualizarMensaje();
  }

  trackByIndex(index: number, item: LocalidadObtenidaDTO): number {
    return index;
  }
}
