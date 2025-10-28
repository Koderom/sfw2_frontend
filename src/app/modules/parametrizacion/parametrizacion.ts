import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { Motivos } from './motivos/motivos';
import { Sintomas } from './sintomas/sintomas';
import { Enfermedades } from './enfermedades/enfermedades';

@Component({
  selector: 'app-parametrizacion',
  imports: [CommonModule, PanelModule, DividerModule, Motivos, Sintomas, Enfermedades],
  templateUrl: './parametrizacion.html',
  styleUrl: './parametrizacion.scss'
})
export class Parametrizacion {}
