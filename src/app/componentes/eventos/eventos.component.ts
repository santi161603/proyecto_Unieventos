import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { SearchComponent } from "../search/search.component";
import { FiltrosEventosComponent } from "../filtros-eventos/filtros-eventos.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, RouterModule, FormsModule, BannerComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {
navegarADetalleEvento(arg0: string) {
throw new Error('Method not implemented.');
}
  categoryEvents: EventoObtenidoDTO[] = [];
  cities: string[] = [];
  categories: string[] = [];
  searchQuery: string = ''; // Tipo 'string' para el buscador
  categoria: string = '';
  ciudad: string = '';
 // Métodos para manejar los cambios de filtros
 onNombreEventoChange(nombre: string) {
  this.searchQuery = nombre; // Cambio a searchQuery
  this.filtrarEventos();
}

onCategoriaChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  this.categoria = value;
  this.filtrarEventos();
}

onCiudadChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  this.ciudad = value;
  this.filtrarEventos();
}

// Método para filtrar eventos (este es solo un ejemplo)
filtrarEventos() {
  // Aquí puedes agregar la lógica de filtrado para los eventos
  console.log('Filtrando eventos por:', this.categoria, this.ciudad, this.searchQuery);
}
}
