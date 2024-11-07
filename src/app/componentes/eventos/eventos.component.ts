import { Component } from '@angular/core';
import { HeaderEventosComponent } from '../header-eventos/header-eventos.component';
import { BannerComponent } from '../banner/banner.component';
import { SearchComponent } from "../search/search.component";
import { FiltrosEventosComponent } from "../filtros-eventos/filtros-eventos.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [HeaderEventosComponent, BannerComponent, SearchComponent, FiltrosEventosComponent, CommonModule],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent {
  eventos = [
    { nombre: 'Concierto de Rock', descripcion: 'Un evento increíble de música en vivo', categoria: 'Música', ciudad: 'Bogotá', fecha: 'Hoy' },
    { nombre: 'Teatro clásico', descripcion: 'Una obra de teatro clásica en el teatro nacional', categoria: 'Teatro', ciudad: 'Medellín', fecha: 'Este fin de semana' },
    { nombre: 'Maratón de la ciudad', descripcion: 'Un evento deportivo con miles de participantes', categoria: 'Deportes', ciudad: 'Cali', fecha: 'Próximamente' },
  ];

  // Filtros
  nombreEvento: string = '';
  categoria: string = '';
  ciudad: string = '';
  fecha: string = '';

  filtrarEventos() {
    // Filtrar los eventos por los valores de los filtros
    this.eventos = this.eventos.filter(evento => {
      return (
        (this.nombreEvento ? evento.nombre.toLowerCase().includes(this.nombreEvento.toLowerCase()) : true) &&
        (this.categoria ? evento.categoria === this.categoria : true) &&
        (this.ciudad ? evento.ciudad === this.ciudad : true) &&
        (this.fecha ? evento.fecha === this.fecha : true)
      );
    });
  }
}
