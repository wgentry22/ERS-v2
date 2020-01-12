import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import * as fromAuth from "../../../user/state/user.reducer";
import {select, Store} from "@ngrx/store";

@Component({
  selector: 'app-my-reimbursements',
  templateUrl: './my-reimbursements.component.html',
  styleUrls: ['./my-reimbursements.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyReimbursementsComponent implements OnInit {

  currentUser$: Observable<fromAuth.UserInfoState>;

  constructor(
    private store: Store<fromAuth.UserInfoState>,
  ) { }

  ngOnInit() {
    this.currentUser$ = this.store.pipe(select(fromAuth.currentUserInfoState))
  }

}
