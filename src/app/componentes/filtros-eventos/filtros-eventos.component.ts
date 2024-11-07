import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filtros-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Agrega FormsModule aquí
  templateUrl: './filtros-eventos.component.html',
  styleUrls: ['./filtros-eventos.component.css']
})
export class FiltrosEventosComponent {

// Define aquí las variables y lógica necesarias para los filtros
selectedCategory: string = '';
selectedCity: string = '';
selectedDate: string = '';

categories = ['Música', 'Deportes', 'Teatro'];
cities = ['Bogotá', 'Medellín', 'Cali'];
dates = ['Esta semana', 'Este mes', 'Próximamente'];
}
