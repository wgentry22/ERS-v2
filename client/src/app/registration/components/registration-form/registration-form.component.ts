import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegistrationForm} from "../../../domain/dto/registration-form";
import {Message} from "../../../domain/dto/message.dto";
import {DEPARTMENTS} from "../../../constants";

@Component({
  selector: 'app-initial-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationFormComponent implements OnInit {

  form: FormGroup;
  @Output("onFormSubmit") onFormSubmit: EventEmitter<RegistrationForm> = new EventEmitter<RegistrationForm>(true);
  @Output("onUsernameCheck") onUsernameCheck: EventEmitter<string> = new EventEmitter<string>(true);
  @Input("isCheckingUsername") isCheckingUsername$: boolean;
  @Input("hasUsernameBeenChecked") hasUsernameBeenChecked$: boolean;
  @Input("isUsernameAvailable") isUsernameAvailable$: boolean;
  @Input("registrationMessage") message: Message;

  lastCheckedUsername: string;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.generateForm();
  }

  attemptRegistration() {
    const form: RegistrationForm = this.form.getRawValue();
    this.onFormSubmit.emit(form);
  }

  checkUsername(event: any) {
    event.preventDefault();
    const username = event.target.value;
    this.lastCheckedUsername = username;
    this.onUsernameCheck.emit(username);
  }

  handleFocus(event: any) {
    event.preventDefault();
    this.lastCheckedUsername = "";
  }

  getDepartments(): string[] {
    return DEPARTMENTS;
  }

  private generateForm() {
    return this.fb.group({
      "username": ["", [Validators.required]],
      "password": ["", [Validators.required]],
      "firstname": ["", [Validators.required, Validators.pattern("^[a-zA-Z].*$")]],
      "lastname": ["", [Validators.required, Validators.pattern("^[a-zA-Z].*$")]],
      "department": ["", [Validators.required]],
      "position": ["", [Validators.required]],
    })
  }
}
