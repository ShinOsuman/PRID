import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Quiz } from 'src/app/models/quiz';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    templateUrl: 'quiz-cloture.component.html'
})

export class QuizClotureComponent {
    constructor(
        public dialogRef: MatDialogRef<QuizClotureComponent>,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public data: {quiz: Quiz}) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onYesClick(): void {
        this.dialogRef.close();
        this.router.navigate(['/quizzes']);
    }
}