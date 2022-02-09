import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualroomComponent } from './virtualroom.component';

describe('VirtualroomComponent', () => {
  let component: VirtualroomComponent;
  let fixture: ComponentFixture<VirtualroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
