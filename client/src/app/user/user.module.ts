import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreModule} from "@ngrx/store";
import {reducer} from "./state/user.reducer";
import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./state/user.effects";
import {HasTokenGuard} from "./guards/has-token.guard";
import {IsManagerGuard} from "./guards/is-manager.guard";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('user', reducer),
    EffectsModule.forFeature([UserEffects])
  ],
  providers: [
    HasTokenGuard,
    IsManagerGuard
  ]
})
export class UserModule { }
