import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogSocioComponent } from '../dialog-socio/dialog-socio.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DialogSocioComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private dialog: MatDialog, private router: Router) {

  }

  openSocioDialog(): void {
    const dialogRef = this.dialog.open(DialogSocioComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  goToPagar(){
    this.router.navigate(["socios"])
  }

  goToCarnet(){
    this.router.navigate(["pagos"])
  }
}
