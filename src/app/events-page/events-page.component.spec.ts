import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsPageComponent } from './events-page.component';

describe('EventsPageComponent', () => {
  let component: EventsPageComponent;
  let fixture: ComponentFixture<EventsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [EventsPageComponent]
});
    fixture = TestBed.createComponent(EventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
