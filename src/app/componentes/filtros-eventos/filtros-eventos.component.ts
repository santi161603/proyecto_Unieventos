import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtros-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtros-eventos.component.html',
  styleUrls: ['./filtros-eventos.component.css']
})
export class FiltrosEventosComponent {
  @Input() selectedCategory: string = '';
  @Input() selectedCity: string = '';
  @Input() selectedDate: string = '';

  @Output() categoryChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<string>();

  categories = ['Música', 'Deportes', 'Teatro'];
  cities = ['Bogotá', 'Medellín', 'Cali'];
  dates = ['Esta semana', 'Este mes', 'Próximamente'];

  onCategoryChange() {
    this.categoryChange.emit(this.selectedCategory);
  }

  onCityChange() {
    this.cityChange.emit(this.selectedCity);
  }

  onDateChange() {
    this.dateChange.emit(this.selectedDate);
  }
}
