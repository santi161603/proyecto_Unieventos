import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificacion-codigo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './verificacion-codigo.component.html',
  styleUrls: ['./verificacion-codigo.component.css']
})
export class VerificacionCodigoComponent {
  codigoForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.codigoForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  verificarCodigo() {
    const codigo = this.codigoForm.get('codigo')?.value;
    // Lógica para verificar el código aquí. Puedes llamar a un servicio de autenticación o verificación.
    console.log('Código ingresado:', codigo);
    // Si el código es correcto, redirige o muestra un mensaje de éxito
  }

  reenviarCodigo() {
    // Lógica para reenviar el código aquí. Podrías llamar a un servicio para reenviar el código
    console.log('Código reenviado');
  }
}

