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
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import Swal from 'sweetalert2';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-carrito-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './carrito-usuario.component.html',
  styleUrl: './carrito-usuario.component.css'
})
export class CarritoUsuarioComponent implements OnInit {

  carrito: CarritoObtenidoDTO | undefined;
  usuarioId: string = "";  // Simulamos un usuario logueado
  eventosObtenidos: EventoObtenidoDTO[] = [];
  codigoCupon: string = ""; // Variable para almacenar el código del cupón // Lista para almacenar los eventos obtenidos
  localidadNombres: LocalidadNombreIdDTO[] = []
  cupones: CuponObtenidoDTO[] = []
  totalPrecio = 0;
  cuponIngresado: string = '';

  constructor(private carritoService: CuentaAutenticadaService, private clientServ: ClientService, private tokenService: TokenService, private router: Router) { }

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
             const evento:EventoObtenidoDTO = data.respuesta;
            if (data.respuesta) {
              this.asignarNombreLocalidadASubEventos(data.respuesta);
              if(evento){
                if(evento.estadoEvento == "ACTIVO"){
                const subEvento =  evento.subEventos.find(subevento => item.idSubevento == subevento.idSubEvento)
                if(subEvento){
                  if(subEvento.estadoSubEvento == "ACTIVO"){
              this.eventosObtenidos.push(data.respuesta);
              resolve(); // Resolver la promesa cuando el evento se haya cargado
                }else{
                  this.eliminarItem(item);
                }
                }
              }else{
                this.eliminarItem(item);
              }
            } else {
              reject("Evento no encontrado");
            }
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

        if(cupon.estadoCupon == "ACTIVO"){
        if (item.textIngresado == "BIENVENIDO" || item.textIngresado == "PRIMERACOMPRA") {
          if (item.textIngresado == "BIENVENIDO") {
            if (cupon.userCupon == this.usuarioId) {
              if (cupon.cantidad > 0) {
                this.cuponRedimido(item, cupon);
              } else {
                this.cuponNoredimido(item)
              }
            } else {
              this.cuponNoredimido(item)
            }
          } else {
            if (cupon.userCupon == this.usuarioId) {
              if (cupon.cantidad > 0) {
                this.cuponRedimido(item, cupon);
              } else {
                this.cuponNoredimido(item)
              }
            } else {
              this.cuponNoredimido(item)
            }
          }
        } else {
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
        }
      }else{
        this.cuponNoredimido(item);
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
        if (this.carrito) {

          console.log(this.carrito.totalPrecio)

          this.carrito.totalPrecio = this.carrito.totalPrecio - (item.cantidadEntradas * subEvento.precioEntrada);
          // Aplicar el descuento al precio de la entrada

          console.log(this.carrito.totalPrecio)
          const descuento = cupon.porcentajeDescuento / 100; // Ejemplo: 10% de descuento
          subEvento.precioEntrada = subEvento.precioEntrada * (1 - descuento);

          this.carrito.totalPrecio = this.carrito.totalPrecio + item.cantidadEntradas * subEvento.precioEntrada;

          console.log(this.carrito.totalPrecio)
        }
      }
    }
  }


  eliminarItem(item: ItemCarritoDTO): void {
    this.carritoService.eliminarItemsAlCarritro(item, this.usuarioId).subscribe({
      next: (value) => {
        window.location.reload();
      },
      error: (err) => {
        console.log("No se pudo eliminar el item carrito", err)
      },
    })
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
    this.cupones.forEach(cupon => {

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
              const evento = this.getEvento(item.eventoId);
              if (evento) {
                const subEvento = this.getSubEvento(evento, item.idSubevento);
                this.localidadNombres.forEach(localidad => {
                  if (localidad.IdLocalidad === subEvento?.localidad) {
                    if (cupon.ciudad == localidad.ciudades) {
                      if (cupon.tipoEvento == evento.tipoEvento) {
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
              const evento = this.getEvento(item.eventoId);
              if (evento) {
                const subEvento = this.getSubEvento(evento, item.idSubevento);
                this.localidadNombres.forEach(localidad => {
                  if (localidad.IdLocalidad === subEvento?.localidad) {
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
            const evento = this.getEvento(item.eventoId);
            if (evento) {
              const subEvento = this.getSubEvento(evento, item.idSubevento);
              this.localidadNombres.forEach(localidad => {
                if (localidad.IdLocalidad === subEvento?.localidad) {
                  if (cupon.ciudad == localidad.ciudades) {
                    if (cupon.tipoEvento == evento.tipoEvento) {
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
              const evento = this.getEvento(item.eventoId);
              if (evento) {
                if (cupon.tipoEvento == evento.tipoEvento) {
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
            const evento = this.getEvento(item.eventoId);
            if (evento) {
              const subEvento = this.getSubEvento(evento, item.idSubevento);
              this.localidadNombres.forEach(localidad => {
                if (localidad.IdLocalidad === subEvento?.localidad) {
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
          }
          else if (cupon.tipoEvento != null) {
            const evento = this.getEvento(item.eventoId);
            if (cupon.tipoEvento == evento?.tipoEvento) {
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
    console.log("estoy aqui")
    item.cuponRedimido = true;
    item.cupon = cupon.nombreCupon;
    this.carritoService.actualizarItemCarrito(item, this.usuarioId).subscribe({
      next: () => {

        cupon.cantidad -= 1;
        const evento = this.getEvento(item.eventoId);

        if (evento) {

          const subEvento = this.getSubEvento(evento, item.idSubevento);

          if (subEvento) {
            if (this.carrito) {

              console.log(this.carrito.totalPrecio)

              this.carrito.totalPrecio = this.carrito.totalPrecio - (item.cantidadEntradas * subEvento.precioEntrada);
              // Aplicar el descuento al precio de la entrada

              console.log(this.carrito.totalPrecio)
              const descuento = cupon.porcentajeDescuento / 100; // Ejemplo: 10% de descuento
              subEvento.precioEntrada = subEvento.precioEntrada * (1 - descuento);

              this.carrito.totalPrecio = this.carrito.totalPrecio + item.cantidadEntradas * subEvento.precioEntrada;

              console.log(this.carrito.totalPrecio)
            }
          }
        }
      },
      error: (err) => {
        console.error("Error al actualizar item con el cupón:", err)
      }
    });
  }

  aumentarCantidad(item: ItemCarritoDTO, cantidad: number) {
    this.carritoService.aumentarCanridad(this.usuarioId, item).subscribe({
      next: (value) => {
        item.cantidadEntradas = cantidad

        window.location.reload();
      },
      error: (err) => {
        console.log("cantidad no aumentada", err)
      },

    })
  }

  reducirCantidad(item: ItemCarritoDTO, cantidad: number) {
    this.carritoService.reducirCantidad(this.usuarioId, item).subscribe({
      next: (value) => {

        item.cantidadEntradas = cantidad

        window.location.reload();
      },
      error: (err) => {
        console.log("error al intentar reducir cantidad", err)
      },
    })
  }
  comprar() {
    this.router.navigate(['/compra-cliente-desde-carrito'])
  }
  vaciarCarrito() {
    this.carritoService.vaciarCarrito(this.usuarioId).subscribe({
      next: (value) => {

        window.location.reload();

      },
    });
  }


}
