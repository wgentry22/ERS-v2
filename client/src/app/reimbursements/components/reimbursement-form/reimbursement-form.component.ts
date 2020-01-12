import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReimbursementForm} from "../../../domain/dto/reimbursement.dto";
import {select, Store} from "@ngrx/store";
import * as fromReimbursement from '../../state/reimbursement.reducer'
import {CreateReimbursementAction} from "../../state/reimbursement.actions";
import {UserInfoState} from "../../../user/state/user.reducer";
import {SnackbarService, SnackbarType} from "../../../home/services/snackbar.service";
import {REIMBURSEMENT_TYPES} from "../../../constants";

@Component({
  selector: 'app-reimbursement-form',
  templateUrl: './reimbursement-form.component.html',
  styleUrls: ['./reimbursement-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementFormComponent implements OnInit {

  @Input("currentUser") currentUser: UserInfoState;

  form: FormGroup;
  readonly types = REIMBURSEMENT_TYPES;

  constructor(
    private fb: FormBuilder,
    private store: Store<fromReimbursement.State>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.form = this.generateForm();
  }

  isFormInvalid() {
    return !this.form.touched && this.form.invalid;
  }

  create() {
    const reimbursement: ReimbursementForm = { ...this.form.getRawValue(), expenseDate: new Date(this.form.get("expenseDate").value).getTime() };
    this.store.dispatch(new CreateReimbursementAction(reimbursement));
    this.store.pipe(select(fromReimbursement.lastCreatedReimbursementStatus)).subscribe(
      data => {
        if (data) {
          this.form = this.generateForm();
          this.snackbarService.showSnackbar("Reimbursement created successfully!", "OK", SnackbarType.SUCCESS);
        } else {
          this.snackbarService.showSnackbar("Failed to create reimbursement", "Thanks", SnackbarType.FAILURE);
        }
      }
    )
  }

  private generateForm(): FormGroup {
    return this.fb.group({
      "amount": [0, [Validators.required, Validators.min(0)]],
      "description": ["", Validators.required],
      "type":  ["", Validators.required],
      "expenseDate": [new Date(), Validators.required]
    })
  }
}
