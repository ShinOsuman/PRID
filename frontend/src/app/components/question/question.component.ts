import { Component, OnInit } from "@angular/core";
import { QuestionService } from "src/app/services/question.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Question } from "src/app/models/question";
import { Query } from "src/app/models/query";
import { MatDialog } from "@angular/material/dialog";
import { QuizClotureComponent } from "../quiz-cloture/quiz-cloture.component";
import { AttemptService } from "src/app/services/attempt.service";
import { Attempt } from "src/app/models/attempt";


@Component({
    templateUrl: 'question.component.html',
    styleUrls: ['./question.component.css']
})

export class QuestionComponent implements OnInit {
    questionId!: number;
    question?: Question;
    attempt?: Attempt;
    query?: Query;
    hasTestAnswer: boolean = false;
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

    private _clotureDisabled = true;
    get clotureDisabled(){
        return this._clotureDisabled;
    }
    set clotureDisabled(value: boolean) {
        this._clotureDisabled = value;
    }

    private _clotureVisible = true;
    get clotureVisible(){
        return this._clotureVisible;
    }
    set clotureVisible(value: boolean) {
        this._clotureVisible = value;
    }


    constructor(
        private questionService: QuestionService,
        private attemptService: AttemptService,
        private router: Router,
        private route: ActivatedRoute,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
    ){

    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.questionId = this.route.snapshot.params.id;
        this.questionService.getQuestion(this.questionId).subscribe(question => {
            this.question = question;
            this.sql = question?.answer?.sql ?? '';
            this.solutionsDisabled = true;
            if(this.question.answer){
                this.sendAction(true);
                if(this.question.quiz?.isTest){
                    this.hasTestAnswer = true;
                }
            }else {
                this.query = undefined;
                this.hasTestAnswer = false;
            }
            this.getAttempt();
            
        }) 
    }

    getAttempt(): void {
        this.attemptService.getAttempt(this.question?.quiz?.id ?? 0).subscribe(attempt => {
            if(attempt){
                this.attempt = attempt;
                this._clotureDisabled = false;
                this._clotureVisible = attempt.finish == null;
            }else {
                this.clotureVisible = true;
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
        this.solutionsDisabled = true;
        this.query = undefined;
    }

    showSolutions(){
        this.solutionsDisabled = false;
    }

    sendAction(isDisplay: boolean){
        this.questionService.evaluate(this.questionId, this.sql, isDisplay).subscribe(query => {
            this.query = query;
            if (!this.queryHasErrors()){
                this.solutionsDisabled = false;
            }else {
                this.solutionsDisabled = true;
            }
            this.getAttempt();
            if(this.question?.quiz?.isTest){
                this.hasTestAnswer = true;
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

    buttonsDisabled(): boolean {
        if(this.question?.answer && this.question?.quiz?.isTest){
            return false;
        }
        return true;
    }


    clotureAttempt(){
        const dlg = this.dialog.open(QuizClotureComponent);
        dlg.beforeClosed().subscribe(result => {
            if(result){
                this.attemptService.clotureAttempt(this.question?.quiz?.id ?? 0).subscribe(res =>
                    this.router.navigate(['/quizzes'])
                );
            }
        })
    }
}