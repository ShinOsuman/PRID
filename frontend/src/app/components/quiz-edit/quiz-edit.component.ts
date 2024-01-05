import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Database } from "src/app/models/database";
import { Question } from "src/app/models/question";
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
    ctlIsPublished! : FormControl;
    ctlQuizType! : FormControl;
    ctlDatabase! : FormControl;
    ctlStartDate! : FormControl;
    ctlEndDate! : FormControl;
    quizHasAnswers = false;
    quizId!: number;
    selectedValue: string = "0";
    databases!: Database[];
    quiz!: Quiz;
    questions!: Question[];
    panelOpenState = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService
    ) {
        this.ctlName = this.formBuilder.control('', Validators.required);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlIsPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDatabase = this.formBuilder.control(0);
        this.ctlStartDate = this.formBuilder.control('', []);
        this.ctlEndDate = this.formBuilder.control('', []);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.quizId = this.route.snapshot.params.id;
        if(this.quizId != 0){
            this.quizService.getQuiz(this.quizId).subscribe(quiz => {
                if(quiz){
                    this.quiz = quiz;
                    this.questions = quiz.questions ?? [];
                    this.ctlDatabase.setValue(quiz?.database?.id ?? 0);
                    this.ctlName.setValue(quiz.name);
                    this.ctlDescription.setValue(quiz.description);
                    this.ctlIsPublished.setValue(quiz.isPublished);
                    this.ctlQuizType.setValue(quiz.isTest);
                    this.ctlStartDate.setValue(quiz.startDate);
                    this.ctlEndDate.setValue(quiz.endDate);
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

    addQuestion() {
        //crée une nouvelle question et l'ajoute à la liste des questions
        var question = new Question();
        question.order = this.questions.length + 1;
        this.questions.push(question);
    }

}