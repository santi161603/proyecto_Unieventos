import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  businessDetail:any={
    images: [
      "https://picsum.photos/1000?random=2",
      "https://picsum.photos/1000?random=1",
      "https://picsum.photos/1000?random=3"
      ]
  };
  myImages: string = 'carouselExample';
}
