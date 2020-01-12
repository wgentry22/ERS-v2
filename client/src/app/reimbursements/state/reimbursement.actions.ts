import {Action} from "@ngrx/store";
import {Reimbursement, ReimbursementForm} from "../../domain/dto/reimbursement.dto";

export enum ReimbursementActionTypes {
  GET_MY_REIMBURSEMENTS = '[Reimbursement] Get Mine',
  SUCCESSFUL_RETRIEVAL_OF_MY_REIMBURSEMENTS = '[Reimbursement] Get My Reimbursements Success',
  CREATE_REIMBURSEMENT = '[Reimbursement] Create Reimbursement',
  CREATE_REIMBURSEMENT_SUCCESS = '[Reimbursement] Create Reimbursement Success',
  CREATE_REIMBURSEMENT_FAILURE = '[Reimbursement] Failed to Reimbursement Success',
  UPDATE_REIMBURSEMENT = '[Reimbursement] Update Reimbursement',
  UPDATE_REIMBURSEMENT_SUCCESS = '[Reimbursement] Update Reimbursement Success'
}

export class GetMyReimbursementsAction implements Action {
  readonly type = ReimbursementActionTypes.GET_MY_REIMBURSEMENTS;

  constructor() {}
}

export class SuccessfulRetrievalOfMyReimbursementsAction implements Action {
  readonly type = ReimbursementActionTypes.SUCCESSFUL_RETRIEVAL_OF_MY_REIMBURSEMENTS;

  constructor(public reimbursements: Reimbursement[]) {}
}

export class CreateReimbursementAction implements Action {
  readonly type = ReimbursementActionTypes.CREATE_REIMBURSEMENT;

  constructor(public form: ReimbursementForm) {}
}

export class SuccessfulCreateReimbursementAction implements Action {
  readonly type = ReimbursementActionTypes.CREATE_REIMBURSEMENT_SUCCESS;

  constructor() {}
}

export class FailedCreateReimbursementAction implements Action {
  readonly type = ReimbursementActionTypes.CREATE_REIMBURSEMENT_FAILURE;

  constructor(public errorMessage: any) {}
}

export class UpdateReimbursementAction implements Action {
  readonly type = ReimbursementActionTypes.UPDATE_REIMBURSEMENT;

  constructor(public reimbursement: Reimbursement) {}
}

export class SuccessfulUpdateReimbursementAction implements Action {
  readonly type = ReimbursementActionTypes.UPDATE_REIMBURSEMENT_SUCCESS;

  constructor(public reimbursement: Reimbursement) {}
}


export type ReimbursementActions = GetMyReimbursementsAction |
  SuccessfulRetrievalOfMyReimbursementsAction |
  CreateReimbursementAction |
  SuccessfulCreateReimbursementAction |
  FailedCreateReimbursementAction |
  UpdateReimbursementAction |
  SuccessfulUpdateReimbursementAction;
