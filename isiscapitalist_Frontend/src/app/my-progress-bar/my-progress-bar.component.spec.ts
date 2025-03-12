import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProgressBarComponent } from './my-progress-bar.component';

describe('MyProgressBarComponent', () => {
  let component: MyProgressBarComponent;
  let fixture: ComponentFixture<MyProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
