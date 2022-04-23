import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () =>
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree;
}

@Injectable()
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
