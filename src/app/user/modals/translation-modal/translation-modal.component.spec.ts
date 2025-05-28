import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationModalComponent } from './translation-modal.component';

describe('TranslationModalComponent', () => {
  let component: TranslationModalComponent;
  let fixture: ComponentFixture<TranslationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslationModalComponent]
});
    fixture = TestBed.createComponent(TranslationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
