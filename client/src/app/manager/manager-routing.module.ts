import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ResolveReimbursementsComponent} from "./components/resolve-reimbursements/resolve-reimbursements.component";

const routes: Routes = [
  {
    path: '',
    component: ResolveReimbursementsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ManagerRoutingModule {}
