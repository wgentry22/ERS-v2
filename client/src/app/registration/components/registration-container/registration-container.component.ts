import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {dramaticEntranceFromRight} from "../../../app.animations";
import {RegistrationForm} from "../../../domain/dto/registration-form";
import {select, Store} from "@ngrx/store";
import * as fromManager from '../../state/registration.reducer';
import {AttemptRegistrationAction, CheckUsernameAvailabilityAction} from "../../state/registration.actions";
import {Message} from "../../../domain/dto/message.dto";

@Component({
  selector: 'app-registration-container',
  templateUrl: './registration-container.component.html',
  styleUrls: ['./registration-container.component.css'],
  animations: [dramaticEntranceFromRight]
})
export class RegistrationContainerComponent implements OnInit {

  isCheckingUsername$: Observable<boolean>;
  hasUsernameBeenChecked$: Observable<boolean>;
  isUsernameAvailable$: Observable<boolean>;
  registrationMessage$: Observable<Message>;

  constructor(
    private store: Store<fromManager.RegistrationState>
  ) { }

  ngOnInit() {
    this.isCheckingUsername$ = this.store.pipe(select(fromManager.isCheckingUsername));
    this.hasUsernameBeenChecked$ = this.store.pipe(select(fromManager.usernameAvailabilityHasBeenChecked));
    this.isUsernameAvailable$ = this.store.pipe(select(fromManager.isUsernameAvailable));
    this.registrationMessage$ = this.store.pipe(select(fromManager.registrationMessage));
  }

  handleFormSubmit(form: RegistrationForm) {
    if (form) {
      this.store.dispatch(new AttemptRegistrationAction(form));
    }
  }

  handleCheckUsernameAvailability(username: string) {
    if (username) {
      this.store.dispatch(new CheckUsernameAvailabilityAction(username));
    }
  }
}
