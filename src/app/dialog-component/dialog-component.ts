import { Component, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
    str: string;
}

@Component({
    selector: "app-dialog",
    templateUrl: "dialog-component.html",
    styleUrls: ["./dialog-component.css"],
})
export class DialogComponent implements OnDestroy {
    isLoaded: boolean;

    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}


    public close() {
        this.dialogRef.close();
    }

    setIsLoadedTrue() {
        this.isLoaded = true;
    }

    ngOnDestroy() {}
}
