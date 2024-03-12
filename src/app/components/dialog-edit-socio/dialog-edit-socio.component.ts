import { Component, Inject, Input } from '@angular/core';
import { Socio } from '../../interfaces/socio';
import { DialogSocioComponent } from '../dialog-socio/dialog-socio.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SocioService } from '../../services/socio.service';
import { FormsModule } from '@angular/forms';
import { ListaSociosComponent } from '../lista-socios/lista-socios.component';

@Component({
  selector: 'app-dialog-edit-socio',
  standalone: true,
  imports: [
    FormsModule,
    ListaSociosComponent
  ],
  templateUrl: './dialog-edit-socio.component.html',
  styleUrl: './dialog-edit-socio.component.css'
})
export class DialogEditSocioComponent {

  socioEncontrado: Socio = {
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

  listSocios: Socio[] = [];
  flagSocio!: number;
  antiguoNumeroSocio!: number;

  constructor(
    private dialogRef: MatDialogRef<DialogSocioComponent>,
    private socioService: SocioService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }) { }

  ngOnInit(): void {
    this.GetDataSocio(this.data.id);
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
        this.listSocios.sort((a: Socio, b: Socio) => a.nombre.localeCompare(b.nombre));
        this.flagSocio = this.listSocios.length + 1;
      });
  }

  async GetDataSocio(numeroSocio: number) {
    try {
      var socioBuscado = await this.socioService.getSocio(numeroSocio).toPromise();

      if (socioBuscado) {
        this.socioEncontrado = socioBuscado;
        // Establecer "borrado" a "NO"
        this.socioEncontrado.borrado = "NO";

        // Formatear la fecha en dd/mm/aaaa
        const fechaNacimiento = new Date(this.socioEncontrado.fechaNacimiento);
        const fechaFormateada = `${fechaNacimiento.getDate()}/${fechaNacimiento.getMonth() + 1}/${fechaNacimiento.getFullYear()}`;
        this.socioEncontrado.fechaNacimiento = fechaFormateada;
        console.log(socioBuscado)
        this.antiguoNumeroSocio = socioBuscado.numeroSocio;
        console.log(this.antiguoNumeroSocio)
      }

    } catch (error) {
      console.error('Error al obtener datos del socio:', error);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async guardarSocio() {
    if (this.socioEncontrado.fechaNacimiento == '') this.socioEncontrado.fechaNacimiento = '';
    else {
      if (this.socioEncontrado.fechaNacimiento.includes('/')) {
        var partesFecha = this.socioEncontrado.fechaNacimiento.split('/');
        var fecha = new Date();
        fecha.setFullYear(parseInt(partesFecha[2]));
        fecha.setMonth(parseInt(partesFecha[1]) - 1);
        fecha.setDate(parseInt(partesFecha[0]));
        this.socioEncontrado.fechaNacimiento = fecha.toISOString().split('T')[0];
      }
      else if (this.socioEncontrado.fechaNacimiento.includes('-')) {
        var partesFecha = this.socioEncontrado.fechaNacimiento.split('-');
        var fecha = new Date();
        fecha.setFullYear(parseInt(partesFecha[2]));
        fecha.setMonth(parseInt(partesFecha[1]) - 1);
        fecha.setDate(parseInt(partesFecha[0]));
        this.socioEncontrado.fechaNacimiento = fecha.toISOString().split('T')[0];
      }
    }
    if (this.socioEncontrado.borrado == '') this.socioEncontrado.borrado = 'NO';
    this.socioEncontrado.modificar = true;
    this.socioEncontrado.nuevoNumeroSocio = this.socioEncontrado.numeroSocio;
    this.socioEncontrado.numeroSocio = this.antiguoNumeroSocio;

    var objStringify = JSON.stringify(this.socioEncontrado);
    if (objStringify.includes('"fechaNacimiento":""')) {
      objStringify = objStringify.replace('"fechaNacimiento":""', '"fechaNacimiento":null');
    }


    try {
      console.log(objStringify)
      await this.socioService.agregarSocio(objStringify).toPromise();
      alert('Socio modificado con exito.');
      window.location.reload();
    }
    catch {
      alert('No se ha podido modificar el socio.')
      window.location.reload();
    }

    this.dialogRef.close();
  }
}
