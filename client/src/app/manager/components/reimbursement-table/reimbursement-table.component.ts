import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reimbursement, ReimbursementType} from "../../../domain/dto/reimbursement.dto";
import {DataSource} from "@angular/cdk/collections";

@Component({
  selector: 'app-reimbursement-table',
  templateUrl: './reimbursement-table.component.html',
  styleUrls: ['./reimbursement-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementTableComponent implements OnInit {

  @Input("dataSource") dataSource: DataSource<Reimbursement>;
  @Input("pending") pending: boolean;
  @Input("headers") headers: string[];
  @Output('onReimbursementApprove') onReimbursementApprove: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);
  @Output('onReimbursementReject') onReimbursementReject: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);

  constructor() { }

  ngOnInit() {
  }



  getStatus(status: number): string {
    if (status === 0) {
      return "Pending";
    } else if (status === 1) {
      return "Approved";
    } else if (status === 2) {
      return "Rejected";
    }
  }

  getType(type: number): ReimbursementType {
    if (type === 0) {
      return ReimbursementType.LODGING;
    } else if (type === 1) {
      return ReimbursementType.FLIGHT;
    } else if (type === 2) {
      return ReimbursementType.GAS;
    } else if (type === 3) {
      return ReimbursementType.FOOD;
    } else if (type === 4) {
      return ReimbursementType.CERTIFICATE;
    }
  }

  handleApproval(reimbursement: Reimbursement) {
    this.onReimbursementApprove.next(reimbursement);
  }

  handleRejection(reimbursement: Reimbursement) {
    this.onReimbursementReject.next(reimbursement);
  }

}
