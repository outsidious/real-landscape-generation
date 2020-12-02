import { Component, OnDestroy, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BotherService } from '../bother/bother-service';

export interface DialogData {
  bounds: string;
  height: string[];
}

@Component({
  selector: 'app-dialog',
  templateUrl: 'dialog-component.html',
  styleUrls: ['./dialog-component.css'],
})
export class DialogComponent implements OnDestroy, OnInit {
  isLoaded: boolean;
  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private BotherService: BotherService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.loadInfo();
    this.BotherService.runBother(this.data.bounds);
  }

  loadInfo() {
    this.BotherService.botherSubject.subscribe((data) => {
      this.data.height = data;
      this.isLoaded = true;
    });
    this.isLoaded = false;
  }

  public close() {
    this.dialogRef.close();
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
