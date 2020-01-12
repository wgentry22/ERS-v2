import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginFormDto} from "../../../domain/dto/login-form.dto";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnInit {

  @Input("error") error$: Observable<string>;
  @Output('onAttemptAuthentication') onAttemptAuthentication: EventEmitter<LoginFormDto> = new EventEmitter<LoginFormDto>(true);
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.generateForm();
  }

  handleAuthenticationAttempt() {
    const loginForm: LoginFormDto = { ...this.loginForm.getRawValue() };
    this.onAttemptAuthentication.emit(loginForm);
  }

  isFormValid(): boolean {
    const username: AbstractControl = this.loginForm.get("username");
    const password: AbstractControl = this.loginForm.get("password");
    return username.dirty && username.valid && password.dirty && password.valid;
  }

  private generateForm(): FormGroup {
    return this.fb.group({
      "username": ["", Validators.required],
      "password": ["", Validators.required]
    });
  }
}
