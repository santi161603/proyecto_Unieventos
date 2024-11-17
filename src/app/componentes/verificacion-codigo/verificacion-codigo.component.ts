import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ClientService } from '../../servicios/auth.service'; // Asegúrate de importar el servicio
import { MensajeDTO } from '../../dto/mensaje-dto'; // Si es necesario importar DTO
import { TokenService } from '../../servicios/token.service';
import { CorreoDTO } from '../../dto/correo-dto';

@Component({
  selector: 'app-verificacion-codigo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificacion-codigo.component.html',
  styleUrls: ['./verificacion-codigo.component.css']
})
export class VerificacionCodigoComponent {
  codigoForm: FormGroup;
  correo!: string |null;

  constructor(private formBuilder: FormBuilder, private router: Router,private authService: ClientService, private route: ActivatedRoute, private tokenSer:TokenService) {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  ngOnInit(): void {
    // Obtener el idUsuario desde la URL de la ruta activa
    this.correo =  sessionStorage.getItem("correoUsuario")
    console.log('ID Usuario:', this.correo);
  }

  verificarCodigo() {
    const codigo = this.codigoForm.get('codigo')?.value;

    if (this.codigoForm.valid) {
      // Llamar al servicio para verificar el código

      if(this.correo){

        console.log(this.correo, codigo)

        this.authService.activarCuenta(this.correo, codigo).subscribe({
        next: (response: MensajeDTO) => {
          // Aquí manejas la respuesta. Si el código es correcto, rediriges o muestras un mensaje de éxito
          console.log('Respuesta:', response);
          Swal.fire({
            title: 'Código verificado',
            text: 'La cuenta ha sido activada correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
              this.router.navigate(['/login'])
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
      });}


    }
  }

  reenviarCodigo() {
    if(this.correo){

      const correoDTO:CorreoDTO = {
        correo:this.correo
      }
    this.authService.reenviarToken(correoDTO).subscribe({
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
}

