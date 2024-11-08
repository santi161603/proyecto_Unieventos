import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { EnumService } from '../../servicios/get-enums.service';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registroForm!: FormGroup;
  ciudades: string[] = []; // Lista para almacenar las ciudades

  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router, private enumService: EnumService) {

    this.crearFormulario();
    this.cargarCiudades();
 }


  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      telefono: this.formBuilder.array([this.crearTelefonoControl()]),
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
    },

    { validators: this.passwordsMatchValidator }
  );
 }

 private crearTelefonoControl(): FormControl {
  return this.formBuilder.control('', [Validators.required, Validators.maxLength(10)]);
}

get telefono(): FormArray {
  return this.registroForm.get('telefono') as FormArray;
}

public addTelefono() {
  this.telefono.push(this.crearTelefonoControl());
}

public removeTelefono(index: number): void {
  this.telefono.removeAt(index);
}

private cargarCiudades() {
  this.enumService.listarCiudades().subscribe({
    next: (data) => {
      this.ciudades = data; // Asigna las ciudades obtenidas a la lista
    },
    error: (error) => {
      console.error('Error al obtener ciudades:', error);
    }
  });
}

  public registrar() {
    const crearCuenta = {
      ...this.registroForm.value,
      telefono: this.registroForm.value.telefono.map((tel: string) => tel.toString()) // Asegúrate de que son cadenas

  } as CrearCuentaDTO;

  console.log('Datos a enviar:', crearCuenta);

    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            const idUsuario = data.respuesta;
            this.router.navigate(['/verificacion-codigo', idUsuario]); // Redirección
          }
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    });


    }


 passwordsMatchValidator(formGroup: FormGroup) {
  const password = formGroup.get('contrasena')?.value;
  const confirmaPassword = formGroup.get('confirmaPassword')?.value;

  // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
  return password == confirmaPassword ? null : { passwordsMismatch: true };
 }

}


