import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importar CommonModule para directivas básicas
import { FormsModule } from '@angular/forms';   // Importar FormsModule para ngModel

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importa solo CommonModule y FormsModule
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchText: string = '';  // Variable para almacenar el texto de búsqueda
}
