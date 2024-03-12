import { Component } from '@angular/core';
import { ListaPagosComponent } from '../lista-pagos/lista-pagos.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [ListaPagosComponent],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent {

}
