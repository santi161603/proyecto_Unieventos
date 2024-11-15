import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago-pendiente',
  standalone: true,
  imports: [],
  templateUrl: './pago-pendiente.component.html',
  styleUrl: './pago-pendiente.component.css'
})
export class PagoPendienteComponent {

  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/home']); // Cambia a la ruta de tu pantalla principal
  }

  navigateToPurchaseHistory(): void {
    this.router.navigate(['/historial-compras']); // Cambia a la ruta de historial de compras
  }
}
