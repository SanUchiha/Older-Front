import { CommonModule } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Socio, SocioData } from '../../interfaces/socio';
import { SocioService } from '../../services/socio.service';
import { PagoService } from '../../services/pago.service';
import { ModalSocioComponent } from '../modal-socio/modal-socio.component';
import { ModalEliminarSocioComponent } from "../modal-eliminar-socio/modal-eliminar-socio.component";
import { FormsModule } from '@angular/forms';
import { PagarCuotaSocio } from '../../interfaces/pago';
import { ModalPagarCuotaComponent } from '../modal-pagar-cuota/modal-pagar-cuota.component';
import { PagoObject } from '../../interfaces/comun';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditSocioComponent } from '../dialog-edit-socio/dialog-edit-socio.component';

@Component({
  selector: 'app-lista-socios',
  standalone: true,
  templateUrl: './lista-socios.component.html',
  styleUrl: './lista-socios.component.css',
  imports: [
    CommonModule,
    ModalSocioComponent,
    ModalEliminarSocioComponent,
    FormsModule,
    ModalPagarCuotaComponent,
    MatIconModule
  ]
})
export class ListaSociosComponent implements OnInit, PipeTransform {

  listSocios: Socio[] = [];
  id: number | undefined;
  showModalFlag: boolean = false;
  showModalEliminarFlag: boolean = false;
  socioData: Socio = {
    numeroSocio: 0,
    nombre: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    localidad: '',
    borrado: '',
    primerApellido: '',
    segundoApellido: '',
    flag: 0,
    modificar: false,
    nuevoNumeroSocio: 0
  };
  socio!: Socio;
  apellidoFiltro!: string;
  dniFiltro!: string;
  showModalPagarFlag: boolean = false;
  numeroSocioAPagar!: number;
  pagarCuota!: PagarCuotaSocio;
  cuota!: number;
  pagoObj!: PagoObject;
  ultimoSocio!: Socio;

  constructor(private socioService: SocioService, private pagoService: PagoService, private dialog: MatDialog) { }

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    return items.filter(item => item.primerApellido.toLowerCase().includes(searchText.toLowerCase()));
  }

  ngOnInit(): void {
    this.GetAllSocios();
  }

  GetAllSocios() {
    this.socioService.getAllSocios()
      .subscribe(listSocios => {
        this.listSocios = listSocios.map(socioData => {
          if (socioData.direccion === "string") socioData.direccion = "";
          if (socioData.localidad === "string") socioData.localidad = "";
          if (socioData.fechaNacimiento === "string" || socioData.fechaNacimiento === "0001-01-01") socioData.fechaNacimiento = "";
          return socioData;
        });


        if (this.listSocios.length > 0) {
          this.listSocios.sort((a: Socio, b: Socio) => b.flag - a.flag);
          this.ultimoSocio = this.listSocios[0];

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
        }
      });
  }

  formatFecha(fecha: string): string {
    const fechaObj = new Date(fecha);

    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const año = fechaObj.getFullYear();

    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`;
    const fechaFormateada = `${dia}/${mesFormateado}/${año}`;

    return fechaFormateada;
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
        this.ShowModal(socioData);
      } else {
        console.error('No se encontraron datos para el número de socio:', numeroSocio);
      }
    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  ShowModal(socioData: Socio) {
    this.socioData = socioData;
    let fecha = new Date(this.socioData.fechaNacimiento);
    this.socioData.fechaNacimiento = fecha.toLocaleDateString();
  }

  HideModal() {
    this.showModalFlag = false;
  }

  async DeleteSocio(socio: Socio) {
    try {
      this.showModalEliminarFlag = true;
      this.ShowModalEliminar(socio);
    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  async PagarCuota(numeroSocio: number) {
    const pagoHecho = this.ComprobarPago(numeroSocio);
    if (await pagoHecho) {
      alert('Este socio ya tiene un pago registrado');
    }
    else {
      try {
        this.numeroSocioAPagar = numeroSocio;
        await this.numeroSocioAPagar;
        this.showModalPagarFlag = true;

      } catch (error) {
        console.error('Error al obtener datos del socio:', error);
      }
    }
  }
  async ComprobarPago(numeroSocio: number) {
    try {
      var pagoBuscado = await this.pagoService.getPagoSocio(numeroSocio).toPromise();
      return true;
    } 
    catch (error) {
      return false;
    }
  }

  HideModalPagar() {
    this.showModalPagarFlag = false;
  }

  ShowModalEliminar(socio: Socio) {
    this.socio = socio;
  }

  HideModalEliminar() {
    this.showModalEliminarFlag = false;
  }

  async confirmarEliminacion(numeroSocio: number) {
    try {
      await this.socioService.deleteSocio(numeroSocio).toPromise();
      this.HideModalEliminar();
      alert('Socio borrado con exito')
      window.location.reload();
    }
    catch {
      alert('No se ha podido borrar el socio.')
      this.HideModalEliminar();
      window.location.reload();
    }
  }
  async confirmarPagar(pagoObj: PagoObject) {
    try {
      await this.pagoService.agregarPago(pagoObj).toPromise();
      this.HideModalPagar();
      alert('Pago registrado con exito')
    }
    catch {
      alert('No se ha podido registrar el pago.')
      this.HideModalPagar();
    }
  }

  removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  EditSocio(id: number) {
    this.openSocioDialog(id);
  }

  openSocioDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogEditSocioComponent, {
      width: '400px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

}
