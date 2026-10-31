import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private readonly dialog = inject(MatDialog);

  confirm(
    title: string,
    message: string,
    confirmLabel = 'Confirm',
    destructive = false,
  ): Observable<boolean> {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      panelClass: 'app-confirmation-dialog-panel',
      role: 'alertdialog',
      autoFocus: 'dialog',
      data: { title, message, confirmLabel, destructive },
    }).afterClosed().pipe(map((confirmed) => confirmed === true));
  }
}
