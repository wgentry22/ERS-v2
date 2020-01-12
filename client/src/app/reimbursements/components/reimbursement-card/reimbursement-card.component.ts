import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reimbursement, ReimbursementStatus} from "../../../domain/dto/reimbursement.dto";
import {MatDialog} from "@angular/material/dialog";
import {UpdateReimbursementComponent} from "../update-reimbursement/update-reimbursement.component";

@Component({
  selector: 'app-reimbursement-card',
  templateUrl: './reimbursement-card.component.html',
  styleUrls: ['./reimbursement-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementCardComponent implements OnInit {

  @Input("data") data: Reimbursement;
  @Input('canResolve') canResolve: boolean;
  @Output('onReimbursementUpdate') onReimbursementUpdate: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);

  constructor(
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
  }

  handleReimbursementUpdate() {
    const dialogRef = this.matDialog.open(UpdateReimbursementComponent, {
      width: '550px',
      data: this.data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(reimbursement => {
      if (reimbursement) {
        this.onReimbursementUpdate.emit(reimbursement);
      }
    });
  }

}
