import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() loginButton: boolean = false;
  @Input() registroButton: boolean = false;
  @Input() historialEventos: boolean = false;
  @Input() gestionEventos: boolean = false;
  @Input() Eventos: boolean = false;
  @Input() inicioButton: boolean = false;

  title="Unieventos";
  rol= "ADMIN";
}
