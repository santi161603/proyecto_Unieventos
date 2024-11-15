import { RouterModule,Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';
import { DetalleEventoComponent } from './componentes/detalle-evento/detalle-evento.component';
import { GestionEventosComponent } from './componentes/gestion-eventos/gestion-eventos.component';
import { VerificacionCodigoComponent } from './componentes/verificacion-codigo/verificacion-codigo.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CrearLocalidadComponent } from './componentes/crear-localidad/crear-localidad.component';
import { GestionLocalidadesComponent } from './componentes/gestionar-localidades/gestionar-localidades.component';
import { EventosComponent } from './componentes/eventos/eventos.component';
import { RestablecerContrasenaComponent } from './componentes/restablecer-contrasena/restablecer-contrasena.component';
import { CambiarContrasenaComponent } from './componentes/cambiar-contrasena/cambiar-contrasena.component';
import { VerificarCodigoRestablecerComponent } from './componentes/verificar-codigo-restablecer/verificar-codigo-restablecer.component';
import { GestionarCuponComponent } from './componentes/gestionar-cupon/gestionar-cupon.component';
import { CrearCuponComponent } from './componentes/crear-cupon/crear-cupon.component';
import { ActualizarLocalidadComponent } from './componentes/actualizar-localidad/actualizar-localidad.component';
import { ActualizarPerfilComponent } from './componentes/actualizar-perfil/actualizar-perfil.component';
import { ActualizarEventoComponent } from './componentes/actualizar-evento/actualizar-evento.component';
import { ActualizarCuponComponent } from './componentes/actualizar-cupon/actualizar-cupon.component';
import { InformacionUsuarioComponent } from './componentes/informacion-usuario/informacion-usuario.component';
import { CarritoUsuarioComponent } from './componentes/carrito-usuario/carrito-usuario.component';
import { LoginGuard } from './guards/permiso.service';
import { RolesGuard } from './guards/roles.service';
import { CompraClienteComponent } from './componentes/compra-cliente/compra-cliente.component';
import { PagoExitosoComponent } from './componentes/pago-exitoso/pago-exitoso.component';
import { PagoFallidoComponent } from './componentes/pago-fallido/pago-fallido.component';
import { PagoPendienteComponent } from './componentes/pago-pendiente/pago-pendiente.component';
import { HistorialClienteComponent } from './componentes/historial-cliente/historial-cliente.component';
import { CompraClienteDesdeCarritoComponent } from './componentes/compra-cliente-desde-carrito/compra-cliente-desde-carrito.component';
import { DetalleOrdenHistorialComponent } from './componentes/detalle-orden-historial/detalle-orden-historial.component';
import { CorreSuspendidoComponent } from './componentes/corre-suspendido/corre-suspendido.component';


export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
   { path: 'registro', component: RegistroComponent, canActivate: [LoginGuard] },
   { path: 'verificacion-codigo', component: VerificacionCodigoComponent},
   { path: "informacion-usuario",component: InformacionUsuarioComponent},
   { path: "actualizar-perfil", component: ActualizarPerfilComponent},
   { path: 'crear-evento',component:CrearEventoComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "obtener-evento",component:DetalleEventoComponent},
   { path: 'crear-localidad', component:CrearLocalidadComponent,canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "gestion-eventos", component: GestionEventosComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   } },
   { path: "gestion-localidad", component: GestionLocalidadesComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "eventos", component: EventosComponent},
   { path: "recuperar-contraseña", component: RestablecerContrasenaComponent},
   { path: "recuperar-suspendido", component: CorreSuspendidoComponent},
   { path: "cambiar-contrasena", component: CambiarContrasenaComponent},
   { path: "verificar-codigo-restablecer", component: VerificarCodigoRestablecerComponent},
   { path: "gestion-cupones", component: GestionarCuponComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "crear-cupon", component:CrearCuponComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "eventos-detalle", component: DetalleEventoComponent},
   { path: "actualizar-localidad", component:ActualizarLocalidadComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "actualizar-evento", component:ActualizarEventoComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "actualizar-cupon", component:ActualizarCuponComponent, canActivate: [RolesGuard], data: {
    expectedRole: ["ADMINISTRADOR"]
   }},
   { path: "carrito", component:CarritoUsuarioComponent},
   { path: "compra-cliente", component:CompraClienteComponent},
   { path: "pago-exitoso", component:PagoExitosoComponent},
   { path: "pago-fallido", component:PagoFallidoComponent},
   { path: "pago-pendiente", component:PagoPendienteComponent},
   { path: "historial-compras", component: HistorialClienteComponent},
   { path: "compra-cliente-desde-carrito", component:CompraClienteDesdeCarritoComponent},
   { path: "detalle-orden", component:DetalleOrdenHistorialComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
 })
 export class AppRoutingModule {}
