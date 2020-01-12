import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {REIMBURSEMENT_TYPES} from "../../../constants";

@Component({
  selector: 'app-update-reimbursement',
  templateUrl: './update-reimbursement.component.html',
  styleUrls: ['./update-reimbursement.component.css']
})
export class UpdateReimbursementComponent implements OnInit {

  form: FormGroup;
  readonly reimbursementTypes = REIMBURSEMENT_TYPES;

  constructor(
    public dialogRef: MatDialogRef<UpdateReimbursementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Reimbursement,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.generateForm();
  }

  onClose() {
    this.dialogRef.close();
  }

  updatedReimbursement(): Reimbursement {
    return { ...this.data, ...this.form.getRawValue(), expenseDate: new Date(this.form.get('expenseDate').value).getTime() };
  }

  private generateForm(): FormGroup {
    return this.fb.group({
      "amount": [this.data.amount],
      "description": [this.data.description],
      "type":  [this.data.type],
      "expenseDate": [new Date(this.data.expenseDate)]
    })
  }
}
