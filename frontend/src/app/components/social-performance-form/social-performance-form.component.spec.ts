import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialPerformanceFormComponent } from './social-performance-form.component';

describe('SocialPerformanceFormComponent', () => {
  let component: SocialPerformanceFormComponent;
  let fixture: ComponentFixture<SocialPerformanceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialPerformanceFormComponent]
    });
    fixture = TestBed.createComponent(SocialPerformanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
