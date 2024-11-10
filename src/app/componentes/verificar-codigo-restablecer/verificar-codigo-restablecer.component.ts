import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../servicios/auth.service';
import Swal from 'sweetalert2';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-codigo-restablecer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificar-codigo-restablecer.component.html',
  styleUrl: './verificar-codigo-restablecer.component.css'
})
export class VerificarCodigoRestablecerComponent {
  codigoForm: FormGroup;
  correoUsuario: string = "";  // Para almacenar solo la dirección de correo
  idUsuario: string = "";

  constructor(private formBuilder: FormBuilder, private router: Router,private authService: ClientService, private route: ActivatedRoute,) {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  ngOnInit(): void {
    // Recuperamos los datos de sessionStorage
    const datosUsuario = sessionStorage.getItem('usuarioDatos');

    if (datosUsuario) {
      // Parseamos la cadena JSON a un objeto JavaScript
      const { correoUser, idUsuario } = JSON.parse(datosUsuario);

      // Accedemos a la propiedad 'correo' dentro de CorreoDTO
      this.correoUsuario = correoUser; // Esto obtiene solo el campo 'correo' dentro del objeto CorreoDTO
      this.idUsuario = idUsuario;
    }
  }

  verificarCodigo() {
    const codigo = this.codigoForm.get('codigo')?.value;

    if (this.codigoForm.valid) {
      // Llamar al servicio para verificar el código
      this.authService.verificarCodigo(this.idUsuario, codigo).subscribe({
        next: (response: MensajeDTO) => {
          // Aquí manejas la respuesta. Si el código es correcto, rediriges o muestras un mensaje de éxito
          console.log('Respuesta:', response);
          Swal.fire({
            title: 'Código verificado',
            text: 'Hemos validado que eres tu, oprime aceptar para proceder a restablecer tu contraseña',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
              this.router.navigate(['/cambiar-contrasena'])
          });
        },
        error: (error) => {
          // Aquí gestionas los errores
          Swal.fire({
            title: 'Error',
            text: error.error.respuesta || 'Problemas al intentar enviar el codigo de validacion',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  reenviarCodigo() {
    this.authService.reenviarToken(this.idUsuario).subscribe({
      next: (response: MensajeDTO) => {
        Swal.fire({
          title: 'Éxito',
          text: response.respuesta,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: error.error.respuesta || 'Hubo un problema al reenviar el token.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
