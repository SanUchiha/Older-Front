import { Component, Inject, Input } from '@angular/core';
import { DialogSocioComponent } from '../dialog-socio/dialog-socio.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ListaPagosComponent } from '../lista-pagos/lista-pagos.component';
import { ModificarPago, Pago, PagoSocio } from '../../interfaces/pago';
import { PagoService } from '../../services/pago.service';

@Component({
  selector: 'app-dialog-edit-pago',
  standalone: true,
  imports: [
    FormsModule,
    ListaPagosComponent
  ],
  templateUrl: './dialog-edit-pago.component.html',
  styleUrl: './dialog-edit-pago.component.css'
})
export class DialogEditPagoComponent {

  pagoEncontrado: PagoSocio = {
    numeroSocio: 0,
    nombre: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    localidad: '',
    foto: '',
    cuota: 0,
    fechaPago: '',
    pagoId: 0,
    primerApellido: '',
    segundoApellido: '',
    flag: 0
  };
  modificarPago: ModificarPago = {
    pagoId: 0,
    cuota: 0
  };


  constructor(
    private dialogRef: MatDialogRef<DialogSocioComponent>,
    private pagoService: PagoService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {
    this.GetDataPago(this.data.id);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async GetDataPago(id: number) {
    try {
      var pagoBuscado = await this.pagoService.getPagoSocio(id).toPromise();

      if (pagoBuscado) {
        this.pagoEncontrado = pagoBuscado;
        let fecha = new Date(this.pagoEncontrado.fechaPago);
        this.pagoEncontrado.fechaPago = fecha.toLocaleDateString();
      }

    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  async EditPago() {
    try {

      if (this.pagoEncontrado.pagoId > 0) {
        this.modificarPago.pagoId = this.pagoEncontrado.pagoId;
        this.modificarPago.cuota = this.pagoEncontrado.cuota;

        await this.pagoService.editPago(this.modificarPago).toPromise();
      }
      alert('Pago modificado con exito.');
      window.location.reload();
    }
    catch (error) {
      alert('Pago modificado con exito.')
      window.location.reload();
    }
    finally {
      this.dialogRef.close();
    }
  }

}
