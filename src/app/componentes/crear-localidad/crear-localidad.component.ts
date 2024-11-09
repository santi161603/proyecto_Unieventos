import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdministradorService } from '../../servicios/administrador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-localidad',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-localidad.component.html',
  styleUrls: ['./crear-localidad.component.css']
})
export class CrearLocalidadComponent {
  crearLocalidadForm: FormGroup;

  constructor(private fb: FormBuilder, private AdministradorService: AdministradorService) {
    this.crearLocalidadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      ciudad: ['', [Validators.required, Validators.min(50)]],
      tipoLocalidad: ['', [Validators.required, Validators.min(50)]],
      capacidadMaxima: [1, [Validators.required, Validators.min(1)]],
      capacidadDisponible: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.crearLocalidadForm.valid) {
      const nuevaLocalidad = {
        ...this.crearLocalidadForm.value
      };

      // Llamada al servicio para enviar los datos al backend
      this.AdministradorService.crearLocalidad(nuevaLocalidad).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La localidad se ha creado correctamente.',
          });
          this.crearLocalidadForm.reset(); // Reinicia el formulario tras la creación exitosa
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear la localidad. Por favor, inténtalo de nuevo.',
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos requeridos antes de enviar.',
      });
    }
  }
}
