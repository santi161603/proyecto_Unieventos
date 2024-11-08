import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'eventosPorCategoria',
  templateUrl: './eventos-por-categorias.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./eventos-por-categorias.component.css'],
  standalone: true
})
export class EventosPorCategoriasComponent implements OnInit {
  categoryEvents = [
    { id: 1, name: 'Teatro Clásico', date: '2024-11-18', location: 'Teatro Municipal' },
    { id: 2, name: 'Exposición de Arte', date: '2024-11-22', location: 'Galería de Arte' },
    // Agrega más eventos según sea necesario
  ];

  constructor() {}

  ngOnInit(): void {}



}


