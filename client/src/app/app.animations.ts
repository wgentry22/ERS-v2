import {animate, animateChild, group, style, transition, trigger} from "@angular/animations";

export const routeAnimations = trigger('routeAnimations', [
  transition('LoginPage <=> RegistrationPage', [
    style({ opacity: 0 }),
    animate('2500ms ease-out', style({ opacity: 1 })),
    animateChild()
  ]),
  transition('RegistrationPage <=> LoginPage', [
    style({opacity: 1}),
    animate('2500ms ease-in', style({ opacity: 0 })),
    animateChild()
  ])
]);

export const childRouteAnimations = trigger('childRouteAnimations', [
  transition('MyReimbursements => ResolveReimbursements', [
    group([
      style({ opacity: 0, transform: 'translateX(20%)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)'}))
    ])
  ]),
  transition('ResolveReimbursements => MyReimbursements', [
    group([
      style({ opacity: 0, transform: 'translateX(-20%)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)'}))
    ])
  ])
]);

export const dramaticEntrance = trigger('dramaticEntrance', [
  transition(':enter', [
    group([
      style({ opacity: 0, transform: 'translateY(20%)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0%)'}))
    ])
  ])
]);

export const dramaticEntranceFromRight = trigger('dramaticEntranceFromRight', [
  transition(':enter', [
    group([
      style({ opacity: 0, transform: 'translateX(20%)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)'}))
    ])
  ])
]);

export const dramaticEntranceFromLeft = trigger('dramaticEntranceFromRight', [
  transition(':enter', [
    group([
      style({ opacity: 0, transform: 'translateX(-20%)' }),
      animate('200ms ease-in', style({ opacity: 1, transform: 'translateX(0%)'}))
    ])
  ])
]);
