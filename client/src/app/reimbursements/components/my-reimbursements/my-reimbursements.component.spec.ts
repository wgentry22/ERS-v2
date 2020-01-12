import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReimbursementsComponent } from './my-reimbursements.component';

describe('MyReimbursementsComponent', () => {
  let component: MyReimbursementsComponent;
  let fixture: ComponentFixture<MyReimbursementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReimbursementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReimbursementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
