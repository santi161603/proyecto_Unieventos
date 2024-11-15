import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../servicios/token.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { CuentaObtenidaClienteDto } from '../../dto/cuenta-obtenida-cliente-dto';

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
  usuario:CuentaObtenidaClienteDto |undefined;
  private rolSubscription: Subscription | undefined;
  private isLoggerSubscription: Subscription | undefined;

  constructor(private tokenService: TokenService, private cuentaaut:CuentaAutenticadaService ) {
  }

  ngOnInit(): void {
    // Nos suscribimos al observable del rol para detectar cambios
    this.cuentaaut.obtenerUsuarioPorID(this.tokenService.getIDCuenta()).subscribe(
      {
        next:(value)=> {
          this.usuario = value.respuesta
        },
      }
    )
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
