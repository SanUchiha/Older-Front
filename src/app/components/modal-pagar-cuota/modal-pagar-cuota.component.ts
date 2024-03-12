import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PagoObject } from '../../interfaces/comun';

@Component({
  selector: 'app-modal-pagar-cuota',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './modal-pagar-cuota.component.html',
  styleUrl: './modal-pagar-cuota.component.css'
})
export class ModalPagarCuotaComponent {

  @Input() numeroSocio!: number;
  @Output() confirmarPago = new EventEmitter<PagoObject>();
  @Output() closeModal = new EventEmitter<void>();
  cuotaInput!: number;
  cuota!: number;
  pagoObj: PagoObject = {
    numeroSocio: 0,
    cuota: 0,
    fechaPago: new Date().toISOString()
  };

  confirmarPagar(cuota: number) {

    this.pagoObj.cuota = cuota;
    this.pagoObj.numeroSocio = this.numeroSocio;
    this.pagoObj.fechaPago = this.pagoObj.fechaPago.split('T')[0];

    this.confirmarPago.emit(this.pagoObj);
  }

  close() {
    this.closeModal.emit();
  }
}
