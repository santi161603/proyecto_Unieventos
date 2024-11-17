import { Component, OnInit } from '@angular/core';
import { ItemCarritoDTO } from '../../dto/item-carrito';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ClientService } from '../../servicios/auth.service';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { TransaccionDto } from '../../dto/transaccion-dto';
import { TokenService } from '../../servicios/token.service';
import { PagoDTO } from '../../dto/pago-dto-pago';
import { DTOCrearOrden } from '../../dto/dto-crear-orden';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';

@Component({
  selector: 'app-compra-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './compra-cliente.component.html',
  styleUrl: './compra-cliente.component.css'
})
export class CompraClienteComponent implements OnInit {
  itemCarrito: ItemCarritoDTO = {
    eventoId: "N/A",
    idSubevento: 1,
    cantidadEntradas: 0,
  };
  eventoCompra: EventoObtenidoDTO | undefined;
  subEventoCompra: SubEventosObtenidosDto | undefined;
  localidadNombreId: LocalidadNombreIdDTO[] = [];
  cuponesObtenidos: CuponObtenidoDTO[] = [];
  codigoCupon: string = '';
  totalCompra: number = 0;
  usuarioId: string = "";

  constructor(private clientService: ClientService, private tokenServ: TokenService, private cuentaAut: CuentaAutenticadaService) {

  }

  ngOnInit(): void {
    // Cargar el itemCarrito desde sessionStorage
    const itemCompra = sessionStorage.getItem('itemCompra');
    this.usuarioId = this.tokenServ.getIDCuenta();
    if (itemCompra) {
      this.itemCarrito = JSON.parse(itemCompra);
      if (this.itemCarrito) {
        this.obtenerEvento(this.itemCarrito.eventoId)
        this.obtenerCupones();
      }
    } else {
      console.error('No hay datos de compra en sessionStorage');
    }
  }
  obtenerCupones() {
    this.cuentaAut.obtenerTodosLosCupones().subscribe({
      next: (value) => {
        this.cuponesObtenidos = value.respuesta
      },
    })
  }

