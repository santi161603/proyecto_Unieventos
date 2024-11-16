import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ClientService } from '../../servicios/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  @Input() id: string = 'carouselExample'; // ID para el carrusel
  eventos: EventoObtenidoDTO[] = [];

  constructor(private clientSer: ClientService, private router: Router) {
    this.obtenerEventos();
  }

  obtenerEventos() {
    this.clientSer.obtenerTodosLosEventos().subscribe({
      next: (value) => {
        const todosEventos = value.respuesta.filter((evento: { estadoEvento: string; }) => evento.estadoEvento === 'ACTIVO');;
        this.eventos = this.obtenerEventosAleatorios(todosEventos, 5);
      },
      error: (err) => console.error('Error al obtener eventos', err)
    });
  }

  // Seleccionar 5 eventos aleatorios
  obtenerEventosAleatorios(eventos: EventoObtenidoDTO[], cantidad: number): EventoObtenidoDTO[] {
    return eventos
      .sort(() => Math.random() - 0.5) // Orden aleatorio
      .slice(0, cantidad); // Seleccionar los primeros 5
  }

  // Navegar al detalle del evento
  navegarADetalle(idEvento: string) {


       this.router.navigate(['/eventos-detalle', idEvento]);

  }
}


