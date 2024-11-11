import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumService } from '../../servicios/get-enums.service';
import { CuponActualizadoDTO } from '../../dto/actualizar-cupon-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { AdministradorService } from '../../servicios/administrador.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actualizar-cupon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './actualizar-cupon.component.html',
  styleUrl: './actualizar-cupon.component.css'
})
export class ActualizarCuponComponent {
  actualizarCuponForm: FormGroup;
  estadosCupon: string[] = []; // Asume que EstadoCupon es un enum
  idCupon: string ="";
  cuponObtenido: CuponObtenidoDTO | undefined;

  constructor(private fb: FormBuilder, private enumService:EnumService
    ,private cuentaAut:CuentaAutenticadaService,
    private adminService:AdministradorService,
    private router: Router
  ) {
    this.actualizarCuponForm = this.fb.group({
      nombreCupon: ['', [Validators.required, Validators.maxLength(50)]],
      descripcionCupon: ['', Validators.required],
      porcentajeDescuento: ['', [Validators.required, Validators.min(0.1), Validators.max(80)]],
      fechaVencimiento: ['', Validators.required],
      estadoCupon: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(10)]]
    });


    const id = sessionStorage.getItem("idCuponActualizar");

    if(id){
      this.idCupon = id;
    this.obtenerEstadoCupon();
    this.obtenerCuponPorID(id);
    }else{

    }
  }
  obtenerCuponPorID(id: string) {
    this.cuentaAut.obtenerCuponPorID(id).subscribe({
      next: (value) => {
        this.cuponObtenido = value.respuesta as CuponObtenidoDTO;

        console.log(value.respuesta.fechaVencimiento)

        const fechaEvento = new Date(value.respuesta.fechaVencimiento);
        console.log(fechaEvento) // Asegúrate de que subEvento.fechaEvento esté en un formato ISO válido
        const fechaFormateada = fechaEvento.toISOString().split('T')[0]; // Esto convertirá la fecha a 'YYYY-MM-DD'

        console.log(fechaFormateada)

         this.actualizarCuponForm.patchValue({
          nombreCupon: value.respuesta.nombreCupon,
          descripcionCupon: value.respuesta.descripcionCupon,
          porcentajeDescuento: value.respuesta.porcentajeDescuento,
          fechaVencimiento: fechaFormateada,
          estadoCupon: value.respuesta.estadoCupon,
          cantidad: value.respuesta.cantidad
         });
      },
      error:(err) => {
          console.log("error al obtener el cupon", err)
      },
    })
  }

  obtenerEstadoCupon() {
    this.enumService.listarEstadoCupones().subscribe({
      next:(value) => {
        this.estadosCupon = value
      },
      error:(err)=> {

      },
    })
  }



  onUpdate() {
    if (this.actualizarCuponForm.valid) {
      const cupon: CuponActualizadoDTO = this.actualizarCuponForm.value as CuponActualizadoDTO;

      this.adminService.actualizarCupon(this.idCupon, cupon).subscribe({
        next: (value)=> {

          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'La localidad se ha actualizado correctamente.',
            confirmButtonText: 'Aceptar'
          }).then((result) =>{
            if(result.isConfirmed){
          this.actualizarCuponForm.reset(); // Reinicia el formulario tras la creación exitosa
          this.router.navigate(['/gestion-cupones']);
            }
        })
      },
       error:(err)=> {
            console.log("Error al intentar actualizar el cupon")
        }
    })
    }
  }
}
