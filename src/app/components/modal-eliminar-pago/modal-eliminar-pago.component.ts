import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pago, PagoSocio } from '../../interfaces/pago';

@Component({
  selector: 'app-modal-eliminar-pago',
  standalone: true,
  imports: [],
  templateUrl: './modal-eliminar-pago.component.html',
  styleUrl: './modal-eliminar-pago.component.css'
})
export class ModalEliminarPagoComponent {
  @Input() pagoSocio!: PagoSocio;
  @Output() confirmarEliminacion = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirmarEliminar() {
    this.confirmarEliminacion.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
