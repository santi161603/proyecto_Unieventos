import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { Router, RouterModule } from '@angular/router';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { AdministradorService } from '../../servicios/administrador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-cupon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './gestionar-cupon.component.html',
  styleUrl: './gestionar-cupon.component.css'
})
export class GestionarCuponComponent {

  cupones: CuponObtenidoDTO[] = [];
  cuponesSeleccionados: CuponObtenidoDTO[] = [];    // Lista de cupones seleccionados para eliminación
  textoBtnEliminar = '';
  constructor(private cuponService: CuentaAutenticadaService, private router:Router, private administradorService: AdministradorService) {
    this.obtenerCupones();
  }

   navegarUpdate() {
    if (this.cuponesSeleccionados.length === 1) {
      // Redirigir o mostrar una vista para actualizar la localidad
      const idCupon = this.cuponesSeleccionados[0].idCupon;

      sessionStorage.removeItem("idCuponActualizar")
      sessionStorage.setItem("idCuponActualizar", idCupon)

      console.log(idCupon)

      this.router.navigate(['/actualizar-cupon'])
     }

    }
   // Obtener todos los cupones desde el servicio
   obtenerCupones(): void {
    this.cuponService.obtenerTodosLosCupones().subscribe({
      next: (data) => {
        this.cupones = data.respuesta
      },
      error:(err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No pudimos obtener los cupones' + err,
        });
      },

    });
  }

  // Seleccionar o deseleccionar un cupón
   // Seleccionar o deseleccionar un cupón
   public seleccionarCupon(cupon: CuponObtenidoDTO): void {
    if (this.cuponesSeleccionados.includes(cupon)) {
      this.cuponesSeleccionados = [];
    } else {
      this.cuponesSeleccionados = [cupon]; // Solo permitir seleccionar un cupón
    }
    this.actualizarTextoEliminar();
  }

  // Actualizar el texto del botón de eliminar
  actualizarTextoEliminar(): void {
    this.textoBtnEliminar = this.cuponesSeleccionados.length > 0
      ? `(${this.cuponesSeleccionados.length})`
      : '';
  }

  // Confirmar eliminación de cupones seleccionados
  confirmarEliminacion(): void {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción cambiará el estado del evento a Eliminado.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCuponesSeleccionados();
      }
    });
  }

  // Eliminar cupones seleccionados usando el servicio
  eliminarCuponesSeleccionados() {
  // Asegúrate de que cada cupón tenga un `id`
    const idCupon = this.cuponesSeleccionados[0].idCupon;
    this.administradorService.eliminarCupon(idCupon).subscribe({
      next:() => {
        Swal.fire({
          title: "Eliminado con exito",
          text: "Se a eliminado exitosamente el cupon",
          icon: "info",
        })
      },
      error:(error) => {
        console.error('Error al eliminar cupones:', error);
      }
  });
  }

  trackByIndex(index: number, item: CuponObtenidoDTO): number {
    return index;
  }
}
