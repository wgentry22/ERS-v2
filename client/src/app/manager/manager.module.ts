import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResolveReimbursementsComponent} from './components/resolve-reimbursements/resolve-reimbursements.component';
import {ManagerRoutingModule} from "./manager-routing.module";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./state/manager.reducer";
import {ReimbursementTableComponent} from "./components/reimbursement-table/reimbursement-table.component";
import {ManagerMaterialModule} from "./manager-material.module";
import {EffectsModule} from "@ngrx/effects";
import {ManagerEffects} from "./state/manager.effects";
import {ApproveReimbursementButtonComponent} from './components/approve-reimbursement-button/approve-reimbursement-button.component';
import {RejectReimbursementButtonComponent} from './components/reject-reimbursement-button/reject-reimbursement-button.component';


@NgModule({
  declarations: [
    ResolveReimbursementsComponent,
    ReimbursementTableComponent,
    ApproveReimbursementButtonComponent,
    RejectReimbursementButtonComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    ManagerMaterialModule,
    StoreModule.forFeature('manager', reducer),
    EffectsModule.forFeature([ManagerEffects]),
  ]
})
export class ManagerModule { }
