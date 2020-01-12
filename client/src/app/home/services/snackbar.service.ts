import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class SnackbarService {

  constructor(
    private snackbar: MatSnackBar
  ) { }

  showSnackbar(message: string, action: string, type: SnackbarType) {
    this.snackbar.open(message, action, {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: type
    })
  }
}

export enum SnackbarType {
  SUCCESS = "success",
  FAILURE = "failure"
}
