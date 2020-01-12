import {Injectable} from "@angular/core";
import {ReimbursementService} from "../service/reimbursement.service";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";
import {
  CreateReimbursementAction,
  FailedCreateReimbursementAction,
  GetMyReimbursementsAction,
  ReimbursementActionTypes,
  SuccessfulCreateReimbursementAction,
  SuccessfulRetrievalOfMyReimbursementsAction, SuccessfulUpdateReimbursementAction, UpdateReimbursementAction
} from '../state/reimbursement.actions'
import {catchError, concatMap, map} from "rxjs/operators";
import {Reimbursement} from "../../domain/dto/reimbursement.dto";

@Injectable()
export class ReimbursementEffects {

  constructor(
    private reimbursementService: ReimbursementService,
    private actions$: Actions,
  ) {}

  @Effect()
  getMyReimbursements$: Observable<Action> = this.actions$.pipe(
    ofType(ReimbursementActionTypes.GET_MY_REIMBURSEMENTS),
    concatMap(() => {
      return this.reimbursementService.getMyReimbursements().pipe(
        map((reimbursements: Reimbursement[]) => new SuccessfulRetrievalOfMyReimbursementsAction(reimbursements))
      )
    })
  );

  @Effect()
  createReimbursement$: Observable<Action> = this.actions$.pipe(
    ofType(ReimbursementActionTypes.CREATE_REIMBURSEMENT),
    concatMap((action: CreateReimbursementAction) => {
      return this.reimbursementService.createReimbursement(action.form).pipe(
        map(() => {
          return new SuccessfulCreateReimbursementAction();
        }),
        catchError(err => {
          if (err) {
            return of(new FailedCreateReimbursementAction("Failed to create reimbursement"));
          }
        })
      );
    })
  );

  @Effect()
  reimbursementCreatedWithSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(ReimbursementActionTypes.CREATE_REIMBURSEMENT_SUCCESS),
    concatMap((action: SuccessfulCreateReimbursementAction) => {
      return of(new GetMyReimbursementsAction());
    })
  );

  @Effect()
  updateReimbursement$: Observable<Action> = this.actions$.pipe(
    ofType(ReimbursementActionTypes.UPDATE_REIMBURSEMENT),
    concatMap((action: UpdateReimbursementAction) => {
      return this.reimbursementService.updateReimbursement(action.reimbursement).pipe(
        map(reim => new SuccessfulUpdateReimbursementAction(reim))
      )
    })
  )
}
