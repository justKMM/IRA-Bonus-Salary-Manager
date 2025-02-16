import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusChartComponent } from './bonus-chart.component';

describe('BonusChartComponent', () => {
  let component: BonusChartComponent;
  let fixture: ComponentFixture<BonusChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusChartComponent]
    });
    fixture = TestBed.createComponent(BonusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
