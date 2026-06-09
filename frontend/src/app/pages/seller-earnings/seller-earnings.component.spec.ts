import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerEarningsComponent } from './seller-earnings.component';

describe('SellerEarningsComponent', () => {
  let component: SellerEarningsComponent;
  let fixture: ComponentFixture<SellerEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerEarningsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
