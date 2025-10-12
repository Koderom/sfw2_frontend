import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesRecientesWidget } from './pacientes-recientes-widget';

describe('PacientesRecientesWidget', () => {
  let component: PacientesRecientesWidget;
  let fixture: ComponentFixture<PacientesRecientesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesRecientesWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesRecientesWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