  obtenerEvento(eventoId: string) {
    this.clientService.obtenerEventoPorId(eventoId).subscribe({
      next: (value) => {
        this.eventoCompra = value.respuesta;
        // Encontrar el subevento que coincide con el idSubevento en itemCarrito
        this.subEventoCompra = this.eventoCompra?.subEventos.find(
          (subEvento) => subEvento.idSubEvento === this.itemCarrito?.idSubevento
        );
        this.ObtenerLocalidad();
        this.calcularTotal();
      },
      error: (err) => {
        console.log("Error al obtener el evento")
      },
    })
  }
  ObtenerLocalidad() {
    this.clientService.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (value) => {
        this.localidadNombreId = value.respuesta;
        // Asignar el nombre de la localidad al subevento correspondiente
        if (this.subEventoCompra && this.localidadNombreId) {
          const localidad = this.localidadNombreId.find(
            (loc) => loc.IdLocalidad === this.subEventoCompra?.localidad
          );
          if (localidad) {
            this.subEventoCompra.localidadNombre = localidad.nombreLocalidad;
          }
        }
      },
      error: (err) => {
        console.log('Error al obtener las localidades');
      },
    });
  }
  // Método para calcular el total de la compra
  calcularTotal(): void {
    if (this.itemCarrito && this.subEventoCompra) {
      this.totalCompra = this.itemCarrito.cantidadEntradas * this.subEventoCompra.precioEntrada;
    }
  }

  redimirCupon(item: ItemCarritoDTO): void {
    this.cuponesObtenidos.forEach(cupon => {

      if(cupon.estadoCupon == "ACTIVO"){
      if(item.textIngresado == "BIENVENIDO" ||item.textIngresado == "PRIMERACOMPRA" ){
        if (item.textIngresado == "BIENVENIDO") {
          if (cupon.userCupon == this.usuarioId) {
            if(cupon.cantidad > 0){
            this.redimiredimirCupon(item, cupon);
            }else {
              Swal.fire("No encontramos el cupon", "el cupon que intentar redimir tal vez esta mal escrito, no existe o a agotado existencia", "info")
            }
          } else {
            console.log("el usuario no tiene este cupon");
          }
        } else{
          if (cupon.userCupon == this.usuarioId) {
            if(cupon.cantidad > 0){
            this.redimiredimirCupon(item, cupon);
            }else {
              Swal.fire("No encontramos el cupon", "el cupon que intentar redimir tal vez esta mal escrito, no existe o a agotado existencia", "info")
            }
          } else {
            console.log("el usuario no tiene este cupon");
          }
        }
      }else{

      if (item.textIngresado == cupon.nombreCupon) {
        if (cupon.cantidad > 0) {
          if (cupon.userCupon != "N/A" && cupon.ciudad != null && cupon.tipoEvento != null) {
            if (cupon.userCupon == this.usuarioId) {

              if (this.eventoCompra) {

                this.localidadNombreId.forEach(localidad => {
                  if (localidad.IdLocalidad === this.subEventoCompra?.localidad) {
                    if (cupon.ciudad == localidad.ciudades) {
                      if (cupon.tipoEvento == this.eventoCompra?.tipoEvento) {
                        this.redimiredimirCupon(item, cupon);
                      } else {
                        Swal.fire("Cupon solo apto para el tipo evento: " + cupon.tipoEvento, "el cupon solo es apto para el tipo de evento mensionado", "info")
                      }
                    } else {
                      Swal.fire("Cupon solo apto para la ciudad de:" + cupon.ciudad, "el cupon solo es apto para la ciuda indicada", "info")
                    }
                  } else {
                    console.log("localidad no encontrada")
                  }
                });
              }
            } else {
              console.log("el usuario no tiene este cupon");
            }
          }
          else if (cupon.userCupon != "N/A" && cupon.ciudad != null) {
            if (cupon.userCupon == this.usuarioId) {
              if (this.eventoCompra) {
                this.localidadNombreId.forEach(localidad => {
                  if (localidad.IdLocalidad === this.subEventoCompra?.localidad) {
                    if (cupon.ciudad == localidad.ciudades) {
                      this.redimiredimirCupon(item, cupon);
                    } else {
                      Swal.fire("Cupon solo apto para la ciudad de:" + cupon.ciudad, "el cupon solo es apto para la ciuda indicada", "info")
                    }
                  } else {
                    console.log("localidad no encontrada")
                  }
                });
              }
            } else {
              console.log("Usuario no tiene este cupon")
            }
          } else if (cupon.tipoEvento != null && cupon.ciudad != null) {
            if (this.eventoCompra) {
              this.localidadNombreId.forEach(localidad => {
                if (localidad.IdLocalidad === this.subEventoCompra?.localidad) {
                  if (cupon.ciudad == localidad.ciudades) {
                    if (cupon.tipoEvento == this.eventoCompra?.tipoEvento) {
                      this.redimiredimirCupon(item, cupon);
                    } else {
                      Swal.fire("Cupon solo apto para el tipo evento: " + cupon.tipoEvento, "el cupon solo es apto para el tipo de evento mensionado", "info")
                    }
                  } else {
                    Swal.fire("Cupon solo apto para la ciudad de:" + cupon.ciudad, "el cupon solo es apto para la ciuda indicada", "info")
                  }
                } else {
                  console.log("localidad no encontrada")
                }
              });
            }
          }
          else if (cupon.userCupon != "N/A" && cupon.tipoEvento != null) {
            if (cupon.userCupon == this.usuarioId) {
              if (this.eventoCompra) {
                if (cupon.tipoEvento == this.eventoCompra.tipoEvento) {
                  this.redimiredimirCupon(item, cupon);
                } else {
                  Swal.fire("Cupon solo apto para el tipo evento: " + cupon.tipoEvento, "el cupon solo es apto para el tipo de evento mensionado", "info")
                }
              }
            } else {
              console.log("el usuario no tiene este cupon");
            }
          }
          else if (cupon.userCupon != "N/A") {
            if (cupon.userCupon == this.usuarioId) {
              this.redimiredimirCupon(item, cupon);
            } else {
              console.log("el usuario no tiene este cupon");
            }
          }
          else if (cupon.ciudad != null) {
            this.localidadNombreId.forEach(localidad => {
              if (localidad.IdLocalidad === this.subEventoCompra?.localidad) {
                if (cupon.ciudad == localidad.ciudades) {
                  this.redimiredimirCupon(item, cupon);
                } else {
                  Swal.fire("Cupon solo apto para la ciudad de:" + cupon.ciudad, "el cupon solo es apto para la ciuda indicada", "info")
                }
              } else {
                console.log("localidad no encontrada")
              }
            });
          }
          else if (cupon.tipoEvento != null) {
            if (cupon.tipoEvento == this.eventoCompra?.tipoEvento) {
              this.redimiredimirCupon(item, cupon);
            } else {
              Swal.fire("Cupon solo apto para el tipo evento: " + cupon.tipoEvento, "el cupon solo es apto para el tipo de evento mensionado", "info")
            }
          }
          else {
            this.redimiredimirCupon(item, cupon);
          }
        } else {
          Swal.fire("No encontramos el cupon", "el cupon que intentar redimir tal vez esta mal escrito, no existe o a agotado existencia", "info")
        }
      }
    }
  }
    });

  }

  redimiredimirCupon(item: ItemCarritoDTO, cupon: CuponObtenidoDTO
  ) {
    item.cuponRedimido = true;
    cupon.cantidad -= 1;


    if (this.subEventoCompra) {
      // Aplicar el descuento al precio de la entrada
      const descuento = cupon.porcentajeDescuento / 100; // Ejemplo: 10% de descuento
      this.subEventoCompra.precioEntrada = this.subEventoCompra.precioEntrada * (1 - descuento);

      this.totalCompra = this.subEventoCompra.precioEntrada * item.cantidadEntradas ;

      this.codigoCupon = cupon.nombreCupon;
    }

    console.log(this.codigoCupon);
  }

  // Método para crear la orden
  crearOrden(): void {
    if (this.itemCarrito) {

      const itemCarritoDTO: ItemCarritoDTO[] = [{
        eventoId: this.itemCarrito.eventoId,
        idSubevento: this.itemCarrito.idSubevento,
        cantidadEntradas: this.itemCarrito.cantidadEntradas,
        cupon: this.codigoCupon
      }]

      const transaccionDto: TransaccionDto = {
        productos: itemCarritoDTO,
        idCliente: this.tokenServ.getIDCuenta()
      }

      const pagoDTO: PagoDTO = {
        metodoPago: "MercadoPago"
      }

      const crearOrden: DTOCrearOrden = {
        transaccion: transaccionDto,
        pago: pagoDTO
      }


      this.cuentaAut.crearOrden(crearOrden).subscribe({
        next: (value) => {
          const idOrden = value.respuesta;

          this.cuentaAut.realizarPago(idOrden).subscribe({
            next(value) {
              window.location.href = value.respuesta.initPoint;
            },
          })
        },
      })


    } else {
      Swal.fire('Error', 'No se pudo crear la orden', 'error');
    }
  }

}
