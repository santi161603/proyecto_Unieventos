import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title="Unieventos";
  rol: string = "";

  constructor(private tokenService: TokenService ) {
    this.getRolUser;
  }

  private getRolUser(){
    this.rol = this.tokenService.getRol();
  }
}
