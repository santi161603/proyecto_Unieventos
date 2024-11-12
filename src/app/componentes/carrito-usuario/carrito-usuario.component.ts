import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { ClientService } from '../../servicios/auth.service';
import { DTOActualizarLocalidad } from '../../dto/actualizar-localidad-dto';
import { CarritoObtenidoDTO } from '../../dto/carrito-obtenido-dto';
import { ItemCarritoDTO } from '../../dto/item-carrito';
import { TokenService } from '../../servicios/token.service';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';

@Component({
  selector: 'app-carrito-usuario',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, FormsModule],
  templateUrl: './carrito-usuario.component.html',
  styleUrl: './carrito-usuario.component.css'
})
export class CarritoUsuarioComponent implements OnInit {


  carrito: CarritoObtenidoDTO | undefined;
  usuarioId: string = "";  // Simulamos un usuario logueado
  eventosObtenidos: EventoObtenidoDTO[] = [];
  codigoCupon: string = ""; // Variable para almacenar el código del cupón // Lista para almacenar los eventos obtenidos
  localidadNombres: LocalidadNombreIdDTO[] = []

  constructor(private carritoService: CuentaAutenticadaService, private clientServ: ClientService, private tokenService: TokenService) {}

  ngOnInit(): void {
    this.obtenerNombresIdLocalidades();
    this.usuarioId = this.tokenService.getIDCuenta();
    this.obtenerCarrito();
  }
  obtenerNombresIdLocalidades() {
    this.clientServ.obtenerTodasLasLocalidadesNombreID().subscribe({
      next:(value) => {
          this.localidadNombres =  value.respuesta;
      },
      error:(err)=> {
          console.log("error al obtener los nombres localidades", err)
      },
    })
  }

  getEvento(eventoId: string): EventoObtenidoDTO | undefined {
    return this.eventosObtenidos.find(evento => evento.idEvento === eventoId);
  }

  obtenerCarrito(): void {
    this.carritoService.obtenerelCarritoUsuario(this.usuarioId).subscribe({
      next: (carritoData) => {
        this.carrito = carritoData.respuesta;
        if (this.carrito?.items) {
          // Llamar al método para obtener los eventos para cada item del carrito
          this.obtenerEventosParaCarrito(this.carrito.items);
        }
      },
      error: (err) => console.error('Error al obtener carrito:', err)
    });
  }

  eliminarItem(item: ItemCarritoDTO): void {
    this.carritoService.eliminarItemsAlCarritro(item, this.usuarioId).subscribe({
      next:(value) => {
        window.location.reload();
      },
      error:(err)=> {
          console.log("No se pudo eliminar el item carrito", err)
      },
    })
  }


   // Método para obtener los eventos asociados a cada item del carrito
   obtenerEventosParaCarrito(items: ItemCarritoDTO[]): void {
    this.eventosObtenidos = []; // Inicializar la lista antes de agregar eventos

    items.forEach(item => {
      this.obtenerEventoPorId(item.eventoId);
    });
  }

  // Método para obtener un evento por su ID
  obtenerEventoPorId(eventoId: string): void {
    this.clientServ.obtenerEventoPorId(eventoId).subscribe({
      next: (data) => {
        if (data.respuesta) {
          this.asignarNombreLocalidadASubEventos(data.respuesta);
          console.log(data.respuesta)
          this.eventosObtenidos.push(data.respuesta); // Agregar el evento a la lista
        }
      },
      error: (err) => console.error(`Error al obtener el evento con ID ${eventoId}:`, err)
    });
  }

  asignarNombreLocalidadASubEventos(evento: EventoObtenidoDTO): void {
    evento.subEventos.forEach(subEvento => {
      const localidad = this.localidadNombres.find(loc => loc.IdLocalidad === subEvento.localidad);
      if (localidad) {
        subEvento.localidadNombre = localidad.nombreLocalidad; // Asigna el nombre de la localidad al subevento
      }
    });
  }

  getSubEvento(evento: EventoObtenidoDTO, idSubevento: number): SubEventosObtenidosDto | undefined {
    return evento.subEventos.find(subEvento => subEvento.idSubEvento === idSubevento);
  }

  redimirCupon(item: ItemCarritoDTO): void {
    if (item.codigoCupon.trim()) {
      console.log("Cupón redimido para el item:", item, "Cupón:", item.codigoCupon);
      // Aquí puedes agregar la lógica para aplicar el cupón específico del item
    } else {
      console.warn("Por favor, ingrese un código de cupón válido para este item.");
    }
  }

  aumentarCantidad(item: ItemCarritoDTO,cantidad: number) {
    this.carritoService.aumentarCanridad(this.usuarioId,item).subscribe({
      next: (value)=>{
        item.cantidadEntradas = cantidad
        console.log("cantidad aumentada", value)

        window.location.reload();
      },
      error:(err)=> {
          console.log("cantidad no aumentada", err)
      },

    })
  }

  reducirCantidad(item: ItemCarritoDTO,cantidad: number) {
    this.carritoService.reducirCantidad(this.usuarioId,item).subscribe({
      next:(value) => {

          console.log("cantidad reducida", value)
          item.cantidadEntradas = cantidad

        window.location.reload();
      },
      error:(err)=> {
   console.log("error al intentar reducir cantidad", err)
      },
    })
  }
comprar() {
}
vaciarCarrito() {
}


}
