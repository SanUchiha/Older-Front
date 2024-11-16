import { Component, OnInit } from '@angular/core';
import { Socio } from '../../interfaces/socio';
import { ReportesService } from '../../services/reportes.service';
import { Pago } from '../../interfaces/pago';
import { PDFDocument, rgb } from 'pdf-lib';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent implements OnInit {
  year!: string;
  numeroTotalSocios: number = 0;
  listSocios: Socio[] = [];
  dineroTotal: number = 0;
  listPagos: Pago[] = [];
  numeroTotalPagosAnioActual: number = 0;
  listaSociosConPagoActual!: Socio[];
  listaNumerosSocios!: number[];
  listaYear: number[] = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];

  yearSeleccionado: number = 2024;

  constructor(private reportesService: ReportesService) {
    this.year = new Date().getUTCFullYear().toLocaleString();
  }

  ngOnInit(): void {
    this.ObtenerDineroAnioActual();
    this.GetAllSocios();
    this.GetAllPagos();
  }

  GetAllSocios() {
    this.reportesService.ObtenerSocios().subscribe(
      (socios) => {
        this.listSocios = socios;
        this.numeroTotalSocios = this.listSocios.length;
      },
      (error) => {
        console.error('Error al obtener socios:', error);
      }
    );
  }

  GetAllPagos() {
    this.reportesService.ObtenerPagosAnualActual().subscribe((pagos) => {
      this.listPagos = pagos;
      //Eliminar los pagos dobles
      // Objeto para rastrear números de socios vistos
      const numerosSociosVistos: Record<number, boolean> = {};

      const arraySinDuplicados = this.listPagos
        .map((item) => {
          if (!numerosSociosVistos[item.numeroSocio]) {
            numerosSociosVistos[item.numeroSocio] = true;
            return item;
          }
          return null;
        })
        .filter((item) => item !== null);

      this.numeroTotalPagosAnioActual = arraySinDuplicados.length;

      for (let index = 0; index < arraySinDuplicados.length; index++) {
        const element = arraySinDuplicados[index];
        if (element) {
          this.dineroTotal += element.cuota;
        }
      }
    });
  }

  async ComprobarPagosSociosAnioActual() {
    await this.reportesService.ObtenerSociosConPagoActual().subscribe(
      (socios) => {
        this.listaSociosConPagoActual = socios;
        return this.listaSociosConPagoActual;
      },
      (error) => {
        console.error('Error al obtener socios:', error);
      }
    );
  }

  async ObtenerDineroAnioActual() {
    await this.listPagos;
    this.dineroTotal;
    for (let index = 0; index < this.listPagos.length; index++) {
      const element = this.listPagos[index];
      this.dineroTotal = +element.cuota;
    }
  }

  async ImprimirListaSociosYearSelecionado(yearSelected: number) {
    console.log('El año seleccionado es :' + this.yearSeleccionado);
    this.reportesService
      .ObtenerSociosConPagoYearSeleccionado(yearSelected)
      .subscribe(
        async (socios) => {
          this.listaSociosConPagoActual = socios;
          if (this.listSocios.length > 0) {
            this.listaSociosConPagoActual.sort((a: Socio, b: Socio) => {
              // Ordenar por primerApellido
              const comparacionPrimerApellido = a.primerApellido.localeCompare(
                b.primerApellido
              );

              // Si los primeros apellidos son iguales, ordenar por segundoApellido
              const comparacionSegundoApellido =
                comparacionPrimerApellido === 0
                  ? a.segundoApellido.localeCompare(b.segundoApellido)
                  : comparacionPrimerApellido;

              // Si los segundos apellidos son iguales, ordenar por nombre
              return comparacionSegundoApellido === 0
                ? a.nombre.localeCompare(b.nombre)
                : comparacionSegundoApellido;
            });
          }
          // Crear un nuevo documento PDF
          const pdfDoc = await PDFDocument.create();
          const limiteElementosPorPagina = 30;
          let elementosEnPagina = 0;
          let paginaActual = pdfDoc.addPage();

          // Definir dimensiones de la tabla
          const tableHeight = 22;
          const columnPositions = [50, 200, 350];

          //Titulo del reporte
          paginaActual.drawText(
            'Listado de socios ' +
              yearSelected +
              '\t\t\tTotal: ' +
              this.listaSociosConPagoActual.length,
            {
              x: 50,
              y: 785,
              color: rgb(0, 0.53, 0.71),
              size: 24,
            }
          );
          // Encabezado de la tabla
          let yPosition = 750;
          const headers = ['1º Apellido', '2º Apellido', 'Nombre'];
          for (let i = 0; i < headers.length; i++) {
            paginaActual.drawText(headers[i], {
              x: columnPositions[i],
              y: yPosition,
              color: rgb(0, 0, 0),
              size: 18,
            });
          }
          yPosition -= tableHeight;

          // Contenido de la tabla
          for (const socio of this.listaSociosConPagoActual) {
            if (elementosEnPagina === limiteElementosPorPagina) {
              elementosEnPagina = 0;

              paginaActual = pdfDoc.addPage();

              // Reestablecer la posición inicial para el nuevo encabezado
              yPosition = 770;
              // headers
              for (let i = 0; i < headers.length; i++) {
                paginaActual.drawText(headers[i], {
                  x: columnPositions[i],
                  y: yPosition,
                  color: rgb(0, 0, 0),
                  size: 18,
                });
              }
              yPosition -= tableHeight;
            }
            // Body
            for (let i = 0; i < headers.length; i++) {
              paginaActual.drawText(`${socio.primerApellido}`.toUpperCase(), {
                x: columnPositions[0],
                y: yPosition - tableHeight,
                size: 15,
              });
              paginaActual.drawText(`${socio.segundoApellido}`.toUpperCase(), {
                x: columnPositions[1],
                y: yPosition - tableHeight,
                size: 15,
              });
              paginaActual.drawText(`${socio.nombre}`.toUpperCase(), {
                x: columnPositions[2],
                y: yPosition - tableHeight,
                size: 15,
              });
              //paginaActual.drawText(`${socio.dni}`.toUpperCase(), { x: 50 + 3 * 100, y: yPosition - tableHeight, size: 10 });
              //paginaActual.drawText(`${socio.numeroSocio}`.toUpperCase(), { x: 50 + 4 * 100, y: yPosition - tableHeight, size: 10 });
            }
            yPosition -= tableHeight;
            elementosEnPagina++;
          }

          // Guardar el documento en un Blob
          const pdfBytes = await pdfDoc.save();

          // Crear un enlace para descargar el PDF
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `Listado de socios_${yearSelected}.pdf`;

          // Simular un clic en el enlace para iniciar la descarga
          link.click();

          return this.listaSociosConPagoActual;
        },
        (error) => {
          console.error('Error al obtener socios:', error);
        }
      );
  }
}
