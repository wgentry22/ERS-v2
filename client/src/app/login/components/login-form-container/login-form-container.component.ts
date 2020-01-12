import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {LoginFormDto} from "../../../domain/dto/login-form.dto";
import {select, Store} from "@ngrx/store";
import * as fromAuth from '../../../user/state/user.reducer'
import {AttemptAuthenticationAction, FetchUserDetailsAction} from "../../../user/state/user.actions";
import {Observable} from "rxjs";
import {dramaticEntrance} from "../../../app.animations";

@Component({
  selector: 'app-login-form-container',
  templateUrl: './login-form-container.component.html',
  styleUrls: ['./login-form-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [dramaticEntrance]
})
export class LoginFormContainerComponent implements OnInit {

  errorMessage$: Observable<string>;
  isAttemptingAuthentication$: Observable<boolean>;

  constructor(
    private store: Store<fromAuth.State>,
  ) { }

  ngOnInit() {
    this.errorMessage$ = this.store.pipe(select(fromAuth.authenticationErrorMessage));
    this.isAttemptingAuthentication$ = this.store.pipe(select(fromAuth.isAttemptingAuthentication));
  }

  handleAuthenticationAttempt(form: LoginFormDto) {
    this.store.dispatch(new AttemptAuthenticationAction(form));
    this.store.pipe(select(fromAuth.isFullyAuthenticated)).subscribe(
      data => {
        if (data) {
          this.store.dispatch(new FetchUserDetailsAction());
        }
      }
    )
  }
}
