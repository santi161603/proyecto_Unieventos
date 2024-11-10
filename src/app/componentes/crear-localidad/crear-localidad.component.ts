import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { AdministradorService } from '../../servicios/administrador.service';
import { CommonModule } from '@angular/common';
import { LocalidadDTO } from '../../dto/localidad-dto';
import { EnumService } from '../../servicios/get-enums.service';

@Component({
  selector: 'app-crear-localidad',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-localidad.component.html',
  styleUrls: ['./crear-localidad.component.css']
})
export class CrearLocalidadComponent {
  crearLocalidadForm: FormGroup;
  imagenSeleccionada: File | null = null;
  ciudades: string[] = [];
  tiposLocalidad: string[] = [];

  constructor(private fb: FormBuilder, private AdministradorService: AdministradorService, private enumSer: EnumService) {
    this.crearLocalidadForm = this.fb.group({
      nombreLocalidad: ['', [Validators.required, Validators.maxLength(50)]],
      direccion: ['', [Validators.required, Validators.maxLength(700)]],
      ciudad: ['', [Validators.required]],
      tipoLocalidad: ['', [Validators.required]],
      capacidadMaxima: [1, [Validators.required, Validators.min(1)]],
      capacidadDisponible: [1, [Validators.required, Validators.min(1)]],
    });

    this.obtenerCiudades()
    this.obtenerTipoLocalidades()
  }

  private obtenerCiudades() {
    this.enumSer.listarCiudades().subscribe({
      next: (data) => {
        this.ciudades = data
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al intentar obtener las ciudades:' + error,
        });
      },
    })
  }

  private obtenerTipoLocalidades() {
    this.enumSer.listarTipoLocalidades().subscribe({
      next: (data) => {
        this.tiposLocalidad = data
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al intentar obtener las ciudades:' + error,
        });
      },
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    } else {
      this.imagenSeleccionada = null;
    }
  }

  onSubmit(): void {
    if (this.crearLocalidadForm.valid) {
      const nuevaLocalidad = {
        ...this.crearLocalidadForm.value
      } as LocalidadDTO;
      if (this.imagenSeleccionada) {
        // Si se seleccionó una imagen, llama al servicio de subida de imagen
        this.AdministradorService.subirImagen(this.imagenSeleccionada).subscribe({
          next: (urlImagen) => {
            nuevaLocalidad.imageLocalidad = urlImagen.respuesta;
            console.log(urlImagen)
            console.log(urlImagen.respuesta)
             // Agrega la URL de la imagen al DTO
            this.crearLocalidad(nuevaLocalidad);
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al subir la imagen. Por favor, inténtalo de nuevo.' + error,
            });
          }
        });
      } else {
        // Si no se seleccionó imagen, solo llama al servicio de crear localidad
        this.crearLocalidad(nuevaLocalidad);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos requeridos antes de enviar.',
      });
    }
  }

  private crearLocalidad(localidadData: LocalidadDTO): void {
    this.AdministradorService.crearLocalidad(localidadData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La localidad se ha creado correctamente.',
        });
        this.crearLocalidadForm.reset(); // Reinicia el formulario tras la creación exitosa
        this.imagenSeleccionada = null; // Resetea la imagen seleccionada
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear la localidad. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }

}
