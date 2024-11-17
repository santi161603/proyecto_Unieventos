import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormArray, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { TokenService } from '../../servicios/token.service';
import { CuentaActualizarDto } from '../../dto/cuenta-actualizar-dto';
import { CuentaObtenidaClienteDto } from '../../dto/cuenta-obtenida-cliente-dto';
import { EnumService } from '../../servicios/get-enums.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-perfil',
  standalone: true,
  templateUrl: './actualizar-perfil.component.html',
  styleUrls: ['./actualizar-perfil.component.css'],
  imports: [ReactiveFormsModule,CommonModule, RouterModule], // Importa ReactiveFormsModule aquí
})
export class ActualizarPerfilComponent implements OnInit {
  perfilForm: FormGroup;
  ciudades: string[] = [];
  imagenSeleccionada: File | null = null;
  Usuario: CuentaObtenidaClienteDto | undefined;


  constructor(private fb: FormBuilder, private cuentaAut: CuentaAutenticadaService, private tokenSer:TokenService, private enumSer:EnumService) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: [''],
      ciudad: ['', Validators.required],
      email:[''],
      telefono: this.fb.array([]), // Inicialización vacía
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]{8,10}$')]] // Asegurando que la cédula sea un número de entre 8 y 10 dígitos
    });

  }


  ngOnInit(): void {
    // Cargar datos del usuario aquí
    this.enumSer.listarCiudades().subscribe({
      next:(value)=> {
          this.ciudades = value;
      },
    })

    this.cuentaAut.obtenerUsuarioPorID(this.tokenSer.getIDCuenta()).subscribe({
      next:(value) => {
        this.Usuario = value.respuesta
          this.cargarDatosUsuario(value.respuesta);
      },
      error:(err)=> {
          console.log("error al obtener el usuario")
      },
    });
  }

   // Método que devuelve el array de teléfonos
   get telefono() {
    return this.perfilForm.get('telefono') as FormArray;
  }

  cargarDatosUsuario(usuario: CuentaObtenidaClienteDto): void {
    this.perfilForm.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      ciudad: usuario.ciudad,
      email: usuario.email,
      cedula: usuario.cedula
    });

    console.log(usuario.telefono)
    // Solo agrega los teléfonos si existen
  if (usuario.telefono && usuario.telefono.length > 0) {
    usuario.telefono.forEach((tel: string) => {
      this.telefono.push(new FormControl(tel, Validators.required));
    });
  }
  }

   agregarTelefono(): void {
    this.telefono.push(new FormControl('', Validators.required));
  }

  eliminarTelefono(index: number): void {
    this.telefono.removeAt(index);
  }


  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    } else {
      this.imagenSeleccionada = null;
    }
  }

   // Método para manejar el envío del formulario
   onSubmit(): void {
    if (this.perfilForm.valid) {
      const updatedData: CuentaActualizarDto = {
        ...this.perfilForm.value,
        telefono: this.perfilForm.value.telefono.map((tel: string) => tel.toString()),
      };

      // Si se seleccionó una nueva imagen, llamar al servicio de actualización de la imagen
      if (this.imagenSeleccionada) {
        // Aquí, puedes comprobar si la imagen es una URL previa o una nueva imagen
        this.cuentaAut.actualizarImagenPerfil(this.tokenSer.getIDCuenta(), this.imagenSeleccionada).subscribe({
          next: () => {
            this.actualizarUsuario(updatedData);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'A ocurrido un problema',
              text: 'Al intentar actualizar tu imagen a surgido un problema vuelve a intentar' + err,
              confirmButtonText: 'Aceptar'
            }).then((result) =>{
              if(result.isConfirmed){
              }
            });
          },
        });
      } else {
        // Si no se seleccionó una nueva imagen, actualizar directamente
        this.actualizarUsuario(updatedData);
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Formulario no valido',
        text: 'Formulario no valido verifique y vuelva a intentar',
        confirmButtonText: 'Aceptar'
      }).then((result) =>{
        if(result.isConfirmed){
        }
      });
    }
  }

  // Método para actualizar los datos del usuario
  actualizarUsuario(updatedData: CuentaActualizarDto): void {
    this.cuentaAut.actualizarUsuario(updatedData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Se a actualizado tu perfil exitosa mente',
          confirmButtonText: 'Aceptar'
        }).then((result) =>{
          if(result.isConfirmed){
          this.imagenSeleccionada = null; // Resetea la imagen seleccionada
          window.location.reload();
          }
        });
      },
      error: (err) => {
        console.error('Error al actualizar los datos', err);
      },
    });
  }
}
