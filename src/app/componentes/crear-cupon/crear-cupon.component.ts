import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdministradorService } from '../../servicios/administrador.service';
import { CrearCuponDTO } from '../../dto/crear-cupon-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-cupon.component.html',
  styleUrl: './crear-cupon.component.css'
})
export class CrearCuponComponent {

  cuponForm: FormGroup;

  constructor(private fb: FormBuilder,private adminService: AdministradorService) {
    this.cuponForm = this.fb.group({
      nombreCupon: ['', Validators.required],
      descripcionCupon: ['', Validators.required],
      porcentajeDescuento: [
        '',
        [Validators.required, Validators.min(0.1), Validators.max(80)]
      ],
      userCupon: [''],  // Campo opcional
      fechaVencimiento: [
        '',
        [Validators.required]
      ],
      cantidad: [
        '',
        [Validators.required, Validators.min(10)]
      ]
    });
  }


  onSubmit(): void {
    if (this.cuponForm.valid) {
      const nuevoCupon = this.cuponForm.value as CrearCuponDTO;
      this.adminService.crearCupon(nuevoCupon).subscribe({
        next: (value) =>{
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El evento se ha creado correctamente.',
          });
          this.cuponForm.reset(); // Reinicia el formulario tras la creación exitosa
        },
        error: (error) =>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear el evento. Por favor, inténtalo de nuevo.',
          });
        }
      })
    } else {
      this.cuponForm.markAllAsTouched();
    }
  }
}
