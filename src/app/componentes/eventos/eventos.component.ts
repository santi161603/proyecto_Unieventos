import { Component } from '@angular/core';
import { HeaderEventosComponent } from '../header-eventos/header-eventos.component';
import { BannerComponent } from '../banner/banner.component';
import { SearchComponent } from "../search/search.component";
import { FiltrosEventosComponent } from "../filtros-eventos/filtros-eventos.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, HeaderEventosComponent, BannerComponent, SearchComponent, FiltrosEventosComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {
  eventos = [
    { nombre: 'Concierto de Rock', descripcion: 'Un evento increíble de música en vivo', categoria: 'Música', ciudad: 'Bogotá', fecha: 'Hoy' },
    { nombre: 'Teatro clásico', descripcion: 'Una obra de teatro clásica en el teatro nacional', categoria: 'Teatro', ciudad: 'Medellín', fecha: 'Este fin de semana' },
    { nombre: 'Maratón de la ciudad', descripcion: 'Un evento deportivo con miles de participantes', categoria: 'Deportes', ciudad: 'Cali', fecha: 'Próximamente' },
  ];

  filteredEvents = [...this.eventos];

  // Filtros
  nombreEvento: string = '';
  categoria: string = '';
  ciudad: string = '';
  fecha: string = '';

  // Filtrar eventos con los criterios
  filtrarEventos() {
    this.filteredEvents = this.eventos.filter(evento => {
      return (
        (this.nombreEvento ? evento.nombre.toLowerCase().includes(this.nombreEvento.toLowerCase()) : true) &&
        (this.categoria ? evento.categoria.toLowerCase() === this.categoria.toLowerCase() : true) &&
        (this.ciudad ? evento.ciudad.toLowerCase() === this.ciudad.toLowerCase() : true) &&
        (this.fecha ? evento.fecha.toLowerCase() === this.fecha.toLowerCase() : true)
      );
    });
  }

  // Métodos para manejar los cambios de filtros
  onNombreEventoChange(nombre: string) {
    this.nombreEvento = nombre;
    this.filtrarEventos();
  }

  onCategoriaChange(categoria: string) {
    this.categoria = categoria;
    this.filtrarEventos();
  }

  onCiudadChange(ciudad: string) {
    this.ciudad = ciudad;
    this.filtrarEventos();
  }

  onDateChange(fecha: string) {
    this.fecha = fecha;
    this.filtrarEventos();
  }
}
