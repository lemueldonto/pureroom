import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorejaugeComponent } from './scorejauge.component';

describe('ScorejaugeComponent', () => {
  let component: ScorejaugeComponent;
  let fixture: ComponentFixture<ScorejaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScorejaugeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorejaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
