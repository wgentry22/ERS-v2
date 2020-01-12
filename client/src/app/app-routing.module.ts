import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HasTokenGuard} from "./user/guards/has-token.guard";


const routes: Routes = [
  {
    path: "login",
    loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule),
    data: { animation: "LoginPage" },
  },
  {
    path: "",
    loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule),
    data: { animation: "HomePage" },
    canActivate: [HasTokenGuard]
  },
  {
    path: "register",
    loadChildren: () => import('./registration/registration.module').then(mod => mod.RegistrationModule),
    data: { animation: "RegistrationPage" }
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "/login"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
