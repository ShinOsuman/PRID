import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';


@Component({
    templateUrl: 'quiz-delete.component.html'
})

export class QuizDeleteComponent {

    constructor(
        public dialogRef: MatDialogRef<QuizDeleteComponent>,
    )
    {
        
    }


    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }
}