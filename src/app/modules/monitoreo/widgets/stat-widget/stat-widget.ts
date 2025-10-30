import { IncidenciaTbDto } from '@/core/dtos/incidencias-tb.dto';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-widget.html',
  styleUrl: './stat-widget.scss'
})
export class StatWidget {
  @Input() incidencia!: IncidenciaTbDto;
}
