import { Component, OnInit } from '@angular/core';
import { Pago, PagoSocio } from '../../interfaces/pago';
import { PagoService } from '../../services/pago.service';
import { Socio, SocioData } from '../../interfaces/socio';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ModalPagoComponent } from "../modal-pago/modal-pago.component";
import { FormsModule } from '@angular/forms';
import { DocumentosService } from '../../services/documentos.service';
import { DialogEditPagoComponent } from '../dialog-edit-pago/dialog-edit-pago.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEliminarPagoComponent } from "../modal-eliminar-pago/modal-eliminar-pago.component";
import { SocioService } from '../../services/socio.service';

@Component({
  selector: 'app-lista-pagos',
  standalone: true,
  templateUrl: './lista-pagos.component.html',
  styleUrl: './lista-pagos.component.css',
  imports: [
    CommonModule,
    MatIconModule,
    ModalPagoComponent,
    FormsModule,
    ModalEliminarPagoComponent
  ]
})
export class ListaPagosComponent implements OnInit {

  listPagos: Pago[] = [];
  listSocios: Socio[] = [];
  id: number | undefined;
  showModalFlag: boolean = false;
  pago: Pago = {
    pagoId: 0,
    cuota: 0,
    fechaPago: '',
    numeroSocio: 0
  };
  socio!: Socio;
  pagoSocio!: PagoSocio;
  apellidoFiltro!: string;
  dniFiltro!: string;
  showModalEliminarFlag: boolean = false;
  pagoId!: number;
  ultimoSocio: Socio | undefined;
  socioIdBuscar!: number;
  ultimoPago?: Socio;

  constructor(private socioService: SocioService, private pagoService: PagoService, private documentosService: DocumentosService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    await this.GetAllPagos();
    this.MostrarTodosPagos();
  }

  async MostrarTodosPagos(): Promise<void> {
    return new Promise<void>(resolve => {
      this.pagoService.mostrarTodosPagos()
        .subscribe(async listPagos => {
          this.listPagos = listPagos.map(pago => pago);
          this.listPagos.sort((a: Pago, b: Pago) => b.pagoId - a.pagoId);
          this.socioIdBuscar = this.listPagos[0].numeroSocio;
          for (let index = 0; index < this.listSocios.length; index++) {
            const element = this.listSocios[index];
              if (element.numeroSocio == this.socioIdBuscar) {
                //this.ultimoPago = this.listSocios.find(socio => socio.numeroSocio == this.socioIdBuscar);
                this.ultimoPago = element;
                break;

              }
          }
          resolve();
        });
    });
  }

  async GetSocio(numeroSocio: number) {
    try {
      const socioData = await this.socioService.getSocio(numeroSocio).toPromise();

      // Verificar si se obtuvieron datos antes de mostrar la modal
      if (socioData) {
        this.showModalFlag = true;
        if (socioData.direccion == "string") socioData.direccion = "";
        if (socioData.localidad == "string") socioData.localidad = "";
        if (socioData.fechaNacimiento == "string") socioData.fechaNacimiento = "";
        if (socioData.fechaNacimiento == "0001-01-01") socioData.fechaNacimiento = "";
      } else {
        console.error('No se encontraron datos para el número de socio:', numeroSocio);
      }
    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  async GetAllPagos(): Promise<void> {
    return new Promise<void>(resolve => {
      this.pagoService.getAllPagos()
        .subscribe(listSocios => {
          this.listSocios = listSocios.map(socio => socio);
          this.listSocios.sort((a: Socio, b: Socio) => {
            // Ordenar por primerApellido
            const comparacionPrimerApellido = a.primerApellido.localeCompare(b.primerApellido);
  
            // Si los primeros apellidos son iguales, ordenar por segundoApellido
            const comparacionSegundoApellido = comparacionPrimerApellido === 0
              ? a.segundoApellido.localeCompare(b.segundoApellido)
              : comparacionPrimerApellido;
  
            // Si los segundos apellidos son iguales, ordenar por nombre
            return comparacionSegundoApellido === 0
              ? a.nombre.localeCompare(b.nombre)
              : comparacionSegundoApellido;
          });
  
          resolve();
        });
    });
  }

  formatFecha(fecha: string): string {
    const fechaObj = new Date(fecha);

    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1;
    const año = fechaObj.getFullYear();

    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const fechaFormateada = `${dia}/${mesFormateado}/${año}`;

    return fechaFormateada;
  }

  ShowModal(pagoSocioData: PagoSocio) {
    this.pagoSocio = pagoSocioData;
  }

  HideModal() {
    this.showModalFlag = false;
  }

  async ObtenerPago(numeroSocio: number) {
    try {
      const socioData = await this.pagoService.getPagoSocio(numeroSocio).toPromise();

      // Verificar si se obtuvieron datos antes de mostrar la modal
      if (socioData) {
        this.showModalFlag = true;
        if (socioData.direccion == "string") socioData.direccion = "";
        if (socioData.localidad == "string") socioData.localidad = "";
        if (socioData.fechaNacimiento == "string") socioData.fechaNacimiento = "";
        if (socioData.fechaNacimiento == "0001-01-01") socioData.fechaNacimiento = "";
        if (socioData.foto == "string") socioData.foto = "";
        socioData.fechaPago = this.formatFecha(socioData.fechaPago)
        this.ShowModal(socioData);
      } else {
        console.error('No se encontraron datos para el número de socio:', numeroSocio);
      }
    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  async DescargarCarnet(numeroSocio: number) {
    await this.documentosService.getCarnet(numeroSocio);
  }

  async DescargarJustificante(numeroSocio: number) {
    await this.documentosService.getJustificante(numeroSocio);
  }

  OpenPagoDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogEditPagoComponent, {
      width: '400px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  EliminarPago(pagoId: number) {
    throw new Error('Method not implemented.');
  }

  async confirmarEliminacion(id: number) {
    try {
      await this.pagoService.deletePago(id).toPromise();
      this.HideModalEliminar();
      alert('Pago borrado con exito.')
      await this.GetAllPagos();
    }
    catch {
      alert('No se ha podido borrar el pago.')
      this.HideModalEliminar();
      await this.GetAllPagos();
    }
  }

  HideModalEliminar() {
    this.showModalEliminarFlag = false;
  }

  async DeletePago(id: number) {
    try {

      const socioData = await this.pagoService.getPagoSocio(id).toPromise();
      if (socioData != null) {
        this.showModalEliminarFlag = true;

        this.ShowModalEliminar(socioData);
      }
      else {
        throw new Error;
      }
    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  ShowModalEliminar(socioData: PagoSocio) {
    this.pagoSocio = socioData;
  }
}
