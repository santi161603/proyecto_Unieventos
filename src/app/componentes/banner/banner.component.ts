import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule si usas directivas como ngIf, ngFor

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',  // Ruta del archivo HTML del componente
  styleUrls: ['./banner.component.css']  // Ruta del archivo CSS del componente
})
export class BannerComponent {
  // Puedes agregar lógica adicional aquí si es necesario
}
