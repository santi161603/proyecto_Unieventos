import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventoObtenidoDTO } from '../../dto/evento-obtenido-dto';
import { Router, ActivatedRoute } from '@angular/router';
import { AdministradorService } from '../../servicios/administrador.service';
import { ClientService } from '../../servicios/auth.service';
import { SubEventosDto } from '../../dto/subevento-dto';
import { DTOActualizarLocalidad } from '../../dto/actualizar-localidad-dto';
import { EventoActualizarDTO } from '../../dto/actualizar-evento-dto';
import Swal from 'sweetalert2';
import { LocalidadNombreIdDTO } from '../../dto/localidades-id-nombre';
import { EnumService } from '../../servicios/get-enums.service';

@Component({
  selector: 'app-actualizar-evento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-evento.component.html',
  styleUrl: './actualizar-evento.component.css'
})
export class ActualizarEventoComponent implements OnInit {
  actualizarEventoForm: FormGroup;
  eventoActual: EventoObtenidoDTO | undefined;
  imagenSeleccionada: File | null = null;
  imagenPrevisualizada: string | ArrayBuffer | null = null;
  eventoId: string = '';
  localidades: LocalidadNombreIdDTO[] =[];
  estadoCuentaEnum: string[]=[]
  tipoEventoEnum: string [] = []

  constructor(
    private fb: FormBuilder,
    private eventoService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private adminEvent: AdministradorService,
    private enumService: EnumService
  ) {
    this.actualizarEventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.maxLength(700)]],
      tipoEvento: ['', Validators.required],
      estadoEvento: ['', Validators.required],
      subEventos: this.fb.array([]),  // Array de subeventos dinámicos
      imagen: ['']  // Para la imagen
    });
  }

  getTiposEvento(){
    this.enumService.listarTipoEvento().subscribe({
      next: (value) =>{
        this.tipoEventoEnum = value
      },
      error:(err) => {
          console.log("error al obtener la lista de tipo evento", err)
      }
    })
  }

  getEstadoEvento(){
    this.enumService.listarEstadoCuenta().subscribe({
      next: (value) =>{
        this.estadoCuentaEnum = value
      },
      error:(err) => {
        console.log("error al obtener la lista de estado evento", err)
      }
    })
  }

  getLocalidadesNombreId(){
    this.adminEvent.obtenerTodasLasLocalidadesNombreID().subscribe({
      next: (value) =>{
        this.localidades = value.respuesta
      },
      error:(err) => {
        console.log("error al obtener la lista de localidades", err)
      }
    })
  }

  ngOnInit(): void {
    const id = sessionStorage.getItem("idEventoActualizar")
    this.getEstadoEvento();
    this.getLocalidadesNombreId();
    this.getTiposEvento();
    if (id){
      this.eventoId = id;
    if (this.eventoId) {
      this.obtenerEventoPorId(this.eventoId);
    }
    }else{

    }
  }

  obtenerEventoPorId(id: string): void {
    this.eventoService.obtenerEventoPorId(id).subscribe({
      next: (data) => {
        this.eventoActual = data.respuesta as EventoObtenidoDTO;
        this.actualizarEventoForm.patchValue({
          nombre: data.respuesta.nombre,
          descripcion: data.respuesta.descripcion,
          tipoEvento: data.respuesta.tipoEvento,
          estadoEvento: data.respuesta.estadoEvento
        });

        // Crear los subeventos dinámicamente
        const subEventos = this.actualizarEventoForm.get('subEventos') as FormArray;
        data.respuesta.subEventos.forEach((subEvento: SubEventosDto) => {

          const fechaEvento = new Date(subEvento.fechaEvento); // Asegúrate de que subEvento.fechaEvento esté en un formato ISO válido
          const fechaFormateada = fechaEvento.toISOString().split('T')[0]; // Esto convertirá la fecha a 'YYYY-MM-DD'

          subEventos.push(this.fb.group({
            fechaEvento: [fechaFormateada, Validators.required],
            localidad: [subEvento.localidad, Validators.required],
            horaEvento: [subEvento.horaEvento, Validators.required],
            cantidadEntradas: [subEvento.cantidadEntradas, Validators.required],
            precioEntrada: [subEvento.precioEntrada, Validators.required],
          }));
        });

        // Previsualizar la imagen si existe
        if (data.respuesta.imagenPoster) {
          this.imagenPrevisualizada = data.respuesta.imagenPoster;
        }
      },
      error: (err) => {
        console.error('Error al obtener evento:', err);
      }
    });
  }

  get subEventos(): FormArray {
    return this.actualizarEventoForm.get('subEventos') as FormArray;
  }

  agregarSubEvento(): void {
    this.subEventos.push(this.fb.group({
      fechaEvento: ['', Validators.required],
      localidad: ['', Validators.required],
      horaEvento: ['', Validators.required],
      cantidadEntradas: ['', Validators.required],
      precioEntrada: ['', Validators.required],
    }));
  }

  eliminarSubEvento(index: number): void {
    this.subEventos.removeAt(index);
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
    if (this.actualizarEventoForm.valid) {
      const eventoActualizado = { ...this.actualizarEventoForm.value } as EventoActualizarDTO;
      if (this.imagenSeleccionada) {
        // Si se seleccionó una imagen, sube la imagen y actualiza el evento
        this.adminEvent.subirImagen(this.imagenSeleccionada).subscribe({
          next: (urlImagen) => {
            eventoActualizado.imagenPoster = urlImagen.respuesta;
            this.actualizarEvento(eventoActualizado);
          },
          error: (err) => {
            console.error('Error al subir imagen:', err);
          }
        });
      } else {
        // Si no se seleccionó imagen, solo actualiza los datos sin la imagen
        this.actualizarEvento(eventoActualizado);
      }
    } else {
      alert('Formulario no válido. Completa todos los campos.');
    }
  }

  private actualizarEvento(eventoData: EventoActualizarDTO): void {
    this.adminEvent.actualizarEvento(this.eventoId, eventoData).subscribe({
      next: (value) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'La localidad se ha actualizado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then((result) =>{
          if(result.isConfirmed){
        this.actualizarEventoForm.reset(); // Reinicia el formulario tras la creación exitosa
        this.imagenSeleccionada = null; // Resetea la imagen seleccionada
        this.router.navigate(['/gestion-eventos']);
          }
      })
    },
      error: (err) => {
        console.error('Error al actualizar evento:', err);
      }
    });
  }
}
