import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventosService } from '../../servicios/eventos.service';
import { EventoDTO } from '../../dto/evento-dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [],
  templateUrl: './crear-evento.component.html',
  styleUrl: './crear-evento.component.css'
})
export class CrearEventoComponent {
  tiposDeEvento: string[];
  crearEventoForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private eventosService: EventosService) {
   this.crearFormulario();
   this.tiposDeEvento = ['Concierto', 'Fiesta', 'Teatro', 'Deportes'];
  }
  
  private crearFormulario() {
    this.crearEventoForm = this.formBuilder.group({
     nombre: ['', [Validators.required]],
     descripcion: ['', [Validators.required]],
     tipo: ['', [Validators.required]],
     direccion: ['', [Validators.required]],
     ciudad: ['', [Validators.required]],
     localidades: this.formBuilder.array([]),
     imagenPortada: ['', [Validators.required]],
     imagenLocalidades: ['', [Validators.required]]
   });
  }
  
  public onFileChange(event:any, tipo:string){
    if (event.target.files.length > 0) {
      const files = event.target.files;     
   
   
      switch(tipo){
        case 'localidades':
          this.crearEventoForm.get('imagenLocalidades')?.setValue(files[0]);
          break;
        case 'portada':
          this.crearEventoForm.get('imagenPortada')?.setValue(files[0]);
          break;
      }
   
   
    }
   }
   
   public crearEvento(){
    this.eventosService.crear(this.crearEventoForm.value as EventoDTO);
    Swal.fire("Exito!", "Se ha creado un nuevo evento.", "success");
   }
   
   
}
