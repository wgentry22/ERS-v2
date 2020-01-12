import * as fromRoot from '../../app.reducer';
import {Reimbursement, ReimbursementStatus} from "../../domain/dto/reimbursement.dto";
import {ManagerActions, ManagerActionTypes} from "./manager.actions";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export interface State extends fromRoot.State {
  manager: ManagerState;
}

export interface ManagerState {
  username: string;
  allReimbursements: Reimbursement[];
  isLoadingModule: boolean;
  hasBeenLoaded: boolean;
  isDataStale: boolean;
  isResolving: boolean;
}

const initialState: ManagerState = {
  username: undefined,
  allReimbursements: undefined,
  isLoadingModule: true,
  hasBeenLoaded: true,
  isResolving: false,
  isDataStale: true
};

const getManagerState = createFeatureSelector<ManagerState>("manager");

export const getAllPendingReimbursements = createSelector(
  getManagerState,
  state => state && state.username && state.allReimbursements && state.allReimbursements.filter(reim => reim.createdBy !== state.username && reim.status === ReimbursementStatus.PENDING)
);

export const getAllResolvedReimbursements = createSelector(
  getManagerState,
  state => state.allReimbursements && state.allReimbursements.filter(reim => reim.status !== ReimbursementStatus.PENDING)
);

export const isLoadingManagerModule = createSelector(
  getManagerState,
  state => state && state.isLoadingModule === true
);

export const hasModuleBeenLoaded = createSelector(
  getManagerState,
  state => state && state.hasBeenLoaded === true && !state.isLoadingModule
);


export function reducer(state = initialState, action: ManagerActions): ManagerState {
  switch (action.type) {
    case ManagerActionTypes.FIND_ALL_REIMBURSEMENTS_SUCCESS:
      return { ...state, allReimbursements: action.reimbursements, isLoadingModule: false, isDataStale: false, hasBeenLoaded: true };
    case ManagerActionTypes.LOAD_MANAGER_MODULE:
      return { ...state, username: action.username };
    case ManagerActionTypes.RESOLVE_REIMBURSEMENT:
      return { ...state, isResolving: true };
    case ManagerActionTypes.RESOLVE_REIMBURSEMENT_SUCCESS:
      return { ...state, isResolving: false };
    case ManagerActionTypes.RESOLVE_REIMBURSEMENT_FAILURE:
      return { ...state, isResolving: false };
    case ManagerActionTypes.MANAGER_STATE_STALE:
      return { ... state, isDataStale: true };
    default:
      return state;
  }
}
