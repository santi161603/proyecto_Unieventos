import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RestabecerContrasenaDTO } from '../../dto/restablecer-contrasena-dto';
import { ClientService } from '../../servicios/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CorreoDTO } from '../../dto/correo-dto';

@Component({
  selector: 'app-cambiar-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambiar-contrasena.component.html',
  styleUrl: './cambiar-contrasena.component.css'
})
export class CambiarContrasenaComponent {
    cambiarContrasenaForm: FormGroup;
    correoUsuario: string = "";  // Para almacenar solo la dirección de correo
    idUsuario: string = "";

    constructor(private fb: FormBuilder, private clientServi: ClientService, private route: Router,) {
      // Creamos el formulario y aplicamos las validaciones
      this.cambiarContrasenaForm = this.fb.group({
        contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
        confirmarContrasena: ['', [Validators.required, Validators.minLength(6)]]
      }, { validator: this.passwordsIguales });
    }

    ngOnInit(): void {
      // Recuperamos los datos de sessionStorage
      const datosUsuario = sessionStorage.getItem('usuarioDatos');

      if (datosUsuario) {
        console.log('Datos recuperados de sessionStorage:', datosUsuario); // Verificación
        const { correoUser, idUsuario } = JSON.parse(datosUsuario);

        console.log(correoUser);
        // Accedemos a la propiedad 'correo' dentro de CorreoDTO
        this.correoUsuario = correoUser; // Esto obtiene solo el campo 'correo' dentro del objeto CorreoDTO
        this.idUsuario = idUsuario;
      }
    }

    // Método para validar que las contraseñas coincidan
    passwordsIguales(group: FormGroup) {
      const contrasenaNueva = group.get('contrasenaNueva')?.value;
      const confirmarContrasena = group.get('confirmarContrasena')?.value;
      return contrasenaNueva === confirmarContrasena ? null : { noCoinciden: true };
    }

    // Getters para acceder a los campos en el HTML
    get contrasenaNueva() {
      return this.cambiarContrasenaForm.get('contrasena');
    }

    get confirmarContrasena() {
      return this.cambiarContrasenaForm.get('confirmarContrasena');
    }



    // Método para manejar el envío del formulario
    cambiarContrasena() {
      if (this.cambiarContrasenaForm.valid) {
        const nuevaContrasena = this.cambiarContrasenaForm.value as RestabecerContrasenaDTO;

        nuevaContrasena.correo = this.correoUsuario;

        this.clientServi.restablecerContrasena(nuevaContrasena).subscribe({
          next: (result) =>{
            Swal.fire({
              icon: 'success',
              title: 'Contraseña cambiada',
              text: 'La contraseña ha sido cambiada exitosamente no olvide su nueva contraseña: ' + nuevaContrasena.contrasenaNueva,
              confirmButtonText: 'Aceptar'
            }).then((result) =>{
              if(result.isConfirmed){
                sessionStorage.removeItem('usuarioDatos');
                this.route.navigate(['/login'])
              }
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al intentar cambiar la contraseña: ' + err,
            });
          }
        })


      }
    }
}
