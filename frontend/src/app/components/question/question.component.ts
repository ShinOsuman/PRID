import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { QuestionService } from "src/app/services/question.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Question } from "src/app/models/question";
import { Query } from "src/app/models/query";


@Component({
    templateUrl: 'question.component.html',
    styleUrls: ['./question.component.css']
})

export class QuestionComponent implements AfterViewInit, OnDestroy, OnInit {
    questionId!: number;
    question?: Question;
    query?: Query;
    private _sql: string = '';
    get sql(){
        return this._sql;
    }
    set sql(value: string) {
        this._sql = value;
        this.deleteActivated = this.sql != '';
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
            this.sql = question?.answer?.sql ?? '';
            this.solutionsDisabled = true;
            if(this.question.answer){
                this.sendAction();
            }else {
                this.query = undefined;
            }
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
        this.sql = '';
    }

    showSolutions(){
        this.solutionsDisabled = false;
    }

    sendAction(){
        this.questionService.evaluate(this.questionId, this.sql).subscribe(query => {
            this.query = query;
            if (!this.queryHasErrors()){
                this.solutionsDisabled = false;
            }else {
                this.solutionsDisabled = true;
            }
        });
    }

    queryHasErrors(): boolean {
        return (this.query?.comments?.length ?? 0) > 0;
    }

    queryHasData(): boolean {
        return (this.query?.data?.length ?? 0) > 0;
    }
    
    queryHasColLineErrors(){
        return this.query?.badResults?.length ?? 0 > 0;
    }
}