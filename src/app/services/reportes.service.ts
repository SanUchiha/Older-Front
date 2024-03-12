import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagoService } from './pago.service';
import { SocioService } from './socio.service';
import { Socio } from '../interfaces/socio';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private urlBaseServiciosPagos = "https://www.centrosocial.somee.com/api/pagos/";
  private urlBaseServiciosSocios = "https://www.centrosocial.somee.com/api/socios/";

  constructor(private http: HttpClient, private pagoService: PagoService, private socioService: SocioService) { }

  //Obtener todos los pagos del año acutal.
  ObtenerPagosAnualActual() {
    return this.pagoService.mostrarTodosPagos();
  }

  //Obtener los socios que tienen un pago en el año actual
  ObtenerSociosConPagoActual(): Observable<Socio[]> {
    const url = this.urlBaseServiciosPagos + "ComprobarPagoSocios"
    return this.http.get<Socio[]>(url);
  }

  //Obtener los socios que tienen un pago en el año actual
  ObtenerSociosConPagoYearSeleccionado(year: number): Observable<Socio[]> {
    const url = this.urlBaseServiciosPagos + "ComprobarPagoSociosPorYear/" + year;
    return this.http.get<Socio[]>(url);
  }  

  //Obtener todos los socios de la base de datos.
  ObtenerSocios() {
    return this.socioService.getAllSocios();
   }

  //Obtener todos los pagos por año filtrado
  ObtenerPagosAnualFiltrado() { }

}
