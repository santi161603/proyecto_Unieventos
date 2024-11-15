import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [],
  templateUrl: './pago-fallido.component.html',
  styleUrl: './pago-fallido.component.css'
})
export class PagoFallidoComponent {

  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/home']); // Cambia a la ruta de tu pantalla principal
  }

  navigateToPurchaseHistory(): void {
    this.router.navigate(['/historial-compras']); // Cambia a la ruta de historial de compras
  }
}
