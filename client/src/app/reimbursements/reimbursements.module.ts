import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from "@ngrx/store";
import {reducer} from "./state/reimbursement.reducer";
import {EffectsModule} from "@ngrx/effects";
import {ReimbursementEffects} from "./state/reimbursement.effects";
import {ReimbursementService} from "./service/reimbursement.service";
import {ReimbursementsMaterialModule} from "./reimbursements-material.module";
import {ReimbursementFormComponent} from "./components/reimbursement-form/reimbursement-form.component";
import {ReimbursementsContainerComponent} from "./components/reimbursements-container/reimbursements-container.component";
import {ReimbursementsListComponent} from "./components/reimbursements-list/reimbursements-list.component";
import {ReactiveFormsModule} from "@angular/forms";
import {ReimbursementCardComponent} from './components/reimbursement-card/reimbursement-card.component';
import {ReimbursementCardGroupComponent} from './components/reimbursement-card-group/reimbursement-card-group.component';
import {ReimbursementCardAvatarComponent} from './components/reimbursement-card-avatar/reimbursement-card-avatar.component';
import {MyReimbursementsComponent} from './components/my-reimbursements/my-reimbursements.component';
import {UpdateReimbursementComponent} from './components/update-reimbursement/update-reimbursement.component';


@NgModule({
  declarations: [
    ReimbursementFormComponent,
    ReimbursementsContainerComponent,
    ReimbursementsListComponent,
    ReimbursementCardComponent,
    ReimbursementCardGroupComponent,
    ReimbursementCardAvatarComponent,
    MyReimbursementsComponent,
    UpdateReimbursementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReimbursementsMaterialModule,
    StoreModule.forFeature('reimbursements', reducer),
    EffectsModule.forFeature([ReimbursementEffects]),
  ],
  providers: [
    ReimbursementService,
  ],
  exports: [
    ReimbursementFormComponent,
    ReimbursementsContainerComponent,
    ReimbursementsListComponent,
  ],
  entryComponents: [
    UpdateReimbursementComponent
  ],
})
export class ReimbursementsModule { }
