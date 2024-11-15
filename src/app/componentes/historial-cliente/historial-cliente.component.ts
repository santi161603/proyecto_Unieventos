import { Component } from '@angular/core';
import { OrdenInfoDTO } from '../../dto/obtener-ordenes-dto';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { TokenService } from '../../servicios/token.service';
import { ClientService } from '../../servicios/auth.service';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-cliente',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './historial-cliente.component.html',
  styleUrl: './historial-cliente.component.css'
})
export class HistorialClienteComponent {
  ordenes: OrdenInfoDTO[] = [];
  selectedOrdenId: string | null = null;  // Para almacenar la orden seleccionada
  listaEventos: EventoObtenidoDTO[] = []
  listaLocalidades: LocalidadNombreIdDTO[]=[];

  constructor(private clientAut: CuentaAutenticadaService, private tokenSer:TokenService, private clientSer:ClientService, private router:Router) {}

  ngOnInit(): void {
    this.obtenerEventos();
    this.obtenerLocalidades();
    this.obtenerOrdenes();
  }
  obtenerEventos() {
    this.clientSer.obtenerTodosLosEventos().subscribe({
      next:(value)=> {
          this.listaEventos = value.respuesta;
      },
    })
  }
  obtenerLocalidades() {
    this.clientSer.obtenerTodasLasLocalidadesNombreID().subscribe({
      next:(value)=> {
          this.listaLocalidades = value.respuesta;
      },
    })
  }

  asignarNombreLocalidadASubEventos(evento: EventoObtenidoDTO): void {
    evento.subEventos.forEach(subEvento => {
      const localidad = this.listaLocalidades.find(loc => loc.IdLocalidad === subEvento.localidad);
      if (localidad) {
        subEvento.localidadNombre = localidad.nombreLocalidad; // Asigna el nombre de la localidad al subevento
      }
    });
  }

 // Función para obtener el nombre del evento
 getEventName(eventoId: string): string | undefined {
  const evento = this.listaEventos.find(e => e.idEvento === eventoId);
  return evento ? evento.nombre : 'Nombre no disponible';
}

// Función para obtener la imagen del póster del evento
getProductPoster(eventoId: string): string | undefined {
  const evento = this.listaEventos.find(e => e.idEvento === eventoId);
  return evento ? evento.imagenPoster : 'default-poster.png';
}

// Función para obtener la información del subevento
getSubEventInfo(eventoId: string, idSubevento: number): SubEventosObtenidosDto | undefined {
  const evento = this.listaEventos.find(e => e.idEvento === eventoId);
  if (evento) {

    const subEvento = evento.subEventos.find(sub => sub.idSubEvento === idSubevento)
    if(subEvento){
    const fechaEvento = new Date(subEvento?.fechaEvento); // Asegúrate de que subEvento.fechaEvento esté en un formato ISO válido
    const fechaFormateada = fechaEvento.toISOString().split('T')[0]; // Esto convertirá la fecha a 'YYYY-MM-DD'

    subEvento.fechaEvento = fechaFormateada;
    }

    this.asignarNombreLocalidadASubEventos(evento);
    return evento.subEventos.find(sub => sub.idSubEvento === idSubevento);
  }
  return undefined;
}

  obtenerOrdenes(): void {
    this.clientAut.getOrdenesByCliente(this.tokenSer.getIDCuenta()).subscribe({
    next:(value) => {
        this.ordenes = value.respuesta;
        this.ordenes.forEach(orden => {
         const fechaString = orden.pago.fechaPago;

              // Verifica si `fechaString` es una cadena en el formato "YYYY,MM,DD,HH,mm,ss"
        if (typeof fechaString === 'string' && fechaString.includes(',')) {
          // Convierte la fecha en el formato "YYYY,MM,DD,HH,mm,ss" a un string con formato ISO
          const partes = fechaString.split(',').map(part => parseInt(part, 10));
          if (partes.length === 6) {
            const fechaEvento = new Date(partes[0], partes[1] - 1, partes[2], partes[3], partes[4], partes[5]);
            orden.pago.fechaPago = fechaEvento.toISOString(); // Convierte a string en formato ISO
          } else {
            console.error("Formato de fecha no válido:", fechaString);
          }
        } else if (typeof fechaString === 'string' && !isNaN(Date.parse(fechaString))) {
          // Si `fechaString` ya está en un formato de fecha ISO (ej., "YYYY-MM-DDTHH:mm:ss.sssZ"), lo dejamos como está
          orden.pago.fechaPago = new Date(fechaString).toISOString();
        } else {
          console.error("Formato de fecha inesperado:", fechaString);
        }
        });
    },
    });
  }


  // Método para manejar el clic en "Ver más"
  verMas(ordenId: string): void {
    this.selectedOrdenId = ordenId;  // Puedes mostrar la lista de productos de la transacción aquí
  }

  // Método para manejar el clic en "Ver detalle de orden"
  verDetalle(ordenId: string): void {

    sessionStorage.removeItem("idOrden")
    sessionStorage.setItem("idOrden", ordenId)

    console.log(ordenId)

    this.router.navigate(['/detalle-orden'])
  }
}
