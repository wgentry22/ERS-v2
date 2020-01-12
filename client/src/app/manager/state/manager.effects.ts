import {Injectable} from "@angular/core";
import {ReimbursementService} from "../../reimbursements/service/reimbursement.service";
import {Actions, Effect, ofType} from "@ngrx/effects";
import {Action} from "@ngrx/store";
import {
  FindAllReimbursementsAction,
  FindAllReimbursementsSuccessAction, LoadManagerModuleAction,
  ManagerActionTypes,
  ResolveReimbursementAction,
  ResolveReimbursementFailureAction,
  ResolveReimbursementSuccessAction
} from '../../manager/state/manager.actions';
import {Observable, of} from "rxjs";
import {catchError, concatMap, map} from "rxjs/operators";
import {Reimbursement} from "../../domain/dto/reimbursement.dto";
import {SnackbarService, SnackbarType} from "../../home/services/snackbar.service";

@Injectable()
export class ManagerEffects {

  constructor(
    private reimbursementService: ReimbursementService,
    private snackbarService: SnackbarService,
    private actions$: Actions,
  ) {}

  @Effect()
  findAllReimbursements$: Observable<Action> = this.actions$.pipe(
    ofType(ManagerActionTypes.FIND_ALL_REIMBURSEMENTS),
    concatMap(() => {
      return this.reimbursementService.getAllReimbursements().pipe(
        map((reimbursements: Reimbursement[]) => new FindAllReimbursementsSuccessAction(reimbursements))
      )
    })
  );

  @Effect()
  resolve$: Observable<Action> = this.actions$.pipe(
    ofType(ManagerActionTypes.RESOLVE_REIMBURSEMENT),
    concatMap((action: ResolveReimbursementAction) => {
      return this.reimbursementService.resolveReimbursement(action.reimbursement).pipe(
        map((reimbursement: Reimbursement) => new ResolveReimbursementSuccessAction(reimbursement)),
        catchError(() => of(new ResolveReimbursementFailureAction()))
      )
    }),
  );

  @Effect()
  loadedManagerModule$: Observable<Action> = this.actions$.pipe(
    ofType(ManagerActionTypes.MANAGER_MODULE_LOADED),
    concatMap(() => of(new FindAllReimbursementsAction()))
  );

  @Effect()
  resolveSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(ManagerActionTypes.RESOLVE_REIMBURSEMENT_SUCCESS),
    concatMap((action: ResolveReimbursementSuccessAction) => {
      this.snackbarService.showSnackbar(`Successfully ${this.determineReimbursementStatus(action.reimbursement.status)} reimbursement with id ${action.reimbursement.id}`, "Thanks", SnackbarType.SUCCESS);
      return of(new FindAllReimbursementsAction());
    })
  );

  @Effect()
  resolveFailure$: Observable<Action> = this.actions$.pipe(
    ofType(ManagerActionTypes.RESOLVE_REIMBURSEMENT_FAILURE),
    concatMap((action: ResolveReimbursementSuccessAction) => {
      this.snackbarService.showSnackbar(`Reimbursement with id ${action.reimbursement.id} failed to be marked as '${this.determineReimbursementStatus(action.reimbursement.status)}'`, "Thanks", SnackbarType.FAILURE);
      return of(new FindAllReimbursementsAction());
    })
  );

  private determineReimbursementStatus(status: number): string {
    if (status < 0 || status > 2) {
      return "";
    } else if (status === 1) {
      return "approved";
    } else if (status === 2) {
      return "rejected";
    }
  }
}
