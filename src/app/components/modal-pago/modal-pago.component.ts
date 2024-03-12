import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagoSocio } from '../../interfaces/pago';

@Component({
  selector: 'app-modal-pago',
  standalone: true,
  imports: [],
  templateUrl: './modal-pago.component.html',
  styleUrl: './modal-pago.component.css'
})
export class ModalPagoComponent {

  @Input() pagoSocio!: PagoSocio;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
