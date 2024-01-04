import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Database } from "src/app/models/database";
import { Quiz } from "src/app/models/quiz";
import { DatabaseService } from "src/app/services/database.service";
import { QuizService } from "src/app/services/quiz.service";


@Component({
    selector: 'quiz-edit',
    templateUrl: './quiz-edit.component.html'
})

export class QuizEditComponent implements OnInit {
    quizEditForm! : FormGroup;

    ctlName! : FormControl;
    ctlDescription! : FormControl;
    selectedDatabase = 0;
    isPublished = false;
    quizHasAnswers = false;
    quizId!: number;
    selectedValue: string = "0";
    databases!: Database[];
    quiz!: Quiz;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService
    ) {

    }

    ngOnInit(): void {
        this.ctlName = this.formBuilder.control('', Validators.required);
        this.ctlDescription = this.formBuilder.control('', Validators.required);
        this.refresh();
    }

    refresh() {
        this.quizId = this.route.snapshot.params.id;
        if(this.quizId != 0){
            this.quizService.getQuiz(this.quizId).subscribe(quiz => {
                if(quiz){
                    this.quiz = quiz;
                    this.selectedDatabase = quiz?.database?.id ?? 0;
                    this.ctlName.setValue(quiz.name);
                    this.ctlDescription.setValue(quiz.description);
                }
            });
        }

        this.databaseService.getDatabases().subscribe(databases => {
            if(databases){
                this.databases = databases;
            }
        });

        
    }

    onSubmit() {
        //TODO
    }
}