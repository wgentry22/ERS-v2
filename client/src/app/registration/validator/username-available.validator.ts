import {AbstractControl} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import * as fromManager from '../state/registration.reducer';
import {CheckUsernameAvailabilityAction} from "../state/registration.actions";

export class UsernameAvailableValidator {
  static create(store: Store<fromManager.RegistrationState>) {
    return (control: AbstractControl) => {
      store.dispatch(new CheckUsernameAvailabilityAction(control.value));
      return store.pipe(select(fromManager.isUsernameValid))
    }
  }
}
