import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UserActions, UserActionTypes} from "./user.actions";
import * as fromRoot from '../../app.reducer';

export interface State extends fromRoot.State {
  userState: UserState;
}

export interface UserState {
  user: UserInfoState;
  isAttemptingAuthentication: boolean;
  isAuthenticated: boolean;
  authenticationErrorMessage: string;
}

export interface UserInfoState {
  username: string;
  email: string;
  department: string;
  position: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  isAttemptingAuthentication: false,
  authenticationErrorMessage: "",
  user: {
    username: "",
    email: "",
    position: "",
    department: ""
  }
};

const getUserStateSelector = createFeatureSelector<UserState>('user');

export const currentUserInfoState = createSelector(
  getUserStateSelector,
  userState => userState.user
);

export const isAttemptingAuthentication = createSelector(
  getUserStateSelector,
  userState => userState.isAttemptingAuthentication
);

export const isFullyAuthenticated = createSelector(
  getUserStateSelector,
  userState => !userState.isAttemptingAuthentication && userState.isAuthenticated
);

export const authenticationErrorMessage = createSelector(
  getUserStateSelector,
  userState => userState.authenticationErrorMessage
);

export function reducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.AUTHENTICATION_SUCCESS:
      return { isAttemptingAuthentication: false, isAuthenticated: true, user: action.details, authenticationErrorMessage: undefined };
    case UserActionTypes.AUTHENTICATION_FAILURE:
      return { ...state, isAttemptingAuthentication: false, isAuthenticated: false, authenticationErrorMessage: action.message.message};
    case UserActionTypes.ATTEMPT_AUTHENTICATION:
      return { ...state, isAttemptingAuthentication: true, authenticationErrorMessage: undefined  };
    case UserActionTypes.CLEAR_USER_INFO:
      return initialState;
    default:
      return state;
  }
}
