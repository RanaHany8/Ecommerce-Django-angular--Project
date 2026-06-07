import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerPayoutsComponent } from './seller-payouts.component';

describe('SellerPayoutsComponent', () => {
  let component: SellerPayoutsComponent;
  let fixture: ComponentFixture<SellerPayoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerPayoutsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerPayoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
