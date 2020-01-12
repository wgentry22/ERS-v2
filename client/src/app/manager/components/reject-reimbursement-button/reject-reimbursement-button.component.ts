import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";

@Component({
  selector: 'app-reject-reimbursement-button',
  templateUrl: './reject-reimbursement-button.component.html',
  styleUrls: ['./reject-reimbursement-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RejectReimbursementButtonComponent implements OnInit {

  @Input("data") data: Reimbursement;
  @Output('onReimbursementReject') onReimbursementReject: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);

  constructor() { }

  ngOnInit() {
  }

  handle() {
    this.onReimbursementReject.emit(this.data);
  }
}
