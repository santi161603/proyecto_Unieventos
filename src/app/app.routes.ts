import { RouterModule,Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { CrearEventoComponent } from './componentes/crear-evento/crear-evento.component';
import { GestionEventosComponent } from './componentes/gestion-eventos/gestion-eventos.component';
import { VerificacionCodigoComponent } from './componentes/verificacion-codigo/verificacion-codigo.component';
import { NgModule } from '@angular/core';


export const routes: Routes = [
   { path: '', component: InicioComponent },
   { path: 'login', component: LoginComponent },
   { path: 'registro', component: RegistroComponent },
   { path: 'verificacion-codigo', component: VerificacionCodigoComponent},
   { path:'crear-evento',component:CrearEventoComponent},
   { path: "gestion-eventos", component: GestionEventosComponent },
   { path: "**", pathMatch: "full", redirectTo: "" }
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
 })
 export class AppRoutingModule {}