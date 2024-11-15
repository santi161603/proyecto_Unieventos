import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoObtenidoDTO } from '../../dto/carrito-obtenido-dto';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ItemCarritoDTO } from '../../dto/item-carrito';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { ClientService } from '../../servicios/auth.service';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { TokenService } from '../../servicios/token.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compra-cliente-desde-carrito',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './compra-cliente-desde-carrito.component.html',
  styleUrl: './compra-cliente-desde-carrito.component.css'
})
export class CompraClienteDesdeCarritoComponent {

  carrito: CarritoObtenidoDTO | undefined;
  usuarioId: string = "";  // Simulamos un usuario logueado
  eventosObtenidos: EventoObtenidoDTO[] = [];
  codigoCupon: string = ""; // Variable para almacenar el código del cupón // Lista para almacenar los eventos obtenidos
  localidadNombres: LocalidadNombreIdDTO[] = []
  cupones: CuponObtenidoDTO[] = []
  totalPrecio = 0;
  cuponIngresado: string = '';

  constructor(private carritoService: CuentaAutenticadaService, private clientServ: ClientService, private tokenService: TokenService, private router:Router, private cuentaAut:CuentaAutenticadaService) { }

  ngOnInit(): void {
    this.obtenerNombresIdLocalidades();
    this.obtenerTodosCupones();
    this.usuarioId = this.tokenService.getIDCuenta();
    this.obtenerCarrito();
  }
  obtenerTodosCupones() {
    this.carritoService.obtenerTodosLosCupones().subscribe({
      next: (value) => {
        this.cupones = value.respuesta
      },
      error: (error) => {
        console.log("Error al intentar obtener todos los cupones", error);
      }
    })
  }
  obtenerNombresIdLocalidades() {
    this.clientServ.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (value) => {
        this.localidadNombres = value.respuesta;
      },
      error: (err) => {
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
          // Paso 1: Obtener los eventos para los items del carrito
          this.obtenerEventosParaCarrito(this.carrito.items).then(() => {
            // Paso 2: Una vez que los eventos estén cargados, validar y aplicar cupones
            this.validarYAplicarCupones();
          }).catch((err) => {
            console.error("Error al obtener los eventos para el carrito:", err);
          });
        }
      },
      error: (err) => console.error('Error al obtener carrito:', err)
    });
  }

  obtenerEventosParaCarrito(items: ItemCarritoDTO[]): Promise<void> {
    // Retornar una promesa que se resolverá cuando todos los eventos hayan sido cargados
    const promises = items.map(item => {
      return new Promise<void>((resolve, reject) => {
        this.clientServ.obtenerEventoPorId(item.eventoId).subscribe({
          next: (data) => {
            if (data.respuesta) {
              this.asignarNombreLocalidadASubEventos(data.respuesta);
              this.eventosObtenidos.push(data.respuesta);
              resolve(); // Resolver la promesa cuando el evento se haya cargado
            } else {
              reject("Evento no encontrado");
            }
          },
          error: (err) => reject(`Error al obtener el evento con ID ${item.eventoId}: ${err}`)
        });
      });
    });

    // Retornar una promesa que se resuelve cuando todos los eventos se hayan cargado
    return Promise.all(promises).then(() => { });
  }

  validarYAplicarCupones() {
    this.carrito?.items.forEach(item => {
      this.cupones.forEach(cupon => {
        if (item.cupon == cupon.nombreCupon) {
          if (cupon.cantidad > 0) {
            if (cupon.userCupon != "N/A" && cupon.ciudad != null && cupon.tipoEvento != null) {
              if (cupon.userCupon == this.usuarioId) {
                const evento = this.getEvento(item.eventoId);
                if (evento) {
                  const subEvento = this.getSubEvento(evento, item.idSubevento);
                  this.localidadNombres.forEach(localidad => {
                    if (localidad.IdLocalidad === subEvento?.localidad) {
                      if (cupon.ciudad == localidad.ciudades) {
                        if (cupon.tipoEvento == evento.tipoEvento) {
                          this.cuponRedimido(item, cupon);
                        } else {
                          this.cuponNoredimido(item)
                        }
                      } else {
                        this.cuponNoredimido(item)
                      }
                    } else {
                      this.cuponNoredimido(item)
                    }
                  });
                }
              } else {
                this.cuponNoredimido(item)
              }
            }
            else if (cupon.userCupon != "N/A" && cupon.ciudad != null) {
              if (cupon.userCupon == this.usuarioId) {
                const evento = this.getEvento(item.eventoId);
                if (evento) {
                  const subEvento = this.getSubEvento(evento, item.idSubevento);
                  this.localidadNombres.forEach(localidad => {
                    if (localidad.IdLocalidad === subEvento?.localidad) {
                      if (cupon.ciudad == localidad.ciudades) {
                        this.cuponRedimido(item, cupon);
                      } else {
                        this.cuponNoredimido(item)
                      }
                    } else {
                      this.cuponNoredimido(item)
                    }
                  });
                }
              } else {
                this.cuponNoredimido(item)
              }
            } else if (cupon.tipoEvento != null && cupon.ciudad != null) {
              const evento = this.getEvento(item.eventoId);
              if (evento) {
                const subEvento = this.getSubEvento(evento, item.idSubevento);
                this.localidadNombres.forEach(localidad => {
                  if (localidad.IdLocalidad === subEvento?.localidad) {
                    if (cupon.ciudad == localidad.ciudades) {
                      if (cupon.tipoEvento == evento.tipoEvento) {
                        this.cuponRedimido(item, cupon);
                      } else {
                        this.cuponNoredimido(item)
                      }
                    } else {
                      this.cuponNoredimido(item)
                    }
                  } else {
                    this.cuponNoredimido(item)
                  }
                });
              }
            }
            else if (cupon.userCupon != "N/A" && cupon.tipoEvento != null) {
              if (cupon.userCupon == this.usuarioId) {
                const evento = this.getEvento(item.eventoId);
                if (evento) {
                  if (cupon.tipoEvento == evento.tipoEvento) {
                    this.cuponRedimido(item, cupon);
                  } else {
                    this.cuponNoredimido(item)
                  }
                }
              } else {
                this.cuponNoredimido(item)
              }
            }
            else if (cupon.userCupon != "N/A") {
              if (cupon.userCupon == this.usuarioId) {
                this.cuponRedimido(item, cupon);
              } else {
                this.cuponNoredimido(item)
              }
            }
            else if (cupon.ciudad != null) {
              const evento = this.getEvento(item.eventoId);
              if (evento) {
                const subEvento = this.getSubEvento(evento, item.idSubevento);
                this.localidadNombres.forEach(localidad => {
                  if (localidad.IdLocalidad === subEvento?.localidad) {
                    if (cupon.ciudad == localidad.ciudades) {
                      this.cuponRedimido(item, cupon);
                    } else {
                      this.cuponNoredimido(item)
                    }
                  } else {
                    this.cuponNoredimido(item)
                  }
                });
              }
            }
            else if (cupon.tipoEvento != null) {
              const evento = this.getEvento(item.eventoId);
              if (cupon.tipoEvento == evento?.tipoEvento) {
                this.cuponRedimido(item, cupon);
              } else {
                this.cuponNoredimido(item)
              }
            }
            else {
              this.cuponRedimido(item, cupon);
            }
          } else {
            this.cuponNoredimido(item)
          }
        }
      });
    });
  }

  cuponNoredimido(item: ItemCarritoDTO) {
    item.cupon = ""
    this.carritoService.actualizarItemCarrito(item, this.usuarioId)
  }

  cuponRedimido(item: ItemCarritoDTO, cupon: CuponObtenidoDTO) {
    item.cuponRedimido = true;
    cupon.cantidad -= 1;
    const evento = this.getEvento(item.eventoId);

    if (evento) {

      const subEvento = this.getSubEvento(evento, item.idSubevento);

      if (subEvento) {
        // Aplicar el descuento al precio de la entrada
        const descuento = cupon.porcentajeDescuento / 100; // Ejemplo: 10% de descuento
        subEvento.precioEntrada = subEvento.precioEntrada * (1 - descuento);
        if (this.carrito) {
          this.carrito.totalPrecio = item.cantidadEntradas * subEvento.precioEntrada;
        }
      }
    }
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

  hacerPagoConMercadoPago() {

    this.cuentaAut.ordenDesdeCarrito(this.tokenService.getIDCuenta()).subscribe({
      next:(value)=> {
          this.cuentaAut.realizarPago(value.respuesta).subscribe({
            next:(value)=> {
              this.cuentaAut.vaciarCarrito(this.tokenService.getIDCuenta())
              window.location.href = value.respuesta.initPoint;
            },
          })
      },
    })

  }
}
