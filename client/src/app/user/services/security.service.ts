import {Injectable} from '@angular/core';
import config from '../../../assets/security.json';
import {UserInfoState} from '../state/user.reducer';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private roleHierarchy: RoleHierarchy;

  constructor() {
    this.roleHierarchy = new RoleHierarchyImpl(config.roleHierarchy);
  }

  isManagerReachable(userInfo: UserInfoState): boolean {
    return userInfo && userInfo.role && this.roleHierarchy.isRoleReachable(userInfo.role, 'ROLE_MANAGER');
  }

  isValid(userInfo: UserInfoState): boolean {
    return userInfo && userInfo.role && this.roleHierarchy.isRoleReachable(userInfo.role, 'ROLE_EMPLOYEE');
  }
}

interface RoleHierarchy {
  readonly roles: Map<string, string[]>;
  isRoleReachable(actual: string, desired: string): boolean;
}

class RoleHierarchyImpl implements RoleHierarchy {
  readonly roles: Map<string, string[]>;

  constructor(roleHierarchy: string[]) {
    this.roles = new Map<string, string[]>();
    if (roleHierarchy && roleHierarchy.length) {
      for (let i = 0; i < roleHierarchy.length; i++) {
        const temp = roleHierarchy;
        this.roles.set(roleHierarchy[i], temp.slice(i, temp.length));
      }
    }
  }

  isRoleReachable(actual: string, desired: string): boolean {
    return this.roles.has(actual) && this.roles.get(actual).includes(desired);
  }
}
