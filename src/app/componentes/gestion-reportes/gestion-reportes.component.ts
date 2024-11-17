import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { OrdenInfoDTO } from '../../dto/obtener-ordenes-dto';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { AdministradorService } from '../../servicios/administrador.service';
import { ClientService } from '../../servicios/auth.service';
import { th } from 'date-fns/locale';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';

@Component({
  selector: 'app-gestion-reportes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gestion-reportes.component.html',
  styleUrl: './gestion-reportes.component.css'
})
export class GestionReportesComponent {

  todasOrdenes: OrdenInfoDTO[] = [];
  eventos: EventoObtenidoDTO[] = [];
  cupones: CuponObtenidoDTO[] = [];
  localidades: LocalidadNombreIdDTO[] = [];

  totalOrdenes: number = 0;
  porcentajeAprobadas: number = 0;
  porcentajePendientes: number = 0;
  porcentajeOtras: number = 0;
  totalBeneficiosgenerales: number = 0;

  ventasPorSubevento: { [key: string]: { cantidadVendida: number; porcentajeVendido: number; cantidadVendido: number } } = {};
  ventasPorEvento: { [key: string]: { cantidadVendida: number; beneficiosPorEvento: number } } = {};

  constructor(private adminServ: AdministradorService, private clientSer: ClientService, private cuentaAut: CuentaAutenticadaService) {

    this.obtenerTodasOrdenes();

  }
  obtenerTodasOrdenes() {
    this.adminServ.obtenerTodasLasOrdenes().subscribe({
      next: (value) => {
        this.todasOrdenes = value.respuesta
        this.obtenerListaEvento();
      },
    })
  }
  obtenerListaEvento() {
    this.clientSer.obtenerTodosLosEventos().subscribe({
      next: (value) => {
        this.eventos = value.respuesta
        this.obtenerCupones();

      },
    })
  }
  obtenerCupones() {
    this.cuentaAut.obtenerTodosLosCupones().subscribe({
      next: (value) => {
        this.cupones = value.respuesta
        this.obtenerLocalidades()
      },
    })
  }

