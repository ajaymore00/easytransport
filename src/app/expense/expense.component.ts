import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Expense {
  id: number;
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
  ],
  templateUrl: './expense.component.html',
})
export class ExpenseComponent implements OnInit {
  @ViewChild('expenseDialog') expenseDialog!: TemplateRef<any>;

  expenses: Expense[] = [
    { id: 1, type: 'Petrol', amount: 1500, date: '2025-10-31', description: 'Fuel for Truck MH12AB1234' },
    { id: 2, type: 'Maintenance', amount: 2500, date: '2025-10-30', description: 'Oil change & servicing' },
  ];

  editingExpense: Expense | null = null;
  expenseForm: Partial<Expense> = {
    type: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    description: '',
  };

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openForm() {
    this.editingExpense = null;
    this.expenseForm = {
      type: '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
      description: '',
    };

    const ref = this.dialog.open(this.expenseDialog, { width: '500px' });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        const newExpense: Expense = {
          id: Date.now(),
          type: result.type || '',
          amount: result.amount || 0,
          date: result.date || new Date().toISOString().slice(0, 10),
          description: result.description || '',
        };
        this.expenses.push(newExpense);
      }
    });
  }

  editExpense(expense: Expense) {
    this.editingExpense = expense;
    this.expenseForm = { ...expense };

    const ref = this.dialog.open(this.expenseDialog, { width: '500px' });
    ref.afterClosed().subscribe((result) => {
      if (result) {
        Object.assign(expense, result);
      }
    });
  }

  deleteExpense(expense: Expense) {
    this.expenses = this.expenses.filter((e) => e.id !== expense.id);
  }


}
