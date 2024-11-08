import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar directivas como ngIf, ngFor
import { RouterModule } from '@angular/router'; // Para el enrutamiento con routerLink

@Component({
  selector: 'app-header-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importar el RouterModule para usar routerLink
  templateUrl: './header-eventos.component.html',
  styleUrls: ['./header-eventos.component.css']
})
export class HeaderEventosComponent {
  title = 'UNIEVENTOS'; // El título que se mostrará en el header
}

