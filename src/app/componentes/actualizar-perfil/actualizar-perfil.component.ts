import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-actualizar-perfil',
  standalone: true,
  templateUrl: './actualizar-perfil.component.html',
  styleUrls: ['./actualizar-perfil.component.css'],
  imports: [ReactiveFormsModule,CommonModule, RouterModule, FormsModule], // Importa ReactiveFormsModule aquí
})
export class ActualizarPerfilComponent {
  perfilForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      console.log('Datos del perfil actualizados:', this.perfilForm.value);
      alert('Perfil actualizado con éxito.');
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
