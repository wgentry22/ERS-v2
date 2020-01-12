import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementCardAvatarComponent } from './reimbursement-card-avatar.component';

describe('ReimbursementCardAvatarComponent', () => {
  let component: ReimbursementCardAvatarComponent;
  let fixture: ComponentFixture<ReimbursementCardAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReimbursementCardAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementCardAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
