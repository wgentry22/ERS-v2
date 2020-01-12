import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Reimbursement} from "../../../domain/dto/reimbursement.dto";
import {UserInfoState} from "../../../user/state/user.reducer";
import {BehaviorSubject, Observable} from "rxjs";
import {CollectionViewer, DataSource} from "@angular/cdk/collections";

@Component({
  selector: 'app-reimbursements-list',
  templateUrl: './reimbursements-list.component.html',
  styleUrls: ['./reimbursements-list.component.css'],
})
export class ReimbursementsListComponent implements OnInit, OnChanges {

  @Input('reimbursements') reimbursements: Reimbursement[];
  @Input('currentUser') currentUser: UserInfoState;
  @Output("onTabChange") onTabChange: EventEmitter<number> = new EventEmitter<number>(true);
  @Output('onReimbursementUpdate') onReimbursementUpdate: EventEmitter<Reimbursement> = new EventEmitter<Reimbursement>(true);
  private badge: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  badge$: Observable<string> = this.badge.asObservable();

  dataSource: DataSource<Reimbursement>;

  constructor() { }

  ngOnInit() {
    this.handleTabChange(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (let prop in changes) {
      const change = changes[prop];
      if (prop === 'reimbursements' && !change.isFirstChange()) {
        if (change.currentValue) {
          this.badge.next(change.currentValue.length + '');
        }
      }
    }
  }


  getPendingReimbursements(): Reimbursement[] {
    return this.reimbursements && this.reimbursements.filter(reimbursement => reimbursement.status === 0);
  }

  handleTabChange(event: any) {
    if (event < 3) {
      this.badge.next(this.getPendingReimbursements().length + '');
      this.onTabChange.emit(event);
    }
  }

  handleReimbursementUpdate(reimbursement: Reimbursement) {
    if (reimbursement) {
      this.onReimbursementUpdate.emit(reimbursement);
    }
  }

  private refreshDataSource(reimbursements: Reimbursement[]) {
    if (reimbursements && reimbursements.length > 0) {
      this.dataSource = new class extends DataSource<Reimbursement> {
        connect(collectionViewer: CollectionViewer): Observable<Reimbursement[]> {
          return new BehaviorSubject(reimbursements);
        }

        disconnect(collectionViewer: CollectionViewer): void {
        }
      }
    } else {
      this.dataSource = new class extends DataSource<Reimbursement> {
        connect(collectionViewer: CollectionViewer): Observable<Reimbursement[]> {
          return new BehaviorSubject([]);
        }

        disconnect(collectionViewer: CollectionViewer): void {
        }
      }
    }
  }
}
