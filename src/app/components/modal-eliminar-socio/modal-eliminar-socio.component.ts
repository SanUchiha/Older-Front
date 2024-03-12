import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Socio } from '../../interfaces/socio';

@Component({
  selector: 'app-modal-eliminar-socio',
  standalone: true,
  imports: [],
  templateUrl: './modal-eliminar-socio.component.html',
  styleUrl: './modal-eliminar-socio.component.css'
})
export class ModalEliminarSocioComponent {
  @Input() socio!: Socio;
  @Output() confirmarEliminacion = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirmarEliminar() {
    this.confirmarEliminacion.emit();
  }

  close() {
    this.closeModal.emit();
  }
}
