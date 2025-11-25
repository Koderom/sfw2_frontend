import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoNoVisita } from './motivo-no-visita';

describe('MotivoNoVisita', () => {
  let component: MotivoNoVisita;
  let fixture: ComponentFixture<MotivoNoVisita>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotivoNoVisita]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotivoNoVisita);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
