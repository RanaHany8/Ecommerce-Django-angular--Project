import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodesPage } from './promo-codes.page';

describe('PromoCodesPage', () => {
  let component: PromoCodesPage;
  let fixture: ComponentFixture<PromoCodesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoCodesPage]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromoCodesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
