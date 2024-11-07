import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../carousel/carousel.component';
import { EventosPorCiudadComponent } from "../eventos-por-ciudad/eventos-por-ciudad.component";
import { EventosPorCategoriasComponent } from "../eventos-por-categorias/eventos-por-categorias.component";
import { BannerComponent } from "../banner/banner.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CarouselComponent, BannerComponent, EventosPorCategoriasComponent, EventosPorCiudadComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
