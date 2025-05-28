import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouthPageComponent } from './youth-page.component';

describe('YouthPageComponent', () => {
  let component: YouthPageComponent;
  let fixture: ComponentFixture<YouthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [YouthPageComponent]
});
    fixture = TestBed.createComponent(YouthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
