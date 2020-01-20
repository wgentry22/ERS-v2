import {Injectable} from '@angular/core';
import config from '../../../assets/security.json';
import {SecurityConfig} from '../../../njson-typings';

@Injectable({
  providedIn: 'root'
})
export class SecurityConfigService {

  private roleHierarchy: RoleHierarchy;

  constructor() {
    this.roleHierarchy = new RoleHierarchyImpl(config);
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
