import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'eventosPorCiudad',
  templateUrl: './eventos-por-ciudad.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./eventos-por-ciudad.component.css'],
  standalone: true
})
export class EventosPorCiudadComponent implements OnInit {
  cityEvents = [
    { id: 1, name: 'Concierto de Rock', date: '2024-11-15', location: 'Auditorio Central' },
    { id: 2, name: 'Feria del Libro', date: '2024-11-20', location: 'Centro Cultural' },
    // Agrega más eventos según sea necesario
  ];

  constructor() {}

  ngOnInit(): void {}
}

