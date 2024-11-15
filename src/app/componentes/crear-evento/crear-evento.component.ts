import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventoDTO } from '../../dto/evento-dto';
import Swal from 'sweetalert2';
import { EnumService } from '../../servicios/get-enums.service';
import { CommonModule } from '@angular/common';
import { AdministradorService } from '../../servicios/administrador.service';
import { ClientService } from '../../servicios/auth.service';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent implements OnInit {
  crearEventoForm: FormGroup;
  tipoEventoEnum: string[] = []; // Opciones de ejemplo
  estadoCuentaEnum: string[] = []; // Opciones de ejemplo
  localidades: LocalidadNombreIdDTO[] = [];
  imagenSeleccionada: File | null = null;

  subEventoImagenes: string[] = []; // Almacena las imágenes de las localidades seleccionadas
  subEventoCapacidades: number[] = []; // Almacena la capacidad disponible de las localidades seleccionadas


  constructor(private fb: FormBuilder, private adminService: AdministradorService, private enums: EnumService, private clientService: ClientService) {
    this.crearEventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(700)]],
      tipoEvento: ['', Validators.required],
      estadoEvento: ['', Validators.required],
      subEventos: this.fb.array([]) // Inicializa el FormArray para subEventos
    });

    this.getTipoEvento();
    this.getEstadoEvento();
    this.getNombreLocalidades();
  }

  ngOnInit(): void {
    this.agregarSubEvento(); // Agregar un subevento inicial
  }

  onLocalidadChange(event: Event, index: number): void {
    const selectedLocalidadId = (event.target as HTMLSelectElement).value;
    const localidad = this.localidades.find(loc => loc.IdLocalidad === selectedLocalidadId);

    if (localidad) {
      // Actualiza la imagen y la capacidad disponible para el subevento en la posición correspondiente
      this.subEventoImagenes[index] = localidad.imageLocalidad;
      this.subEventoCapacidades[index] = localidad.capacidadDisponible;

      // Ajusta el valor máximo de entradas permitidas según la capacidad disponible de la localidad seleccionada
      // Ajusta el validador del campo 'cantidadEntradas' para que tenga un límite máximo igual a la capacidad
      const subEvento = this.subEventos.at(index);
      subEvento?.get('cantidadEntradas')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(localidad.capacidadDisponible) // Aplica la capacidad máxima como validador
      ]);

      // Forzar la validación del campo después de cambiar el validador
      subEvento?.get('cantidadEntradas')?.updateValueAndValidity();
    }
  }

  private getNombreLocalidades() {
    this.clientService.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (data) => {
        console.log(data)
        this.localidades = data.respuesta; // Asigna las localidades obtenidas del backend
      },
      error: (error) => {
        console.error('Error al obtener localidades:', error);
      }
    });
  }

  private getTipoEvento() {
    this.enums.listarTipoEvento().subscribe({
      next: (data) => {
        this.tipoEventoEnum = data; // Asigna las ciudades obtenidas a la lista
      },
      error: (error) => {
        console.error('Error al obtener ciudades:', error);
      }
    });
  }

  private getEstadoEvento() {
    this.enums.listarEstadoCuenta().subscribe({
      next: (data) => {
        this.estadoCuentaEnum = data; // Asigna las ciudades obtenidas a la lista
      },
      error: (error) => {
        console.error('Error al obtener ciudades:', error);
      }
    });
  }

  // Getter para obtener el FormArray de subEventos
  get subEventos(): FormArray {
    return this.crearEventoForm.get('subEventos') as FormArray;
  }

  // Método para añadir un subevento al FormArray
  agregarSubEvento(): void {
    console.log('Subevento agregado'); // Verificar que el método se llame
    const subEventoForm = this.fb.group({
      fechaEvento: ['', Validators.required],
      localidad: ['', Validators.required],
      horaEvento: ['', Validators.required],
      cantidadEntradas: [1, [Validators.required, Validators.min(1)]],
      precioEntrada: [100, [Validators.required, Validators.min(100)]]
    });
    this.subEventos.push(subEventoForm);
    console.log(this.subEventos.value);
  }

  eliminarSubEvento(indice: number): void {
    this.subEventos.removeAt(indice);
    this.subEventoImagenes.splice(indice, 1);
    this.subEventoCapacidades.splice(indice, 1);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenSeleccionada = input.files[0];
    } else {
      this.imagenSeleccionada = null;
    }
  }

  onSubmit(): void {
    if (this.crearEventoForm.valid) {
      console.log(this.crearEventoForm.value);
      const crearEvento = {
        ...this.crearEventoForm.value
      } as EventoDTO

      if (this.imagenSeleccionada) {
        this.adminService.subirImagen(this.imagenSeleccionada).subscribe({
          next: (urlImagen) => {
            crearEvento.imageEvento = urlImagen.respuesta;
            console.log(urlImagen)
            console.log(urlImagen.respuesta)
            // Agrega la URL de la imagen al DTO
            this.crearEventoServicio(crearEvento);
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al subir la imagen. Por favor, inténtalo de nuevo.' + error,
            });
          }
        });
      }
      else {
        this.crearEventoServicio(crearEvento)
      }
      // Llamada al servicio para enviar los datos al backend

    } else {
      // Alerta indicando que el formulario no es válido
      Swal.fire({
        icon: 'warning',
        title: 'Formulario no válido',
        text: 'Por favor, completa todos los campos requeridos antes de enviar.',
      });
    }
  }

  crearEventoServicio(crearEvento: EventoDTO) {
    this.adminService.crearEvento(crearEvento).subscribe({
      next: (response) => {
        // Alerta de éxito si la respuesta del backend es positiva
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'El evento se ha creado correctamente.',
        });
        this.crearEventoForm.reset(); // Reinicia el formulario tras la creación exitosa
        this.imagenSeleccionada = null;
        this.subEventoImagenes = []
      },
      error: (error) => {
        // Alerta de error si ocurre algún problema en el envío
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al crear el evento. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }
}
