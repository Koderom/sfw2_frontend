import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesPendientesWidget } from './pacientes-pendientes-widget';

describe('PacientesPendientesWidget', () => {
  let component: PacientesPendientesWidget;
  let fixture: ComponentFixture<PacientesPendientesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesPendientesWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesPendientesWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
