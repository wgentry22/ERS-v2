import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";

@Component({
  selector: 'app-reimbursement-card-group',
  templateUrl: './reimbursement-card-group.component.html',
  styleUrls: ['./reimbursement-card-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementCardGroupComponent implements OnInit {

  @Input("data") data: Reimbursement[];
  @Input("canResolve") canResolve: boolean;
  @Output('onReimbursementUpdate') onReimbursementUpdate: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);

  constructor() { }

  ngOnInit() {
  }

  handleReimbursementUpdate(reimbursement: Reimbursement) {
    if (reimbursement) {
      this.onReimbursementUpdate.emit(reimbursement);
    }
  }

}
