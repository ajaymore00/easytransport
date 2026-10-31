import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmLabel: string;
  destructive: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <section class="app-form-dialog app-confirmation-dialog">
      <header class="app-form-dialog__header">
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <p class="app-form-dialog__subtitle">{{ data.message }}</p>
      </header>
      <mat-dialog-actions class="app-form-dialog__actions">
        <button type="button" class="app-button app-button--secondary" (click)="dialogRef.close(false)">
          Cancel
        </button>
        <button
          type="button"
          class="app-button"
          [class.app-button--primary]="!data.destructive"
          [class.app-button--danger]="data.destructive"
          (click)="dialogRef.close(true)"
        >
          {{ data.confirmLabel }}
        </button>
      </mat-dialog-actions>
    </section>
  `,
})
export class ConfirmationDialogComponent {
  readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent, boolean>);
}
