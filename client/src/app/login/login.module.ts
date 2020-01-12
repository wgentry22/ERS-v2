import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {LoginFormContainerComponent} from './components/login-form-container/login-form-container.component';
import {LoginRoutingModule} from "./login-routing.module";
import {LoginMaterialModule} from "./login-material.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginFormComponent,
    LoginFormContainerComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    LoginMaterialModule,
    ReactiveFormsModule,
  ]
})
export class LoginModule { }