  obtenerLocalidades() {
    this.clientSer.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (value) => {
        this.localidades = value.respuesta
        this.asignarNombresLocalidades();
        this.calcularTotalesYPorcentajes();
        this.calcularVentasPorSubevento();
      },
    })
  }

  private asignarNombresLocalidades() {
    console.log("estoy dentro de asignar nombres");
    if (this.eventos && this.localidades.length) {
      // Imprimir las localidades y los subeventos para depuración
      console.log('Localidades:', this.localidades);

      this.eventos?.forEach(evento => {
        evento.subEventos.forEach(subevento => {
          // Asegurarse de que los tipos sean iguales para evitar problemas de comparación
          const localidad = this.localidades.find(loc => loc.IdLocalidad === subevento.localidad);

          // Verificar si la localidad fue encontrada y asignarla
          if (localidad) {
            subevento.localidadNombre = localidad.nombreLocalidad;
          } else {
            console.warn('No se encontró la localidad para el subevento:', subevento);
          }
        });
      });
    } else {
      console.log("Error: Evento o localidades no cargados correctamente");
    }
  }

  calcularTotalesYPorcentajes(): void {
    this.totalOrdenes = this.todasOrdenes.length;

    const aprobadas = this.todasOrdenes.filter(
      (orden) => orden.pago.estadoPago === 'approved'
    ).length;

    const pendientes = this.todasOrdenes.filter(
      (orden) => orden.pago.estadoPago === 'PENDIENTE'
    ).length;

    const otras = this.totalOrdenes - aprobadas - pendientes;

    this.porcentajeAprobadas = this.calcularPorcentaje(aprobadas);
    this.porcentajePendientes = this.calcularPorcentaje(pendientes);
    this.porcentajeOtras = this.calcularPorcentaje(otras);
  }

  calcularPorcentaje(cantidad: number): number {
    return this.totalOrdenes > 0
      ? Math.round((cantidad / this.totalOrdenes) * 100)
      : 0;
  }

  calcularVentasPorSubevento(): void {
    this.eventos.forEach((evento) => {
      let totalEntradasVentdidasDelEvento = 0;
      let beneficiosTotalEvento = 0;

      evento.subEventos.forEach((subEvento) => {
        let totalEntradasVendidas = 0;
        let totalVentaPrecio = 0;

        // Combina idEvento e idSubEvento para crear una clave única
        const claveSubEvento = `${evento.idEvento}_${subEvento.idSubEvento}`;

        this.todasOrdenes.forEach((orden) => {
          if (orden.pago.estadoPago == 'approved') {
            const items = orden.transaccion.productos.filter(
              (item) => item.eventoId === evento.idEvento && item.idSubevento === subEvento.idSubEvento
            );
            items.forEach((item) => {
              totalEntradasVendidas += item.cantidadEntradas;
              let precioEntrada = subEvento.precioEntrada;
              if (item.cupon != "") {
                if (item.cupon == "BIENVENIDO") {
                  precioEntrada = subEvento.precioEntrada - (subEvento.precioEntrada * 0.15);
                } else if (item.cupon == "PRIMERACOMPRA") {
                  precioEntrada = subEvento.precioEntrada - (subEvento.precioEntrada * 0.10);
                } else {
                  const cuponObtenido = this.cupones.find(cupon => item.cupon == cupon.nombreCupon);
                  if (cuponObtenido) {
                    precioEntrada = subEvento.precioEntrada - (subEvento.precioEntrada * (cuponObtenido?.porcentajeDescuento / 100));
                  }
                }
              }
              totalVentaPrecio += precioEntrada * item.cantidadEntradas;
              beneficiosTotalEvento += precioEntrada * item.cantidadEntradas;
            });
          }
        });

        totalEntradasVentdidasDelEvento += totalEntradasVendidas;

        const porcentajeVendido = Math.round(((totalEntradasVendidas / (totalEntradasVendidas + subEvento.cantidadEntradas)) * 100));

        this.ventasPorSubevento[claveSubEvento] = {
          cantidadVendida: totalEntradasVendidas,
          porcentajeVendido: isNaN(porcentajeVendido) ? 0 : porcentajeVendido,
          cantidadVendido: totalVentaPrecio
        };
      });

      this.ventasPorEvento[evento.idEvento] = {
        cantidadVendida: totalEntradasVentdidasDelEvento,
        beneficiosPorEvento: beneficiosTotalEvento
      };

      this.totalBeneficiosgenerales += beneficiosTotalEvento;

    });
  }


  generarPdf(): void {
    const doc = new jsPDF();
    let yPosition = 10; // Posición inicial en Y para el contenido

    // Primera página: Reporte con fecha actual y UNIEVENTOS
    doc.setFontSize(16);
    doc.text('REPORTE DE UNIEVENTOS', 105, yPosition, { align: 'center' });
    yPosition += 20;
    const fechaActual = new Date().toLocaleDateString(); // Fecha actual
    doc.text(`Fecha: ${fechaActual}`, 105, yPosition, { align: 'center' });
    yPosition += 30;

    // Segunda página: Total, Aprobadas, Pendientes, Otras y Beneficios Generales
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Resumen General', 105, yPosition, { align: 'center' });
    yPosition += 20;

    // Centramos el texto
    doc.setFontSize(12);
    doc.text(`Total Ordenes: ${this.totalOrdenes}`, 105, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text(`Aprobadas: ${this.porcentajeAprobadas}%`, 105, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text(`Pendientes: ${this.porcentajePendientes}%`, 105, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text(`Otras: ${this.porcentajeOtras}%`, 105, yPosition, { align: 'center' });
    yPosition += 10;
    doc.text(`Beneficios Generales: ${this.totalBeneficiosgenerales}`, 105, yPosition, { align: 'center' });
    yPosition += 20;

    // Agregar subeventos en el resto de las páginas

    this.eventos.forEach((evento) => {
      doc.text(`Evento: ${evento.nombre}`, 10, yPosition);
      yPosition += 10;
      evento.subEventos.forEach((subEvento) => {
        doc.text(`Subevento: ${subEvento.localidadNombre} - ${subEvento.fechaEvento}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Entradas disponibles: ${subEvento.cantidadEntradas}`, 10, yPosition);
        yPosition += 10;
        const cantidadVendida = this.ventasPorSubevento[`${evento.idEvento}_${subEvento.idSubEvento}`]?.cantidadVendida || 0;
        const porcentajeVendido = this.ventasPorSubevento[`${evento.idEvento}_${subEvento.idSubEvento}`]?.porcentajeVendido || 0;
        doc.text(`Entradas vendidas: ${cantidadVendida}`, 10, yPosition);
        yPosition += 10;
        doc.text(`Porcentaje vendido: ${porcentajeVendido}%`, 10, yPosition);
        yPosition += 10;

        // Verificar si el contenido se excede y agregar página si es necesario
        if (yPosition > 270) { // Límite de página en Y
          doc.addPage();
          yPosition = 10; // Reiniciar la posición Y en la nueva página
        }
      });
    });

    // Agregar cualquier otro dato necesario (como ventas por evento)
    Object.keys(this.ventasPorEvento).forEach((eventoId) => {
      const beneficios = this.ventasPorEvento[eventoId].beneficiosPorEvento;
      doc.text(`Beneficios del evento ${eventoId}: ${beneficios}`, 10, yPosition);
      yPosition += 10;
    });

    // Generar el PDF
    doc.save('reporte.pdf');
  }

}
