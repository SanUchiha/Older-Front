import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModificarPago, Pago, PagoSocio } from '../interfaces/pago';
import { Socio } from '../interfaces/socio';
import { PagoObject } from '../interfaces/comun';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  urlListarPagos = 'https://www.centrosocial.somee.com/api/Pagos/ComprobarPagoSocios';
  urlPagos = 'https://www.centrosocial.somee.com/api/pagos/';

  constructor(private http: HttpClient) { }

  getAllPagos(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.urlListarPagos);
  }

  mostrarTodosPagos(): Observable<Pago[]> {
    var url = this.urlPagos + 'MostrarPagosActual'
    return this.http.get<Pago[]>(url);
  }

  getPagoSocio(id: number) {
    var url = this.urlPagos + 'ComprobarPagoSocio/' + id;
    return this.http.get<PagoSocio>(url);
  }

  agregarPago(pago: PagoObject): Observable<PagoObject> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var url = this.urlPagos + 'AgregarPago';

    return this.http.post<PagoObject>(url, pago, { headers });

  }

  editPago(modificarPago: ModificarPago): Observable<string> {
    const url = `${this.urlPagos}editarpago/${modificarPago.pagoId}`;
    //let urlLocal = "https://localhost:7024/api/Pagos/EditarPago/" + modificarPago.pagoId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let json = JSON.stringify(modificarPago)
    return this.http.put<string>(url, json, { headers });
  }


  deletePago(id: number): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.urlPagos}EliminarPago/${id}`;

    return this.http.delete<string>(url, { headers });
  }

}
