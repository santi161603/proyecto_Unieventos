import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AdministradorService } from '../../servicios/administrador.service';
import { LocalidadDTO } from '../../dto/localidad-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-localidades',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './gestionar-localidades.component.html',
  styleUrls: ['./gestionar-localidades.component.css']
})
export class GestionLocalidadesComponent {
  localidades: LocalidadDTO[];
  seleccionadas: LocalidadDTO[];
  textoBtnEliminar: string;

  constructor(public localidadesService: AdministradorService) {
    this.localidades = [];
    this.seleccionadas = [];
    this.textoBtnEliminar = "";
  }

  public seleccionar(localidad: LocalidadDTO, estado: boolean) {
    if (estado) {
      this.seleccionadas.push(localidad);
    } else {
      this.seleccionadas.splice(this.seleccionadas.indexOf(localidad), 1);
    }
    this.actualizarMensaje();
  }

  private actualizarMensaje() {
    const tam = this.seleccionadas.length;
    if (tam != 0) {
      this.textoBtnEliminar = tam === 1 ? "1 elemento" : `${tam} elementos`;
    } else {
      this.textoBtnEliminar = "";
    }
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
  trackByIndex(index: number, item: LocalidadDTO): number {
    return index;
  }
}
