import { Component } from '@angular/core';
import { OrdenInfoDTO } from '../../dto/obtener-ordenes-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../servicios/auth.service';
import { ItemCarritoDTO } from '../../dto/item-carrito';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { LocalidadObtenidaDTO } from '../../dto/localidad-obtenida-dto';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import Swal from 'sweetalert2';
import { MensajeDTO } from '../../dto/mensaje-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-orden-historial',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './detalle-orden-historial.component.html',
  styleUrl: './detalle-orden-historial.component.css'
})
export class DetalleOrdenHistorialComponent {


  ordenInfo: OrdenInfoDTO = {
    idOrden: '',
    transaccion: {
      productos: [],
      idCliente: ''
    },
    pago: {
      metodoPago: '',
      estadoPago: '',
      fechaPago: '',
      detalleEstadoPago: '',
      tipoPago: '',
      moneda: ''
    },
    montoTotal: 0,
    montoTotalSinDescuento: 0,
  };
  eventosMap: EventoObtenidoDTO[] = [];
  localidades: LocalidadNombreIdDTO[] = [];
  idOrden: string | null = "";

  constructor(private cuentaAtu: CuentaAutenticadaService, private clientServ: ClientService, private route:ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe((param) =>{
    this.idOrden = param['ordenId']


    if (this.idOrden) {
      this.obtenerLocalidades()
      this.obtenerOrdenesPorID(this.idOrden)
    }
   })
  }
  obtenerLocalidades() {
    this.clientServ.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (value) => {
        this.localidades = value.respuesta
      },
    })
  }
  obtenerOrdenesPorID(idOrden: string) {
    this.cuentaAtu.obtenerOrdenPorId(idOrden).subscribe({
      next: (value) => {
        this.ordenInfo = value.respuesta;
        this.ordenInfo.transaccion.productos.forEach(item => {
          this.obtenerEvento();
        })
      },
    })
  }


  obtenerEvento() {
    // Obtener el evento solo si no ha sido cargado antes
    this.clientServ.obtenerTodosLosEventos().subscribe({
      next: (value) => {
        this.eventosMap = value.respuesta;
      },
    });

  }

  reintentarPago(): void {

    if(this.idOrden){
    this.cuentaAtu.realizarPago(this.idOrden).subscribe({
      next:(value) =>{
        window.location.href = value.respuesta.initPoint;
      },
      error:(err)=> {
          Swal.fire(
            "Error",
            "lo sentipos pero: " + err.error.respuesta,
            "error"
          )
      },
    })
  }
  }

  getSubEventInfo(eventoId: string, idSubevento: number): SubEventosObtenidosDto | undefined {
    const evento = this.eventosMap.find(e => e.idEvento === eventoId);
    if (evento) {

      const subEvento = evento.subEventos.find(sub => sub.idSubEvento === idSubevento)
      if (subEvento) {
        const fechaEvento = new Date(subEvento?.fechaEvento); // Asegúrate de que subEvento.fechaEvento esté en un formato ISO válido
        const fechaFormateada = fechaEvento.toISOString().split('T')[0]; // Esto convertirá la fecha a 'YYYY-MM-DD'

        subEvento.fechaEvento = fechaFormateada;
      }
      return evento.subEventos.find(sub => sub.idSubEvento === idSubevento);
    }
    return undefined;
  }

  obtenerLocalidadNombre(idLocalidad: string): string {
    console.log(idLocalidad)
    const localidad = this.localidades.find(loc => loc.IdLocalidad === idLocalidad);
    console.log(localidad)
    if (localidad) {
      return localidad.nombreLocalidad
    }
    return "No se encontro la localidad"
  }
  getEvento(idEvento: string): EventoObtenidoDTO | undefined {
    const evento = this.eventosMap.find(e => e.idEvento === idEvento);
    if (evento) {

      return evento
    }
    return undefined
  }

  cancelarOrden() {

  }
  // Método para verificar si se debe mostrar el botón de reintentar pago
  mostrarReintentarPago(): boolean {
    if (this.ordenInfo) {
      return this.ordenInfo.pago.estadoPago != "approved";
    }
    return false;
  }
}
