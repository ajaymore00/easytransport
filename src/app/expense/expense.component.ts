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
    date: new Date().toISOString().slice(0, 10),
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
      date: new Date().toISOString().slice(0, 10),
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
        const payload = {
          type: result.type || '',
          amount: result.amount || 0,
          date: result.date || new Date().toISOString().slice(0, 10),
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
    this.expenseForm = { ...expense };

    const ref = this.dialog.open(this.expenseDialog, {
      width: '720px',
      maxWidth: 'calc(100vw - 32px)',
      maxHeight: '90vh',
      panelClass: 'app-form-dialog-panel',
    });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const id = expense._id || expense.id;
        if (!id) {
          Object.assign(expense, result);
          return;
        }

        this.dashboardService.updateData('expenses', String(id), result).subscribe({
          next: (updated: any) => Object.assign(expense, updated),
          error: (err: any) => console.error('Update expense failed', err),
        });
      }
    });
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
