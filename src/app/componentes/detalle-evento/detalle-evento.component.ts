import { Component } from '@angular/core';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../servicios/auth.service';
import { CommonModule } from '@angular/common';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { forkJoin } from 'rxjs';
import { SubEventosObtenidosDto } from '../../dto/subevento-dto';
import { TokenService } from '../../servicios/token.service';
import { ItemCarritoDTO } from '../../dto/item-carrito';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import Swal from 'sweetalert2';
import { differenceInDays, parseISO } from 'date-fns';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent {
  idEvento: string | null = null;
  evento: EventoObtenidoDTO | undefined;
  localidades: LocalidadNombreIdDTO[] = [];
  selectedSubEvento: SubEventosObtenidosDto | null = null;  // Subevento seleccionado
  cantidadEntradas: number = 1;  // Inicializamos la cantidad de entradas en 1

  constructor(private route: ActivatedRoute, private clientService: ClientService, private serviceToken: TokenService,
    private router: Router, private cuentaAut: CuentaAutenticadaService) {

    this.route.params.subscribe((param) => {

      this.idEvento = param['eventoId']

    if (this.idEvento) {
      this.obtenerDatosEvento(this.idEvento);
    } else {
      console.error("No se encontró el ID del evento en sessionStorage");
    }
    })

  }

  private obtenerDatosEvento(idEvento: string) {
    // Utilizar forkJoin para esperar ambos llamados antes de proceder
    forkJoin([
      this.clientService.obtenerTodasLasLocalidadesNombreID(),  // Llamado para obtener localidades
      this.clientService.obtenerEventoPorId(idEvento)          // Llamado para obtener el evento
    ]).subscribe({
      next: ([localidadesData, eventoData]) => {
        this.localidades = localidadesData.respuesta;
        this.evento = eventoData.respuesta;



        if (this.evento) {
          const hoy = new Date(); // Fecha actual
          hoy.setHours(0, 0, 0, 0); // Eliminar las horas, minutos, segundos y milisegundos de hoy
          console.log("Hoy: ", hoy);

          const dosDiasDespues = new Date(hoy); // Copiar la fecha de hoy
          dosDiasDespues.setDate(hoy.getDate() + 2); // Añadir 2 días
          console.log("Dos días después: ", dosDiasDespues);

          // Filtrar los subeventos
          this.evento.subEventos = this.evento.subEventos.filter(subevento => {
            const fechaSubevento = new Date(subevento.fechaEvento);
            fechaSubevento.setHours(0, 0, 0, 0); // Eliminar las horas, minutos, segundos y milisegundos de la fecha del subevento
            console.log("Fecha subevento: ", fechaSubevento);

            // Comparar solo las fechas sin las horas, minutos, segundos y milisegundos
            const isWithinRange = fechaSubevento >= hoy && fechaSubevento >= dosDiasDespues
            console.log(`Subevento está dentro del rango: ${isWithinRange}`);

            return subevento.estadoSubEvento === 'ACTIVO' && isWithinRange;
          });
        }
        this.asignarNombresLocalidades();
      },
      error: (err) => console.error("Error al obtener datos:", err)
    });
  }

  seleccionarSubEvento(subevento: SubEventosObtenidosDto) {
    if (this.selectedSubEvento === subevento) {
      this.selectedSubEvento = null;
      this.cantidadEntradas = 1;  // Restablecemos a 1 si se deselecciona
    } else {
      this.selectedSubEvento = subevento;
      this.cantidadEntradas = 1;  // Restablecemos la cantidad a 1 cuando seleccionamos un nuevo subevento
    }
  }

  aumentarEntradas(event: MouseEvent) {
    event.stopPropagation();
    if (this.selectedSubEvento && this.cantidadEntradas < this.selectedSubEvento.cantidadEntradas) {
      this.cantidadEntradas++;
    }
  }


  disminuirEntradas(event: MouseEvent) {
    event.stopPropagation();
    if (this.cantidadEntradas > 1) {
      this.cantidadEntradas--;
    }
  }

  anadirAlCarrito() {
    if (!this.serviceToken.isLogged()) {
      // Redirigir al login si el usuario no está autenticado
      this.router.navigate(['/login']);
    } else {
      if (this.selectedSubEvento) {
        // Crear el objeto que será enviado al backend
        const itemCarrito: ItemCarritoDTO = {
          eventoId: this.idEvento!,
          idSubevento: this.selectedSubEvento.idSubEvento,
          cantidadEntradas: this.cantidadEntradas,
          cupon: "",
        };

        const idUser = this.serviceToken.getIDCuenta();

        // Llamar al servicio para añadir el item al carrito
        this.cuentaAut.anadirItemsAlCarritro(itemCarrito, idUser).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Se a añadido el item al carrito',
              confirmButtonText: 'Aceptar'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/carrito']);
              }
            })
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se a podido añadir el item al carrito' + err,
            })
          }
        });
      } else {
        console.error('No se ha seleccionado un subevento');
      }
    }
  }

  getLocalidadInfo(localidadId: string): LocalidadNombreIdDTO | undefined {
    const localidad = this.localidades.find(localidad =>
      localidad.IdLocalidad == localidadId
    )
    if (localidad) {
      return localidad
    }
    return undefined
  }

  // Comprar entrada
  comprarEntrada() {
    if (!this.serviceToken.isLogged()) {
      // Redirigir al login si el usuario no está autenticado
      this.router.navigate(['/login']);
    } else {
      if (this.selectedSubEvento) {

        const itemCarrito: ItemCarritoDTO = {
          eventoId: this.idEvento!,
          idSubevento: this.selectedSubEvento.idSubEvento,
          cantidadEntradas: this.cantidadEntradas,
          cupon: "", // Puedes agregar el código de cupón si es necesario
        };

        sessionStorage.removeItem('itemCompra');
        sessionStorage.setItem('itemCompra', JSON.stringify(itemCarrito));

        this.router.navigate(['/compra-cliente']);
      } else {
        console.error('No se ha seleccionado un subevento');
      }
    }
  }

  private asignarNombresLocalidades() {
    console.log("estoy dentro de asignar nombres");
    if (this.evento && this.localidades.length) {
      // Imprimir las localidades y los subeventos para depuración
      console.log('Localidades:', this.localidades);
      console.log('Subeventos:', this.evento.subEventos);

      this.evento.subEventos.forEach(subevento => {
        // Asegurarse de que los tipos sean iguales para evitar problemas de comparación
        const localidad = this.localidades.find(loc => loc.IdLocalidad === String(subevento.localidad));

        // Verificar si la localidad fue encontrada y asignarla
        if (localidad) {
          subevento.localidadNombre = localidad.nombreLocalidad;
        } else {
          console.warn('No se encontró la localidad para el subevento:', subevento);
        }
      });
    } else {
      console.log("Error: Evento o localidades no cargados correctamente");
      console.log(this.evento);
      console.log(this.localidades.length);
    }
  }
}
