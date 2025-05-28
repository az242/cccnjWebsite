import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegenPageComponent } from './regen-page.component';

describe('RegenPageComponent', () => {
  let component: RegenPageComponent;
  let fixture: ComponentFixture<RegenPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RegenPageComponent]
});
    fixture = TestBed.createComponent(RegenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
