import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CorreoDTO } from '../../dto/correo-dto';
import { ClientService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-corre-suspendido',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './corre-suspendido.component.html',
  styleUrl: './corre-suspendido.component.css'
})
export class CorreSuspendidoComponent {
  restablecerForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService, private router: Router) {
    console.log('suspendido cargado');
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

      this.clientService.enviarTokenSuspendido(correo).subscribe({
        next:(value) => {

          console.log(value)
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
