import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title="UNIEVENTOS";
  rol: string = "";
  isLogger: boolean = false;
  userProfileImage: string = 'https://firebasestorage.googleapis.com/v0/b/unieventos-d397d.appspot.com/o/11f17bd7-a025-4ea2-af87-f34f3bcff858-usuario.jpg?alt=media&token=9f26ebc4-54fb-476a-8fd5-67f365add5c3';
  private rolSubscription: Subscription | undefined;
  private isLoggerSubscription: Subscription | undefined;

  constructor(private tokenService: TokenService ) {
  }

  ngOnInit(): void {
    // Nos suscribimos al observable del rol para detectar cambios
    this.rolSubscription = this.tokenService.getRolObservable().subscribe({
      next: (rol) => {
        this.rol = rol;
        console.log('Rol actualizado:', this.rol);
      }
    });

    this.isLoggerSubscription = this.tokenService.isLoggerObservable().subscribe({
      next: (isLogger) => {
        this.isLogger = isLogger;
        console.log("actual mente esta:", this.isLogger);
      }
    })
  }

  cerrarSesion() {
    this.tokenService.logout();
  }

  ngOnDestroy(): void {
    // Nos desuscribimos para evitar fugas de memoria
    if (this.rolSubscription) {
      this.rolSubscription.unsubscribe();
    }
    if (this.isLoggerSubscription){
      this.isLoggerSubscription.unsubscribe();
    }
  }
}
