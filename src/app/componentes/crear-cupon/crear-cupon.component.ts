import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdministradorService } from '../../servicios/administrador.service';
import { CrearCuponDTO } from '../../dto/crear-cupon-dto';
import Swal from 'sweetalert2';
import { CuponObtenidoDTO } from '../../dto/cupon-obtenido-dto';
import { CuentaAutenticadaService } from '../../servicios/cuenta-autenticada.service';
import { ClientService } from '../../servicios/auth.service';
import { EnumService } from '../../servicios/get-enums.service';

@Component({
  selector: 'app-crear-cupon',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-cupon.component.html',
  styleUrl: './crear-cupon.component.css'
})
export class CrearCuponComponent {

  cuponForm: FormGroup;
  cuponesObtenidos: CuponObtenidoDTO[] =[];
  ciudades: string[] = [];
  tipoEventos:string[] =[];

  constructor(private fb: FormBuilder,private adminService: AdministradorService, private cuentaAut:CuentaAutenticadaService, private enumsServ:EnumService) {
    this.cuponForm = this.fb.group({
      nombreCupon: ['', Validators.required],
      descripcionCupon: ['', Validators.required],
      porcentajeDescuento: [
        '',
        [Validators.required, Validators.min(0.1), Validators.max(80)]
      ],
      userCupon: [''],  // Campo opcional
      fechaVencimiento: [
        '',
        [Validators.required]
      ],
      cantidad: [
        '',
        [Validators.required, Validators.min(10)]
      ],
      ciudad:[''],
      tipoEvento:['']
    });
    this.obtenerCupones()
    this.obtenerCiudades()
    this.obtenerTipoEventos()
  }
  obtenerCupones() {
    this.cuentaAut.obtenerTodosLosCupones().subscribe({
      next:(value)=> {
          this.cuponesObtenidos = value.respuesta
      },
    })
  }
  obtenerCiudades() {
    this.enumsServ.listarCiudades().subscribe({
      next:(value)=> {
          this.ciudades = value
      },
    })
  }
  obtenerTipoEventos() {
    this.enumsServ.listarTipoEvento().subscribe({
      next:(value)=> {
          this.tipoEventos =value
      },
    })
  }

  transformarMayusculas() {
    const nombre = this.cuponForm.get('nombreCupon')?.value;
    if (nombre) {
      this.cuponForm.get('nombreCupon')?.setValue(nombre.toUpperCase());
    }
  }

  validarNombreUnico(nombre: string): boolean {
    return this.cuponesObtenidos.some(cupon => cupon.nombreCupon === nombre);
  }

  onSubmit(): void {
    if (this.cuponForm.valid) {
      const nuevoCupon = this.cuponForm.value as CrearCuponDTO;
      if (this.validarNombreUnico(nuevoCupon.nombreCupon)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nombre del cupón ya existe.',
        });
        return;
      }

      this.adminService.crearCupon(nuevoCupon).subscribe({
        next: (value) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'El cupón se ha creado correctamente.',
          });
          this.cuponForm.reset();
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al crear el cupón. Por favor, inténtalo de nuevo.',
          });
        },
      });
    } else {
      this.cuponForm.markAllAsTouched();
    }
  }
}
