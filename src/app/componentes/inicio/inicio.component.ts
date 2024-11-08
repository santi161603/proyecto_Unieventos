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
      "https://firebasestorage.googleapis.com/v0/b/unieventos-d397d.appspot.com/o/f8cca7dd-395f-40c8-ae39-6855add8dc0d-evento.jpg?alt=media&token=bb1dcccc-fa10-4a87-a0b3-c6ba1773e599",
      "https://aguacatec.es/wp-content/uploads/2023/10/e5a978b8-6772-4c85-a50e-15581af7d483.png",
      "https://picsum.photos/1000?random=3"
      ]
  };
  myImages: string = 'carouselExample';

}
