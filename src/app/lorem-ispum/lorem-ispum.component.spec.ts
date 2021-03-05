import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoremIspumComponent } from './lorem-ispum.component';

describe('LoremIspumComponent', () => {
  let component: LoremIspumComponent;
  let fixture: ComponentFixture<LoremIspumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoremIspumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoremIspumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
