import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})
export class PagoExitosoComponent {



  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/home']); // Cambia a la ruta de tu pantalla principal
  }

  navigateToPurchaseHistory(): void {
    this.router.navigate(['/historial-compras']); // Cambia a la ruta de historial de compras
  }
}
