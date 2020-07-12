import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellItemHistoryComponent } from './sell-item-history.component';

describe('SellItemHistoryComponent', () => {
  let component: SellItemHistoryComponent;
  let fixture: ComponentFixture<SellItemHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellItemHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellItemHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
