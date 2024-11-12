import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'informacion-usuario',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './informacion-usuario.component.html',
  styleUrl: './informacion-usuario.component.css'
})
export class InformacionUsuarioComponent {

}
