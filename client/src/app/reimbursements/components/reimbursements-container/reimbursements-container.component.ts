import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";
import {select, Store} from "@ngrx/store";
import * as fromReimbursement from '../../state/reimbursement.reducer';
import {UserInfoState} from "../../../user/state/user.reducer";
import {GetMyReimbursementsAction, UpdateReimbursementAction} from "../../state/reimbursement.actions";
import {dramaticEntranceFromLeft} from "../../../app.animations";
import {SnackbarService, SnackbarType} from "../../../home/services/snackbar.service";

@Component({
  selector: 'app-reimbursements-container',
  templateUrl: './reimbursements-container.component.html',
  styleUrls: ['./reimbursements-container.component.css'],
  animations: [dramaticEntranceFromLeft],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReimbursementsContainerComponent implements OnInit {

  @Input('currentUser') currentUser: UserInfoState;
  reimbursements$: Observable<Reimbursement[]>;

  constructor(
    private store: Store<fromReimbursement.State>,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
    this.store.dispatch(new GetMyReimbursementsAction());
    this.reimbursements$ = this.store.pipe(select(fromReimbursement.getPendingReimbursements));
  }

  handleReimbursementUpdate(reimbursement: Reimbursement) {
    this.store.dispatch(new UpdateReimbursementAction(reimbursement));
    this.store.pipe(select(fromReimbursement.isUpdating)).subscribe(
      yes => {
        if (!yes) {
          this.store.pipe(select(fromReimbursement.wasLastUpdateSuccessful)).subscribe(
            data => {
              if (data) {
                this.snackbarService.showSnackbar("Successfully updated reimbursement!", "OK", SnackbarType.SUCCESS);
              } else {
                this.snackbarService.showSnackbar("Failed to update reimbursement", "Thanks", SnackbarType.FAILURE);
              }
            }
          )
        }
      }
    );
  }

  handleTabChange(tab: number) {
    if (tab === 0) {
      this.reimbursements$ = this.store.pipe(select(fromReimbursement.getPendingReimbursements));
    } else if (tab === 1) {
      this.reimbursements$ = this.store.pipe(select(fromReimbursement.getApprovedReimbursements));
    } else if (tab === 2) {
      this.reimbursements$ = this.store.pipe(select(fromReimbursement.getRejectedReimbursements));
    }
  }

}
