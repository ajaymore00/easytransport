import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { DashboardService } from '../services/dashboard.service';
import { TripProfitabilityReport } from '../models/report.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements OnInit {
  startDate = this.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  endDate = this.formatDate(new Date());
  report: TripProfitabilityReport | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  get totalTripCosts(): number {
    if (!this.report) return 0;
    return this.report.totalFuelCost
      + this.report.totalTollCost
      + this.report.totalDriverCost
      + this.report.totalOtherCost;
  }

  get totalCosts(): number {
    return this.totalTripCosts;
  }

  get totalProfit(): number {
    return (this.report?.totalRevenue ?? 0) - this.totalCosts - (this.report?.totalExpenses ?? 0);
  }

  loadReport(): void {
    if (!this.startDate || !this.endDate || this.startDate > this.endDate) {
      this.errorMessage = 'Choose a valid date range. The start date must be before the end date.';
      this.report = null;
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.dashboardService.getTripProfitabilityReport(this.startDate, this.endDate).subscribe({
      next: (report) => {
        this.report = report;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Failed to load trip profitability report:', error);
        this.report = null;
        this.errorMessage = error instanceof HttpErrorResponse && typeof error.error?.message === 'string'
          ? error.error.message
          : 'Could not load the report. Please try again.';
        this.isLoading = false;
      },
    });
  }

  exportCsv(): void {
    if (!this.report) return;

    const header = [
      'Trip number', 'Trip name', 'From', 'To', 'Date', 'Status', 'Distance (km)',
      'Revenue (INR)', 'Fuel (INR)', 'Tolls (INR)', 'Driver pay (INR)',
      'Other costs (INR)', 'Total costs (INR)', 'Estimated profit (INR)',
    ];
    const rows = this.report.trips.map((trip) => [
      trip.routeNo, trip.routeName, trip.startLocation, trip.endLocation, trip.date,
      trip.status, trip.distanceKm, trip.revenue, trip.fuelCost, trip.tollCost,
      trip.driverCost, trip.otherCost, trip.totalCosts, trip.profit,
    ]);
    const summaryRow = (label: string, amount: number): (string | number)[] => {
      const row: (string | number)[] = Array(header.length).fill('');
      row[0] = label;
      row[row.length - 1] = amount;
      return row;
    };
    const summaryRows = [
      summaryRow('Total revenue (INR)', this.report.totalRevenue),
      summaryRow('Fuel (INR)', this.report.totalFuelCost),
      summaryRow('Tolls (INR)', this.report.totalTollCost),
      summaryRow('Driver pay (INR)', this.report.totalDriverCost),
      summaryRow('Other trip costs (INR)', this.report.totalOtherCost),
      summaryRow('Trip costs (INR)', this.totalTripCosts),
      summaryRow('Expenses (INR)', this.report.totalExpenses),
      summaryRow('Total costs (INR)', this.totalCosts),
      summaryRow('Estimated profit (INR)', this.totalProfit),
    ];
    const csv = [header, ...rows, Array(header.length).fill(''), ...summaryRows]
      .map((row) => row.map((value) => this.csvCell(value)).join(','))
      .join('\r\n');
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-profitability-${this.startDate}-to-${this.endDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  exportPdf(): void {
    if (!this.report) return;

    const report = this.report;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const navy: [number, number, number] = [15, 23, 42];
    const cyan: [number, number, number] = [6, 182, 212];
    const muted: [number, number, number] = [100, 116, 139];
    const border: [number, number, number] = [226, 232, 240];

    pdf.setFillColor(...navy);
    pdf.rect(0, 0, pageWidth, 38, 'F');
    pdf.setFillColor(...cyan);
    pdf.rect(0, 36, pageWidth, 2, 'F');
    pdf.setFillColor(...cyan);
    pdf.roundedRect(margin, 8, 24, 21, 3, 3, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('KFQ', margin + 12, 21, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setTextColor(165, 243, 252);
    pdf.text('TRANSPORTER NAME', margin + 31, 12);
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text('KFQ', margin + 31, 18);
    pdf.setFontSize(18);
    pdf.text('Trip Profitability Report', margin + 31, 27);
    pdf.setFontSize(9);
    pdf.setTextColor(226, 232, 240);
    pdf.text(`REPORT PERIOD   ${report.startDate}  to  ${report.endDate}`, pageWidth - margin, 18, {
      align: 'right',
    });

    const summary = [
      { label: 'TRIPS INCLUDED', value: String(report.tripCount), accent: [6, 182, 212] as [number, number, number] },
      { label: 'TOTAL REVENUE', value: `INR ${this.formatAmount(report.totalRevenue)}`, accent: [37, 99, 235] as [number, number, number] },
      { label: 'TRIP COSTS', value: `INR ${this.formatAmount(this.totalTripCosts)}`, accent: [245, 158, 11] as [number, number, number] },
      { label: 'EXPENSES', value: `INR ${this.formatAmount(report.totalExpenses)}`, accent: [139, 92, 246] as [number, number, number] },
      { label: 'ESTIMATED PROFIT', value: `INR ${this.formatAmount(this.totalProfit)}`, accent: [16, 185, 129] as [number, number, number] },
    ];
    const cardGap = 3;
    const cardWidth = (contentWidth - cardGap * (summary.length - 1)) / summary.length;
    summary.forEach((item, index) => {
      const x = margin + index * (cardWidth + cardGap);
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(...border);
      pdf.roundedRect(x, 44, cardWidth, 22, 2, 2, 'FD');
      pdf.setFillColor(...item.accent);
      pdf.roundedRect(x, 44, 2, 22, 1, 1, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.5);
      pdf.setTextColor(...muted);
      pdf.text(item.label, x + 5, 51);
      pdf.setFontSize(9);
      pdf.setTextColor(...navy);
      pdf.text(pdf.splitTextToSize(item.value, cardWidth - 8), x + 5, 59);
    });

    const columns = [
      { title: 'Trip', width: 40 },
      { title: 'Date', width: 22 },
      { title: 'Status', width: 24 },
      { title: 'Revenue', width: 28 },
      { title: 'Fuel', width: 24 },
      { title: 'Tolls', width: 24 },
      { title: 'Driver', width: 27 },
      { title: 'Other', width: 24 },
      { title: 'Trip costs', width: 29 },
      { title: 'Profit', width: 30 },
    ];
    const tableWidth = columns.reduce((total, column) => total + column.width, 0);
    const tableX = Math.max(margin, (pageWidth - tableWidth) / 2);
    const drawTableHeader = (top: number, includeTitle: boolean): number => {
      if (includeTitle) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(...navy);
        pdf.text('Trip breakdown', tableX, top);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...muted);
        pdf.text(`${report.trips.length} trips  |  Amounts in INR`, pageWidth - margin, top, { align: 'right' });
        top += 5;
      }

      pdf.setFontSize(7.5);
      pdf.setFont('helvetica', 'bold');
      let x = tableX;
      for (const column of columns) {
        pdf.setFillColor(...navy);
        pdf.rect(x, top, column.width, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.text(column.title, x + 1.5, top + 5.3);
        x += column.width;
      }
      pdf.setFont('helvetica', 'normal');
      return top + 8;
    };

    let y = drawTableHeader(72, true);
    if (report.trips.length === 0) {
      pdf.setFontSize(9);
      pdf.setTextColor(...muted);
      pdf.text('No trips found in this date range.', tableX, y + 7);
    }

    report.trips.forEach((trip, rowIndex) => {
      const values = [
        `${trip.routeNo} - ${trip.routeName}`,
        trip.date,
        trip.status,
        this.formatAmount(trip.revenue),
        this.formatAmount(trip.fuelCost),
        this.formatAmount(trip.tollCost),
        this.formatAmount(trip.driverCost),
        this.formatAmount(trip.otherCost),
        this.formatAmount(trip.totalCosts),
        this.formatAmount(trip.profit),
      ];
      const lines = values.map((value, index) =>
        pdf.splitTextToSize(value, columns[index].width - 3) as string[],
      );
      const rowHeight = Math.max(8, ...lines.map((cellLines) => cellLines.length * 3.5 + 2));
      if (y + rowHeight > pageHeight - margin) {
        pdf.addPage();
        y = drawTableHeader(margin, false);
      }

      if (rowIndex % 2 === 1) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(tableX, y, tableWidth, rowHeight, 'F');
      }

      let x = tableX;
      for (let index = 0; index < columns.length; index += 1) {
        pdf.setDrawColor(...border);
        pdf.line(x, y + rowHeight, x + columns[index].width, y + rowHeight);
        pdf.setFontSize(7);
        pdf.setTextColor(...navy);
        pdf.text(lines[index], x + 1.5, y + 3.5);
        x += columns[index].width;
      }
      y += rowHeight;
    });

    const pageCount = pdf.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      pdf.setPage(page);
      pdf.setDrawColor(...border);
      pdf.line(margin, pageHeight - 8, pageWidth - margin, pageHeight - 8);
      pdf.setFontSize(7);
      pdf.setTextColor(...muted);
      pdf.text('KFQ  |  Trip Profitability Report', margin, pageHeight - 4);
      pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 4, { align: 'right' });
    }

    pdf.save(`trip-profitability-${this.startDate}-to-${this.endDate}.pdf`);
  }

  private formatAmount(amount: number): string {
    return Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private csvCell(value: string | number): string {
    let text = String(value ?? '');
    if (typeof value === 'string' && /^[\s]*[=+\-@]/.test(value)) {
      text = `'${text}`;
    }
    return `"${text.replace(/"/g, '""')}"`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
