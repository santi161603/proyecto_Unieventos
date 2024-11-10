import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { CorreoDTO } from '../../dto/correo-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.css']
})
export class RestablecerContrasenaComponent {
  restablecerForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router) {
    console.log('RestablecerContrasenaComponent cargado');
    // Creamos el formulario con un campo de correo que tiene validación
    this.restablecerForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]] // Correo es requerido y debe ser un email válido
    });
  }

  // Método para manejar el envío del formulario
  enviarCorreo() {
    if (this.restablecerForm.valid) {
      const correo = this.restablecerForm.value as CorreoDTO;

      const correoUser = this.restablecerForm.value.correo;

      this.clientService.enviarTokenRecuperacion(correo).subscribe({
        next:(value) => {

          if(value && !value.error){

            const idUsuario = value.respuesta;

            const datosUsuario = {correoUser, idUsuario}

            sessionStorage.setItem('usuarioDatos', JSON.stringify(datosUsuario))

            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se ha enviado el token de recuperación al correo.',
              confirmButtonText: 'Aceptar'
            }).then((result)=>{
              if(result.isConfirmed){
            this.router.navigate(['/verificar-codigo-restablecer']);
          }});


          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al intentar verificar el codigo:' + err,
          });
        },
      })

    }
  }
}
