import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog-component/dialog-component';

@Injectable({ providedIn: 'root' })
export class BotherService {
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  private openDialog(inStr) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        str: inStr,
      },
      width: 'auto',
    });
  }

  runBother(bounds) {
    this.http
      .get(environment.backend + '/bother/?bounds=' + bounds)
      .subscribe((data: string[]) => {
        console.log(data);
        this.openDialog("is working!");
      });
  }
}
