import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socio, SocioData } from '../interfaces/socio';


@Injectable({
  providedIn: 'root'
})

export class SocioService {

  urlListarSocios = 'https://www.centrosocial.somee.com/api/Socios/ListarTodosSocios';
  urlSocios = 'https://www.centrosocial.somee.com/api/Socios/';

  constructor(private http: HttpClient) { }

  getAllSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.urlListarSocios);
  }

  getSocio(id: number): Observable<Socio> {
    var url = this.urlSocios + 'ConseguirSocio/' + id;
    return this.http.get<Socio>(url);
  }

  deleteSocio(id: number): Observable<SocioData> {
    var url = this.urlSocios + 'EliminarSocio/' + id;
    return this.http.delete<SocioData>(url);
  }

  agregarSocio(socioJson:string): Observable<Socio> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var url = this.urlSocios + 'AgregarSocio';
    

    return this.http.post<Socio>(url, socioJson, { headers });
  }

  
}
