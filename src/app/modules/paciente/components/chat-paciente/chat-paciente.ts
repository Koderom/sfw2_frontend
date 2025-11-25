import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { PacienteService } from '../../paciente.service';
import { ChatMessageDto } from '@/core/dtos/chat-historial.dto';

@Component({
  selector: 'app-chat-paciente',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './chat-paciente.html',
  styleUrl: './chat-paciente.scss'
})
export class ChatPaciente implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() telefono?: string | number;

  mensajes: ChatMessageDto[] = [];
  loading: boolean = false;

  private pacienteService = inject(PacienteService);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['telefono'] && this.telefono) {
      this.loadMensajes(String(this.telefono));
    }
    if (changes['visible'] && !this.visible) {
      // clear when dialog closed
      this.mensajes = [];
    }
  }

  loadMensajes(telefono: string) {
    this.loading = true;
    this.pacienteService.getChatHistoryByPhone(telefono).subscribe({
      next: (resp: any) => {
        this.mensajes = resp?.data?.messages || [];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading chat history', err);
        this.mensajes = [];
        this.loading = false;
      }
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
