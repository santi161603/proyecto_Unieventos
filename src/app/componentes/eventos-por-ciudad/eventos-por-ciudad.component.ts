import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterModule } from '@angular/router';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { EnumService } from '../../servicios/get-enums.service';
import { ClientService } from '../../servicios/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'eventosPorCiudad',
  templateUrl: './eventos-por-ciudad.component.html',
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
  styleUrls: ['./eventos-por-ciudad.component.css'],
  standalone: true
})
export class EventosPorCiudadComponent implements OnInit {

  ciudades: string[] = ["BOGOTA","ARMENIA","BUENAVISTA","FILANDIA","SALENTO","CALI","BUGA","PEREIRA"]
  citysEvents: EventoObtenidoDTO[] = [];


  constructor(private enumService: EnumService, private clientService: ClientService, private router: Router) {

  }
  ngOnInit(): void {
  //this.getTipoEventos()
  console.log("estoy en ciudades")
 this.seleccionarTipoAleatoriamente();
  }

  getTipoEventos() {
   /* this.enumService.listarTipoEvento().subscribe({
      next:(value) => {
          this.ciudades = value
          console.log(this.ciudades)
          this.seleccionarTipoAleatoriamente();
      },
      error:(err) => {
          console.log("No pudimos recuperar la lista de tipos de eventos", err)
      },
    })*/
  }
  seleccionarTipoAleatoriamente() {
    const ciudadAleatorio = this.ciudades[Math.floor(Math.random() * this.ciudades.length)]
    console.log("estoy en selecion de cidad aleatoria " + ciudadAleatorio)
    this.obtenerEventosPorCiudad(ciudadAleatorio);

  }
  obtenerEventosPorCiudad(ciudadAleatorio: string) {
    console.log(ciudadAleatorio)
    this.clientService.obtenereventosPorCiudad(ciudadAleatorio).subscribe({
        next: (value) => {
            console.log(value)
            this.citysEvents = this.obtenerEventosAleatorios(value.respuesta.filter((evento: { estadoEvento: string; }) => evento.estadoEvento === 'ACTIVO'));
            console.log(this.citysEvents)
        },
        error: (error) =>{
          console.log("error al obtener los eventos por ciudad", error)
        }
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

    sessionStorage.removeItem('idEvento')

    sessionStorage.setItem('idEvento', idEvento);

    this.router.navigate(['/eventos-detalle']);

  }

}

