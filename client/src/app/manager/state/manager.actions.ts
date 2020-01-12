import {Action} from "@ngrx/store";
import {Reimbursement} from "../../domain/dto/reimbursement.dto";

export enum ManagerActionTypes {
  FIND_ALL_REIMBURSEMENTS = '[Manager] Find All Reimbursements',
  FIND_ALL_REIMBURSEMENTS_SUCCESS = '[Manager] Success Finding All Reimbursements',
  RESOLVE_REIMBURSEMENT = '[Manager] Resolve Reimbursement',
  RESOLVE_REIMBURSEMENT_SUCCESS = '[Manager] Successfully Resolved Reimbursement',
  RESOLVE_REIMBURSEMENT_FAILURE = '[Manager] Failed to Resolve Reimbursement',
  LOAD_MANAGER_MODULE = '[Manager] Load Base Module',
  MANAGER_MODULE_LOADED = '[Manager] Module Loaded Successfully',
  MANAGER_STATE_STALE = '[Manager] Manager State marked stale'
}

export class ResolveReimbursementAction implements Action {
  readonly type = ManagerActionTypes.RESOLVE_REIMBURSEMENT;

  constructor(public reimbursement: Reimbursement) {}
}

export class ResolveReimbursementSuccessAction implements Action {
  readonly type = ManagerActionTypes.RESOLVE_REIMBURSEMENT_SUCCESS;

  constructor(public reimbursement: Reimbursement) {}
}

export class ResolveReimbursementFailureAction implements Action {
  readonly type = ManagerActionTypes.RESOLVE_REIMBURSEMENT_FAILURE;

  constructor() {}
}

export class FindAllReimbursementsAction implements Action {
  readonly type = ManagerActionTypes.FIND_ALL_REIMBURSEMENTS;

  constructor() {}
}

export class FindAllReimbursementsSuccessAction implements Action {
  readonly type = ManagerActionTypes.FIND_ALL_REIMBURSEMENTS_SUCCESS;

  constructor(public reimbursements: Reimbursement[]) {}
}

export class LoadManagerModuleAction implements Action {
  readonly type = ManagerActionTypes.LOAD_MANAGER_MODULE;

  constructor(public username: string) {}
}

export class ManagerModuleLoadedAction implements Action {
  readonly type = ManagerActionTypes.MANAGER_MODULE_LOADED;

  constructor() {}
}

export class StaleManagerStateAction implements Action {
  readonly type = ManagerActionTypes.MANAGER_STATE_STALE;

  constructor() {}
}

export type ManagerActions =
  ManagerModuleLoadedAction |
  ResolveReimbursementAction |
  ResolveReimbursementSuccessAction |
  ResolveReimbursementFailureAction |
  FindAllReimbursementsAction |
  FindAllReimbursementsSuccessAction |
  LoadManagerModuleAction |
  StaleManagerStateAction;
