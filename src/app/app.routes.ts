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
import { ActualizarEventoComponent } from './componentes/actualizar-evento/actualizar-evento.component';
import { ActualizarCuponComponent } from './componentes/actualizar-cupon/actualizar-cupon.component';

export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'verificacion-codigo/:idUsuario', component: VerificacionCodigoComponent},
   { path: 'crear-evento',component:CrearEventoComponent},
   { path: "obtener-evento",component:DetalleEventoComponent},
   { path: 'crear-localidad', component:CrearLocalidadComponent},
   { path: "gestion-eventos", component: GestionEventosComponent },
   { path: "gestion-localidad", component: GestionLocalidadesComponent},
   { path: "eventos", component: EventosComponent},
   { path: "recuperar-contraseña", component: RestablecerContrasenaComponent},
   { path: "cambiar-contrasena", component: CambiarContrasenaComponent},
   { path: "verificar-codigo-restablecer", component: VerificarCodigoRestablecerComponent},
   { path: "gestion-cupones", component: GestionarCuponComponent},
   { path: "crear-cupon", component:CrearCuponComponent},
   { path: "eventos-detalle", component: DetalleEventoComponent},
   { path: "actualizar-localidad", component:ActualizarLocalidadComponent},
   { path: "actualizar-evento", component:ActualizarEventoComponent},
   { path: "actualizar-cupon", component:ActualizarCuponComponent},
   { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
 })
 export class AppRoutingModule {}
