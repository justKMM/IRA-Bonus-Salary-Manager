import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanDetailsPageComponent } from './salesman-details-page.component';

describe('SalesmanDetailsPageComponent', () => {
  let component: SalesmanDetailsPageComponent;
  let fixture: ComponentFixture<SalesmanDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanDetailsPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
