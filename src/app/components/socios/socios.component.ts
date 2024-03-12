import { Component } from '@angular/core';
import { ListaSociosComponent } from '../lista-socios/lista-socios.component';

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [
    ListaSociosComponent
  ],
  templateUrl: './socios.component.html',
  styleUrl: './socios.component.css'
})
export class SociosComponent {

}
