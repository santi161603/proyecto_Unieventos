import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnumService } from '../../servicios/get-enums.service';
import { ClientService } from '../../servicios/auth.service';
import { TipoEventoDTO } from '../../dto/tipo-evento-dto';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';

@Component({
  selector: 'eventosPorCategoria',
  templateUrl: './eventos-por-categorias.component.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./eventos-por-categorias.component.css'],
  standalone: true
})
export class EventosPorCategoriasComponent implements OnInit {
  tipoEventos: string[] = []
  categoryEvents: EventoObtenidoDTO[] = [];


  constructor(private enumService: EnumService, private clientService: ClientService) {

  }
  ngOnInit(): void {
this.getTipoEventos()
  }

  getTipoEventos() {
    this.enumService.listarTipoEvento().subscribe({
      next:(value) => {
          this.tipoEventos = value
          console.log(this.tipoEventos)
          this.seleccionarTipoAleatoriamente();
      },
      error:(err) => {
          console.log("No pudimos recuperar la lista de tipos de eventos", err)
      },
    })
  }
  seleccionarTipoAleatoriamente() {
    const tipoAleatorio = this.tipoEventos[Math.floor(Math.random() * this.tipoEventos.length)]
    this.obtenerEventosPorCategoria("CHARLA");

  }
  obtenerEventosPorCategoria(tipoAleatorio: string) {
    console.log(tipoAleatorio)
    this.clientService.obtenereventosPorCategorias(tipoAleatorio).subscribe({
        next: (value) => {
            console.log(value)
            this.categoryEvents = this.obtenerEventosAleatorios(value.respuesta);
            console.log(this.categoryEvents)
        },
    })
  }
  obtenerEventosAleatorios(respuesta: EventoObtenidoDTO[]): EventoObtenidoDTO[] {
    const eventosAleatorios = []
    const copiaEventos = [...respuesta]; // Copia para evitar modificar la lista original

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * copiaEventos.length);
      eventosAleatorios.push(copiaEventos.splice(randomIndex, 1)[0]);
      console.log(eventosAleatorios)// Elimina el evento seleccionado
    }

    return eventosAleatorios;
  }

}


