import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaciente } from './detail-paciente';

describe('DetailPaciente', () => {
  let component: DetailPaciente;
  let fixture: ComponentFixture<DetailPaciente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPaciente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPaciente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
