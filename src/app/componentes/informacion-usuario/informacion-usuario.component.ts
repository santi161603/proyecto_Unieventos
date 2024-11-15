import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';
import { CuentaObtenidaClienteDto } from '../../dto/cuenta-obtenida-cliente-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { TokenService } from '../../servicios/token.service';

@Component({
  selector: 'informacion-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './informacion-usuario.component.html',
  styleUrl: './informacion-usuario.component.css'
})
export class InformacionUsuarioComponent {
  usuario: CuentaObtenidaClienteDto = {
    cedula: '',
    nombre: '',
    apellido: '',
    telefono: [],
    direccion: '',
    email: '',
    ciudad: '',
    imageProfile: ''
  };

  constructor(private clientService: CuentaAutenticadaService, private tokenServ:TokenService) {
    this.obtenerUsuarioPorId(this.tokenServ.getIDCuenta())
  }
  obtenerUsuarioPorId(usuarioID: string) {
    this.clientService.obtenerUsuarioPorID(usuarioID).subscribe({
      next: (value) =>{
        this.usuario = value.respuesta
      },
      error:(err) => {
          console.log("error al obtener el cliente", err)
      },
    })
  }

}
