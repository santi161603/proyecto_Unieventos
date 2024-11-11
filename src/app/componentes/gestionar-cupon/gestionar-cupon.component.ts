import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { Router, RouterModule } from '@angular/router';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
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
  constructor(private cuponService: CuentaAutenticadaService, private router:Router) {
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
    if (confirm(`¿Estás seguro de que quieres eliminar ${this.cuponesSeleccionados.length} cupón(es)?`)) {
      this.eliminarCuponesSeleccionados();
    }
  }

  // Eliminar cupones seleccionados usando el servicio
  eliminarCuponesSeleccionados(): void {
    //const ids = this.cuponesSeleccionados.map(cupon => cupon.id); // Asegúrate de que cada cupón tenga un `id`
   /* this.cuponService.deleteCupones(ids).subscribe(
      () => {
        // Filtrar los cupones eliminados de la lista principal
        this.cupones = this.cupones.filter(cupon => !ids.includes(cupon.id));
        this.cuponesSeleccionados = [];
        this.actualizarTextoEliminar();
        alert('Cupones eliminados con éxito.');
      },
      (error) => {
        console.error('Error al eliminar cupones:', error);
        alert('Hubo un error al eliminar los cupones. Inténtalo de nuevo.');
      }
    );*/
  }

  trackByIndex(index: number, item: CuponObtenidoDTO): number {
    return index;
  }
}
