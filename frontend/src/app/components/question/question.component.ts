import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { QuestionService } from "src/app/services/question.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Question } from "src/app/models/question";


@Component({
    templateUrl: 'question.component.html'
})

export class QuestionComponent implements AfterViewInit, OnDestroy, OnInit {
    questionId!: number;
    question?: Question;


    constructor(
        private questionService: QuestionService,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar
    ){

    }

    ngOnInit(): void {
        this.questionId = this.route.snapshot.params.id;
    }

    ngAfterViewInit(): void {
        this.refresh();
    }

    ngOnDestroy(): void {
        
    }

    refresh(): void {
        this.questionService.getQuestion(this.questionId).subscribe(question => {
            this.question = question;
        })
    }
}