import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertmodalpopupComponent } from './alertmodalpopup.component';

describe('AlertmodalpopupComponent', () => {
  let component: AlertmodalpopupComponent;
  let fixture: ComponentFixture<AlertmodalpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertmodalpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertmodalpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
