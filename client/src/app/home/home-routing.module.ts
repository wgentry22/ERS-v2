import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeContainerComponent} from "./components/home-container/home-container.component";
import {MyReimbursementsComponent} from "../reimbursements/components/my-reimbursements/my-reimbursements.component";
import {IsManagerGuard} from "../user/guards/is-manager.guard";

const routes: Routes = [
  {
    path: 'home',
    component: HomeContainerComponent,
    data: {
      animation: "HomeContainer"
    },
    children: [
      {
        path: '',
        component: MyReimbursementsComponent,
        data: { animation: "MyReimbursements" }
      },
      {
        path: 'manage',
        loadChildren: () => import('../manager/manager.module').then(mod => mod.ManagerModule),
        canActivate: [IsManagerGuard],
        data: {
          animation: "ResolveReimbursements"
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
