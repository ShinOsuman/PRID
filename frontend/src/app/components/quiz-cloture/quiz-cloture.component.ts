import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';


@Component({
    templateUrl: 'quiz-cloture.component.html'
})

export class QuizClotureComponent {

    constructor(
        public dialogRef: MatDialogRef<QuizClotureComponent>,
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