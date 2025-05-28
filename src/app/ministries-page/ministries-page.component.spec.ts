import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistriesPageComponent } from './ministries-page.component';

describe('MinistriesPageComponent', () => {
  let component: MinistriesPageComponent;
  let fixture: ComponentFixture<MinistriesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MinistriesPageComponent]
});
    fixture = TestBed.createComponent(MinistriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
