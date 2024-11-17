import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auntentication.service';
import Swal from 'sweetalert2';
import { LoginDTO } from '../../dto/login-dto';
import { TokenService } from '../../servicios/token.service';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../servicios/auth.service';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm!: FormGroup;
  intentosContraseña: number = 0;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private tokenService: TokenService, private clientServ:ClientService, private router:Router) {
    this.crearFormulario();
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  public login() {

    const loginDTO = this.loginForm.value as LoginDTO;

    if (this.intentosContraseña <= 3) {

      this.auth.iniciarSesion(loginDTO).subscribe({
        next: (data) => {
          this.tokenService.login(data.respuesta.token);

        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error.respuesta
          });
          if (error.error.respuesta == "La contraseña es incorrecta") {
            this.intentosContraseña += 1
          }else if(error.error.respuesta == "suspendida"){
            Swal.fire({
              title: "Tu cuenta ha sido suspendida",
              text: "Hemos suspendido tu cuenta ya que has puesto tu contraseña mal 3 veces. Oprime 'Aceptar' para cambiar la clave o 'Cancelar' para cerrar.",
              icon: "warning",
              showCancelButton: true, // Muestra el botón de cancelar
              confirmButtonText: 'Aceptar', // Texto del botón Aceptar
              cancelButtonText: 'Cancelar', // Texto del botón Cancelar
            }).then((result) => {
              if (result.isConfirmed) {

                this.router.navigate(['/recuperar-suspendido'])

              } else if (result.isDismissed) {
              }
            });
          } else if(error.error.respuesta == "inactiva"){
            Swal.fire({
              title: "Tu cuenta no a sido activada",
              text: "Tu cuenta no a sido activada activala para continuar, oprime aceptar.",
              icon: "warning",
              showCancelButton: true, // Muestra el botón de cancelar
              confirmButtonText: 'Aceptar', // Texto del botón Aceptar
              cancelButtonText: 'Cancelar', // Texto del botón Cancelar
            }).then((result) => {
              if (result.isConfirmed) {

                sessionStorage.removeItem("correoUsuario")
                sessionStorage.setItem("correoUsuario", loginDTO.email)
                this.router.navigate(['/verificacion-codigo'])

              } else if (result.isDismissed) {
              }
          })
          }
        },
      });
    } else{

      this.clientServ.suspenderCuenta(loginDTO).subscribe({
        next:(value)=> {
          Swal.fire({
            title: "Tu cuenta ha sido suspendida",
            text: "Hemos suspendido tu cuenta ya que has puesto tu contraseña mal 3 veces. Oprime 'Aceptar' para cambiar la clave o 'Cancelar' para cerrar.",
            icon: "warning",
            showCancelButton: true, // Muestra el botón de cancelar
            confirmButtonText: 'Aceptar', // Texto del botón Aceptar
            cancelButtonText: 'Cancelar', // Texto del botón Cancelar
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/recuperar-suspendido'])
            } else if (result.isDismissed) {
            }
          });
        },
      })
    }

   }

}
