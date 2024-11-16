import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { EnumService } from '../../servicios/get-enums.service';
import { ClientService } from '../../servicios/auth.service';
import { TipoEventoDTO } from '../../dto/tipo-evento-dto';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'eventosPorCategoria',
  templateUrl: './eventos-por-categorias.component.html',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./eventos-por-categorias.component.css'],
  standalone: true
})
export class EventosPorCategoriasComponent implements OnInit {
  tipoEventos: string[] = []
  categoryEvents: EventoObtenidoDTO[] = [];


  constructor(private enumService: EnumService, private clientService: ClientService, private router: Router) {

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
    this.obtenerEventosPorCategoria(tipoAleatorio);

  }
  obtenerEventosPorCategoria(tipoAleatorio: string) {
    console.log(tipoAleatorio)
    this.clientService.obtenereventosPorCategorias(tipoAleatorio).subscribe({
        next: (value) => {
            console.log(value)

            this.categoryEvents = this.obtenerEventosAleatorios(value.respuesta.filter((evento: { estadoEvento: string; }) => evento.estadoEvento === 'ACTIVO'));
            console.log(this.categoryEvents)
        },
    })
  }
  obtenerEventosAleatorios(respuesta: EventoObtenidoDTO[]): EventoObtenidoDTO[] {
    const eventosAleatorios = []
    const copiaEventos = [...respuesta]; // Copia para evitar modificar la lista original

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * copiaEventos.length);
    const evento = copiaEventos.splice(randomIndex, 1)[0];
    if (evento) {
      eventosAleatorios.push(evento); // Agrega solo si el evento es válido
    }
    }

    return eventosAleatorios;
  }

  navegarADetalleEvento(idEvento: string) {

    this.router.navigate(['/eventos-detalle', idEvento]);

  }
}


