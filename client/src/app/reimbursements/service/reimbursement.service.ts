import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Reimbursement, ReimbursementForm} from "../../domain/dto/reimbursement.dto";
import {environment} from "../../../environments/environment";

@Injectable()
export class ReimbursementService {

  constructor(
    private http: HttpClient,
  ) { }

  getAllReimbursements(): Observable<Reimbursement[]> {
    return this.http.get<Reimbursement[]>(environment.api.reimbursements);
  }

  getMyReimbursements(): Observable<Reimbursement[]> {
    return this.http.get<Reimbursement[]>(environment.api.myReimbursements);
  }

  createReimbursement(form: ReimbursementForm) {
    return this.http.post(environment.api.reimbursements, form);
  }

  resolveReimbursement(reimbursement: Reimbursement) {
    return this.http.put<Reimbursement>(environment.api.reimbursements, { id: reimbursement.id, status: reimbursement.status});
  }

  updateReimbursement(reimbursement: Reimbursement) {
    return this.http.patch<Reimbursement>(environment.api.reimbursements, reimbursement);
  }
}
