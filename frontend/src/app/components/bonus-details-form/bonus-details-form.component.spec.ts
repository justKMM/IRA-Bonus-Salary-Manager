import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusDetailsFormComponent } from './bonus-details-form.component';

describe('BonusDetailsFormComponent', () => {
  let component: BonusDetailsFormComponent;
  let fixture: ComponentFixture<BonusDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusDetailsFormComponent]
    });
    fixture = TestBed.createComponent(BonusDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
