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
    previousQuery: string = "";
    private _query: string = '';
    get query(){
        return this._query;
    }
    set query(value: string) {
        this._query = value;
        this.deleteActivated = this.query != '';
    }

    get dbName(){
        return this.question?.quiz?.database?.name ?? '';
    }
    private _deleteActivated: boolean = false;
    get deleteActivated(){
        return this._deleteActivated;
    }
    set deleteActivated(value: boolean) {
        this._deleteActivated = value;
    }

    private _solutionsDisabled = true;
    get solutionsDisabled(){
        return this._solutionsDisabled;
    }
    set solutionsDisabled(value: boolean) {
        this._solutionsDisabled = value;
    }


    constructor(
        private questionService: QuestionService,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar
    ){

    }

    ngOnInit(): void {
        this.refresh();
    }

    ngAfterViewInit(): void {
    }

    ngOnDestroy(): void {
        
    }

    refresh(): void {
        this.questionId = this.route.snapshot.params.id;
        this.questionService.getQuestion(this.questionId).subscribe(question => {
            this.question = question;
            this.query = question?.answer ?? '';
            this.previousQuery = this.query;
            this.solutionsDisabled = true;
        })
    }

    goToPreviousQuestion(): void {
        if(this.question?.previousQuestion) {
            this.router.navigate(['/question/' + this.question.previousQuestion]).then(() => {this.refresh();});
        }
    }

    goToNextQuestion(): void {
        if (this.question?.nextQuestion) {
            this.router.navigate(['/question/' + this.question.nextQuestion]).then(() => { this.refresh(); });
        }
    }

    isTest(): boolean {
        return this.question?.isTest ?? false;
    }

    delete() {
        this.query = '';
    }

    showSolutions(){
        this.solutionsDisabled = false;
    }
}