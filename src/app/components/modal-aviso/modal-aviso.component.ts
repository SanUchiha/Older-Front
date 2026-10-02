import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface ModalAvisoData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-modal-aviso',
  standalone: true,
  imports: [MatDialogModule, MatIconModule],
  templateUrl: './modal-aviso.component.html',
  styleUrl: './modal-aviso.component.css'
})
export class ModalAvisoComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalAvisoData) { }
}