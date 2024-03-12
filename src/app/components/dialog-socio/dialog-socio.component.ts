import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Socio } from '../../interfaces/socio';
import { FormBuilder, FormsModule, NgForm, Validators } from '@angular/forms';
import { SocioService } from '../../services/socio.service';
import { ListaSociosComponent } from '../lista-socios/lista-socios.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-socio',
  standalone: true,
  imports: [
    FormsModule,
    ListaSociosComponent,
    CommonModule
  ],
  templateUrl: './dialog-socio.component.html',
  styleUrl: './dialog-socio.component.css'
})
export class DialogSocioComponent implements OnInit {
  socio: Socio = {
    numeroSocio: 999,
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
  listaNumerosSocio: number[] = [];
  form!: NgForm;
  numeroSocioPermitido!: boolean;

  constructor(private dialogRef: MatDialogRef<DialogSocioComponent>, private socioService: SocioService, private formBuilder: FormBuilder) { }

  async ngOnInit(): Promise<void> {
    this.GetAllSocios();
  }

  ConseguirNumerosSocios(listSocios: Socio[]) {
    this.listaNumerosSocio = listSocios.map(socio => socio.numeroSocio);
    this.listaNumerosSocio = this.listaNumerosSocio.sort();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async GetAllSocios() {
    this.socioService.getAllSocios()
      .subscribe(listSocios => {
        this.listSocios = listSocios.map(socioData => {
          if (socioData.direccion === "string") socioData.direccion = "";
          if (socioData.localidad === "string") socioData.localidad = "";
          if (socioData.fechaNacimiento === "string" || socioData.fechaNacimiento === "0001-01-01") socioData.fechaNacimiento = "";

          return socioData;
        });
        if (this.listSocios.length > 0) {
          this.listSocios.sort();
          this.socio.numeroSocio = this.listSocios[this.listSocios.length - 1].numeroSocio + 1;
        }
        else {
          this.socio.numeroSocio = 0;
        }
        this.flagSocio = this.listSocios.length + 1;
      });
  }

  async guardarSocio() {
    if (this.socio.fechaNacimiento == '') this.socio.fechaNacimiento = '';
    else {
      if (this.socio.fechaNacimiento.includes('/')) {
        var partesFecha = this.socio.fechaNacimiento.split('/');
        var fecha = new Date();
        fecha.setFullYear(parseInt(partesFecha[2]));
        fecha.setMonth(parseInt(partesFecha[1]) - 1);
        fecha.setDate(parseInt(partesFecha[0]));
        this.socio.fechaNacimiento = fecha.toISOString().split('T')[0];
      }
      else if (this.socio.fechaNacimiento.includes('-')) {
        var partesFecha = this.socio.fechaNacimiento.split('-');
        var fecha = new Date();
        fecha.setFullYear(parseInt(partesFecha[2]));
        fecha.setMonth(parseInt(partesFecha[1]) - 1);
        fecha.setDate(parseInt(partesFecha[0]));
        this.socio.fechaNacimiento = fecha.toISOString().split('T')[0];
      }
    }
    if (this.socio.borrado == '') this.socio.borrado = 'NO';
    if (!this.flagSocio) this.socio.flag = 1;
    else this.socio.flag = this.flagSocio;

    var objStringify = JSON.stringify(this.socio);
    if (objStringify.includes('"fechaNacimiento":""')) {
      objStringify = objStringify.replace('"fechaNacimiento":""', '"fechaNacimiento":null');
    }

    try {
      console.log(objStringify)

      await this.socioService.agregarSocio(objStringify).toPromise();
      alert('Socio creado con exito.');
    }
    catch {
      alert('No se ha podido crear el socio.')
    }

    this.dialogRef.close();
  }

  validarNumeroSocio(numeroSocio: number) {
    if (this.listaNumerosSocio.includes(numeroSocio)) {
      this.numeroSocioPermitido = false
    }
    else {
      this.numeroSocioPermitido = true;
    }
  }

}
