import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";

@Component({
  selector: 'app-approve-reimbursement-button',
  templateUrl: './approve-reimbursement-button.component.html',
  styleUrls: ['./approve-reimbursement-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApproveReimbursementButtonComponent implements OnInit {

  @Input("data") data: Reimbursement;
  @Output('onReimbursementApprove') onReimbursementApprove: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);

  constructor() { }

  ngOnInit() {
  }

  handle() {
    this.onReimbursementApprove.emit(this.data);
  }
}
