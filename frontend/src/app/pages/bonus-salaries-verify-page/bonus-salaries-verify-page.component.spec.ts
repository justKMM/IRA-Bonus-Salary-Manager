import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusSalariesVerifyPageComponent } from './bonus-salaries-verify-page.component';

describe('BonusSalariesVerifyPageComponent', () => {
  let component: BonusSalariesVerifyPageComponent;
  let fixture: ComponentFixture<BonusSalariesVerifyPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusSalariesVerifyPageComponent]
    });
    fixture = TestBed.createComponent(BonusSalariesVerifyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
