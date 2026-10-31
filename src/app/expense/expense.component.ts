import { Component, ViewChild, TemplateRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardService } from '../services/dashboard.service';
import { RouterModule } from '@angular/router';
import { ConfirmationService } from '../services/confirmation.service';

interface Expense {
  id?: number;
  _id?: string;
  type: string;
  amount: number;
  date: string;
  description: string;
}

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
   RouterModule,
    ReactiveFormsModule,
  ],
  templateUrl: './expense.component.html',
})
export class ExpenseComponent implements OnInit {
  @ViewChild('expenseDialog') expenseDialog!: TemplateRef<any>;

  expenses: any[] = [];

  editingExpense: any = null;
  private confirmation = inject(ConfirmationService);
  expenseForm: any = {
    type: '',
    amount: 0,
    date: new Date(),
    description: '',
  };

  constructor(private dialog: MatDialog, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    this.dashboardService.getData('expenses').subscribe({
      next: (data: any) => {
        this.expenses = Array.isArray(data) ? data : [];
      },
      error: (err) => {
        console.error('Error fetching expenses:', err);
      },
    });
  }

  openForm() {
    this.editingExpense = null;
    this.expenseForm = {
      type: '',
      amount: 0,
      date: new Date(),
      description: '',
    };

    const ref = this.dialog.open(this.expenseDialog, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const date = this.formatExpenseDate(result.date);
        if (!date) {
          console.error('Cannot create expense: invalid date.');
          return;
        }

        const payload = {
          type: result.type || '',
          amount: result.amount || 0,
          date,
          description: result.description || '',
        };

        this.dashboardService.addData('expenses', payload).subscribe({
          next: (created: any) => this.expenses.push(created),
          error: (err: any) => console.error('Create expense failed', err),
        });
      }
    });
  }

  confirmSaveExpense(form: NgForm, dialogRef: MatDialogRef<unknown>) {
    if (form.invalid) return;

    const action = this.editingExpense ? 'update' : 'create';
    this.confirmation.confirm(
      `${action === 'update' ? 'Update' : 'Create'} expense?`,
      `Are you sure you want to ${action} this expense?`,
      action === 'update' ? 'Update expense' : 'Create expense',
    ).subscribe((confirmed) => {
      if (confirmed) dialogRef.close(form.value);
    });
  }

  editExpense(expense: Expense) {
    this.editingExpense = expense;
    this.expenseForm = { ...expense, date: this.parseExpenseDate(expense.date) };

    const ref = this.dialog.open(this.expenseDialog, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const id = expense._id || expense.id;
        const date = this.formatExpenseDate(result.date);
        if (!date) {
          console.error('Cannot update expense: invalid date.');
          return;
        }

        const payload = { ...result, date };
        if (!id) {
          Object.assign(expense, payload);
          return;
        }

        this.dashboardService.updateData('expenses', String(id), payload).subscribe({
          next: (updated: any) => Object.assign(expense, updated),
          error: (err: any) => console.error('Update expense failed', err),
        });
      }
    });
  }

  private parseExpenseDate(value: string | Date | null | undefined): Date | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (!value) return null;

    const datePart = value.match(/^(\d{4})-(\d{2})-(\d{2})/)?.slice(1);
    if (datePart) {
      const [year, month, day] = datePart.map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        ? date
        : null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private formatExpenseDate(value: string | Date | null | undefined): string | null {
    const date = this.parseExpenseDate(value);
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteExpense(expense: Expense) {
    this.confirmation.confirm('Delete expense?', 'Are you sure you want to delete this expense?', 'Delete expense', true)
      .subscribe((confirmed) => {
        if (!confirmed) return;

        const id = (expense as any)._id || (expense as any).id;
        if (!id) {
          this.expenses = this.expenses.filter((e) => e !== expense);
          return;
        }

        this.dashboardService.deleteData('expenses', String(id)).subscribe({
          next: () => (this.expenses = this.expenses.filter((e) => (e._id || e.id) !== id)),
          error: (err: any) => console.error('Delete expense failed', err),
        });
    });
  }


}
