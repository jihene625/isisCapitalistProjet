import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockDetailsComponent } from './unlock-details.component';

describe('UnlockDetailsComponent', () => {
  let component: UnlockDetailsComponent;
  let fixture: ComponentFixture<UnlockDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
