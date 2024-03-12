import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagar-cuota',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './pagar-cuota.component.html',
  styleUrl: './pagar-cuota.component.css'
})
export class PagarCuotaComponent {

  // Datos simulados de socios (puedes obtenerlos de tu servicio)
  socios = [
    { id: 1, nombre: 'Socio 1', dni: '12345678' },
    { id: 2, nombre: 'Socio 2', dni: '87654321' },
    // ... otros socios
  ];

  selectedSocio: number | undefined;
  socioData: { nombre: string, dni: string } = { nombre: '', dni: '' };
  cuota: string = '';

  loadSocioData() {
    // Aquí puedes cargar los datos del socio seleccionado desde tu servicio
    if (this.selectedSocio) {
      const selectedSocio = this.socios.find(socio => socio.id === this.selectedSocio);
      if (selectedSocio) {
        this.socioData.nombre = selectedSocio.nombre;
        this.socioData.dni = selectedSocio.dni;
      }
    }
  }

  cancelarPago() {
    // Limpia los campos y cancela la acción
    this.selectedSocio = undefined;
    this.socioData = { nombre: '', dni: '' };
    this.cuota = '';
  }
}
