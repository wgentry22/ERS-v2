import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserInfoState} from "../../../user/state/user.reducer";
import {Router} from "@angular/router";
import {select, Store} from "@ngrx/store";
import * as fromManager from '../../../manager/state/manager.reducer'
import * as managerActions from "../../../manager/state/manager.actions";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {

  @Input('currentUser') currentUser: UserInfoState;
  @Output('onLogOut') onLogOut: EventEmitter<any> = new EventEmitter<any>(true);
  isLoadingManagerModule: boolean = false;

  constructor(
    private router: Router,
    private store: Store<fromManager.State>
  ) { }

  ngOnInit() {
  }

  attemptLogout() {
    this.onLogOut.emit();
  }

  canResolve(user: UserInfoState): boolean {
    return user && user.position && user.position === 'Manager';
  }

  loadManagerModule() {
    this.store.pipe(select(fromManager.hasModuleBeenLoaded)).subscribe(
      isLoaded => {
        if (isLoaded) {
          this.router.navigateByUrl("/home/manage");
        } else {
          this.isLoadingManagerModule = true;
          if (this.currentUser && this.currentUser.username && this.currentUser.position === "Manager") {
            this.store.dispatch(new managerActions.LoadManagerModuleAction(this.currentUser.username));
            this.store.pipe(select(fromManager.isLoadingManagerModule)).subscribe(
              isDoneLoading => {
                if (isDoneLoading) {
                  this.store.dispatch(new managerActions.ManagerModuleLoadedAction());
                  this.router.navigateByUrl("/home/manage");
                  this.isLoadingManagerModule = false;
                }
              }
            )
          }
          this.isLoadingManagerModule = false;
        }
      }
    );
  }
}
