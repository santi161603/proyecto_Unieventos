import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service'; // Asegúrate de importar el servicio
import { MensajeDTO } from '../../dto/mensaje-dto'; // Si es necesario importar DTO

@Component({
  selector: 'app-verificacion-codigo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificacion-codigo.component.html',
  styleUrls: ['./verificacion-codigo.component.css']
})
export class VerificacionCodigoComponent {
  codigoForm: FormGroup;
  idUsuario!: string;

  constructor(private formBuilder: FormBuilder, private router: Router,private authService: AuthService, private route: ActivatedRoute,) {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    });
  }

  ngOnInit(): void {
    // Obtener el idUsuario desde la URL de la ruta activa
    this.idUsuario = this.route.snapshot.paramMap.get('idUsuario') || '';
    console.log('ID Usuario:', this.idUsuario);
  }

  verificarCodigo() {
    const codigo = this.codigoForm.get('codigo')?.value;

    if (this.codigoForm.valid) {
      // Llamar al servicio para verificar el código
      this.authService.activarCuenta(this.idUsuario, codigo).subscribe({
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

