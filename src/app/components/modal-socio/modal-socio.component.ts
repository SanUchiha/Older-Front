import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Socio } from '../../interfaces/socio';

@Component({
  selector: 'app-modal-socio',
  standalone: true,
  imports: [],
  templateUrl: './modal-socio.component.html',
  styleUrl: './modal-socio.component.css'
})
export class ModalSocioComponent {

  @Input() socioData!: Socio;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
