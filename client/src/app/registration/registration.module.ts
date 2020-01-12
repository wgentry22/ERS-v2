import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RegistrationContainerComponent} from './components/registration-container/registration-container.component';
import {RegistrationFormComponent} from './components/registration-form/registration-form.component';
import {RegistrationRoutingModule} from "./registration-routing.module";
import {RegistrationMaterialModule} from "./registration-material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {RegistrationService} from "./services/registration.service";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./state/registration.reducer";
import {EffectsModule} from "@ngrx/effects";
import {RegistrationEffects} from "./state/registration.effects";


@NgModule({
  declarations: [RegistrationContainerComponent, RegistrationFormComponent],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    RegistrationMaterialModule,
    ReactiveFormsModule,
    StoreModule.forFeature("registration", reducer),
    EffectsModule.forFeature([RegistrationEffects])
  ],
  providers: [
    RegistrationService
  ]
})
export class RegistrationModule { }
