import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
    this.crearFormulario();
  }

  private crearFormulario() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  public login() {
    if (this.loginForm.valid) {
      console.log("Datos del login:", this.loginForm.value);
      // Aquí puedes agregar lógica adicional para manejar el envío del formulario
      // como llamar a un servicio para autenticar al usuario
    } else {
      console.log("Formulario inválido");
    }
  }
}
