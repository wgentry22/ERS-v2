import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeContainerComponent} from './components/home-container/home-container.component';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {HomeRoutingModule} from "./home-routing.module";
import {HomeMaterialModule} from "./home-material.module";
import {ReimbursementsModule} from "../reimbursements/reimbursements.module";
import {SnackbarService} from "./services/snackbar.service";
import {ManagerModule} from "../manager/manager.module";


@NgModule({
  declarations: [
    HomeContainerComponent,
    ToolbarComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HomeMaterialModule,
    ReimbursementsModule,
    ManagerModule
  ],
  providers: [
    SnackbarService
  ]
})
export class HomeModule { }
