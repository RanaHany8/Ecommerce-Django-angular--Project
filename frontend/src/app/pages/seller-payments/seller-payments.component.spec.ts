import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerPaymentsComponent } from './seller-payments.component';

describe('SellerPaymentsComponent', () => {
  let component: SellerPaymentsComponent;
  let fixture: ComponentFixture<SellerPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerPaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
