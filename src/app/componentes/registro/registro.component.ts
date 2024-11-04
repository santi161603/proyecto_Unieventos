import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CrearCuentaDTO } from '../../dto/crear-cuenta-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registroForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private authService: AuthService) { 

    this.crearFormulario();
 }
 
 
  private crearFormulario() {
    this.registroForm = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      apellido: ['Perez', [Validators.required]],
      telefonos: [
        '', 
        [
            Validators.required, 
            Validators.maxLength(10)
        ]
    ],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required]],
      ciudad: [
        'ARMENIA', 
        [
            Validators.required, 
            Validators.maxLength(50)
        ]
    ],
      password: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(7)]],
      rol: [
    'CLIENTE', 
    [
        Validators.required
    ]
],
    },
    
    { validators: this.passwordsMatchValidator } 
  );
 }
 

  public registrar() {
    const crearCuenta = this.registroForm.value as CrearCuentaDTO;

    this.authService.crearCuenta(crearCuenta).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Cuenta creada',
          text: 'La cuenta se ha creado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
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


 