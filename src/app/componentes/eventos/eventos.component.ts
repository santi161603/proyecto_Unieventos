import { Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { SearchComponent } from "../search/search.component";
import { FiltrosEventosComponent } from "../filtros-eventos/filtros-eventos.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { ClientService } from '../../servicios/auth.service';
import { TokenService } from '../../servicios/token.service';
import { EnumService } from '../../servicios/get-enums.service';
import Swal from 'sweetalert2';
import { LocalidadObtenidaDTO } from '../../dto/localidad-obtenida-dto';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, RouterModule, FormsModule, BannerComponent],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent {

  Eventos: EventoObtenidoDTO[] = [];
  EventosFiltrados: EventoObtenidoDTO[] = [];
  Localidades: LocalidadObtenidaDTO[] = [];
  cities: string[] = [];
  categories: string[] = [];
  searchQuery: string = ''; // Tipo 'string' para el buscador
  categoria: string = '';
  ciudad: string = '';

  constructor(private route: ActivatedRoute, private clientService: ClientService,  private serviceToken: TokenService,
    private router: Router, private cuentaAut: CuentaAutenticadaService, private enumService: EnumService) {


      this.obtenerCiudades();
      this.obtenerCategorias();
      this.obtenerLocalidades();
      this.obtenerEventos();
  }
  obtenerLocalidades() {
    this.clientService.obtenerTodasLasLocalidades().subscribe({
      next: (value) =>{
        this.Localidades = value.respuesta
      },
      error: (err) => {
        console.log("No se pudo obtener las localidades", err);
      },
    })
  }
  obtenerEventos() {
    this.clientService.obtenerTodosLosEventos().subscribe({
      next:(value)=> {
          this.Eventos = value.respuesta
          this.EventosFiltrados = value.respuesta
      },
      error:(err)=> {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'no pudimos obtener los eventos' + err,
        })
      },
    })
  }

  obtenerCategorias() {
    this.enumService.listarTipoEvento().subscribe({
      next:(value) =>{
        this.categories = value
      },
      error:(err) => {
          console.log("no se pudo obtener las categorias", err)
      },
    })
  }
  obtenerCiudades() {
    this.enumService.listarCiudades().subscribe({
      next:(value) =>{
        this.cities = value
      },
      error:(err) => {
          console.log("no se pudo obtener las categorias", err)
      },
    })
  }

 // Métodos para manejar los cambios de filtros
 onNombreEventoChange(nombre: string) {
  this.searchQuery = nombre; // Cambio a searchQuery
  this.filtrarEventos();
}
navegarADetalleEvento(idEvento: string) {

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

resetFiltros() {
  this.searchQuery = '';  // Resetea el buscador
  this.categoria = '';    // Resetea la categoría
  this.ciudad = '';       // Resetea la ciudad
  this.filtrarEventos();  // Vuelve a filtrar los eventos con los valores por defecto
}

 // Método para filtrar eventos combinando ciudad, categoría y búsqueda por nombre
 filtrarEventos() {
  this.EventosFiltrados = this.Eventos.filter(event => {
    const filtroPorCategoria = this.categoria ? event.tipoEvento === this.categoria : true;
    const filtroPorCiudad = this.ciudad ? this.filtrarPorCiudad(event.subEventos) : true;
    const filtroPorNombre = this.searchQuery ? event.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) : true;

    return filtroPorCategoria && filtroPorCiudad && filtroPorNombre;
  });
}

// Función para verificar si algún subevento tiene la localidad seleccionada
filtrarPorCiudad(subEventos: SubEventosObtenidosDto[]): boolean {
  return subEventos.some(subEvento => {
    return subEvento.localidad && this.Localidades.some(localidad =>
      localidad.idLocalidad === subEvento.localidad && localidad.ciudad === this.ciudad);
  });
}

}
