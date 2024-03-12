import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  urlJustificante = 'https://www.centrosocial.somee.com/api/Pagos/DescargarJustificante/';
  urlCarnet = 'https://www.centrosocial.somee.com/api/Pagos/DescargarCarnet/';


  constructor(private http: HttpClient) { }

  async getCarnet(id: number){
    var url = this.urlCarnet + id;
    await window.open(url, '_blank');

  }

  async getJustificante(id: number){
    var url = this.urlJustificante + id;
    await window.open(url, '_blank');
  }
}
