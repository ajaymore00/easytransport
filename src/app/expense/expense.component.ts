import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './expense.component.html',
})
export class ExpenseComponent {
  expenses: Expense[] = [
    { id: 1, type: 'Petrol', amount: 1500, date: '2025-10-31', description: 'Fuel for Truck MH12AB1234' },
    { id: 2, type: 'Maintenance', amount: 2500, date: '2025-10-30', description: 'Oil change & servicing' },
  ];

  showForm = false;
  editingExpense: Expense | null = null;
  expenseForm: Partial<Expense> = {};

  openForm() {
    this.showForm = true;
    this.editingExpense = null;
    this.expenseForm = {};
  }

  closeForm() {
    this.showForm = false;
  }

  editExpense(expense: Expense) {
    this.showForm = true;
    this.editingExpense = expense;
    this.expenseForm = { ...expense };
  }

  deleteExpense(expense: Expense) {
    this.expenses = this.expenses.filter((e) => e.id !== expense.id);
  }

  saveExpense() {
    if (this.editingExpense) {
      Object.assign(this.editingExpense, this.expenseForm);
    } else {
      const newExpense: Expense = {
        id: Date.now(),
        type: this.expenseForm.type || '',
        amount: this.expenseForm.amount || 0,
        date: this.expenseForm.date || new Date().toISOString().slice(0, 10),
        description: this.expenseForm.description || '',
      };
      this.expenses.push(newExpense);
    }
    this.closeForm();
  }
}
