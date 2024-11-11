import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumService } from '../../servicios/get-enums.service';
import Swal from 'sweetalert2';
import { ClientService } from '../../servicios/auth.service';
import { DTOActualizarLocalidad } from '../../dto/actualizar-localidad-dto';
import { AdministradorService } from '../../servicios/administrador.service';
import { LocalidadObtenidaDTO } from '../../dto/localidad-obtenida-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-localidad',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './actualizar-localidad.component.html',
  styleUrl: './actualizar-localidad.component.css'
})
export class ActualizarLocalidadComponent implements OnInit {

  actualizarLocalidadForm: FormGroup;
  localidadActual: LocalidadObtenidaDTO | undefined; // Objeto de la localidad a actualizar
  ciudades: string[] = [];
  tiposLocalidad: string[] = [];
  imagenSeleccionada: File | null = null;
  idLocalidad: string ="";

  constructor(
    private fb: FormBuilder,
    private enumSer: EnumService,
    private localidadService: ClientService,
    private administradorService: AdministradorService,
    private router: Router
  ) {
    this.actualizarLocalidadForm = this.fb.group({
      nombreLocalidad: ['', [Validators.required, Validators.maxLength(50)]],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      tipoLocalidad: ['', Validators.required],
      capacidadMaxima: ['', [Validators.required, Validators.min(1)]],
      capacidadDisponible: ['', [Validators.required, Validators.min(1)]],
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
  ngOnInit(): void {
    const id = sessionStorage.getItem('idLocalidaActualizar');
    if(id){
      this.idLocalidad = id;
    console.log(id)
    this.localidadService.obtenerLocalidadPorId(id).subscribe({
      next: (data) =>{
        this.localidadActual = data.respuesta;
        this.actualizarLocalidadForm.patchValue({
          nombreLocalidad: data.respuesta.nombreLocalidad,
          direccion: data.respuesta.direccion,
          ciudad: data.respuesta.ciudad,
          tipoLocalidad: data.respuesta.tipoLocalidad,
          capacidadMaxima: data.respuesta.capacidadMaxima,
          capacidadDisponible: data.respuesta.capacidadDisponible
        });
      },
      error:(err)=> {
          console.log("no pudimos obtener las localidades", err)
      }
    })
    }else{

    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    } else {
      this.imagenSeleccionada = null;
    }
  }

  onUpdate(): void {
    if (this.actualizarLocalidadForm.valid) {
      const localidadActualizada = {
        ...this.actualizarLocalidadForm.value,
        imageLocalidad: this.imagenSeleccionada ? null : ""
      } as DTOActualizarLocalidad;
      console.log(localidadActualizada.imageLocalidad)
      if (this.imagenSeleccionada) {

      console.log(localidadActualizada.imageLocalidad)
        // Si se seleccionó una imagen, llama al servicio de subida de imagen
        this.administradorService.subirImagen(this.imagenSeleccionada).subscribe({
          next: (urlImagen) => {
            localidadActualizada.imageLocalidad = urlImagen.respuesta;
            console.log(urlImagen)
            console.log(urlImagen.respuesta)

            console.log(localidadActualizada.imageLocalidad)
             // Agrega la URL de la imagen al DTO
            this.actualizarLocalidad(localidadActualizada);
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
        this.actualizarLocalidad(localidadActualizada);
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos requeridos antes de enviar.',
      });
    }
  }

  private actualizarLocalidad(localidadData: DTOActualizarLocalidad): void {
    this.administradorService.actualizarLocalidad(this.idLocalidad,localidadData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La localidad se ha actualizado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then((result) =>{
          if(result.isConfirmed){
        this.actualizarLocalidadForm.reset(); // Reinicia el formulario tras la creación exitosa
        this.imagenSeleccionada = null; // Resetea la imagen seleccionada
        this.router.navigate(['/'])
          }
        });

      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar la localidad. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }

}
