import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
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

  constructor(private formBuilder: FormBuilder,private authService: AuthService, private router: Router) {

    this.crearFormulario();
 }


  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['Perez', [Validators.required]],
      telefono: this.formBuilder.array([this.crearTelefonoControl()]),
      direccion: ['', [Validators.required]],
      ciudad: ['ARMENIA',[Validators.required,Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      confirmaPassword: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      rol: ['CLIENTE',[Validators.required]],
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

  public registrar() {
    const crearCuenta = {
      ...this.registroForm.value,
      telefono: this.registroForm.value.telefono.map((tel: string) => tel.toString()) // Asegúrate de que son cadenas

  };

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
            this.router.navigate(['/verificacion-codigo']); // Redirección
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
  const password = formGroup.get('password')?.value;
  const confirmaPassword = formGroup.get('confirmaPassword')?.value;


  // Si las contraseñas no coinciden, devuelve un error, de lo contrario, null
  return true; //password == confirmaPassword ? null : { passwordsMismatch: true };
 }

}


