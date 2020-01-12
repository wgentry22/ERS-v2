import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RegistrationContainerComponent} from "./components/registration-container/registration-container.component";

const routes: Routes = [
  {
    path: '',
    component: RegistrationContainerComponent,
    data: { animation: "RegistrationContainer" },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule {}
