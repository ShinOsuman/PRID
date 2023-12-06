import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash-es";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";
import { StateService } from "src/app/services/state.service";
import { Router } from "@angular/router";

@Component({
    selector: 'quiz-list',
    templateUrl: './quiz-list.component.html',
    styleUrls: ['./quiz-list.component.css']
})
export class QuizListComponent implements AfterViewInit, OnDestroy, OnInit {
    displayedColumns: string []= [];
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    state: MatTableState;
    filter: string = '';

    @Input() quizType: 'test' | 'training' = 'test';

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private quizService: QuizService,
        private stateService: StateService,
        private router: Router,
        public snackBar: MatSnackBar
    ){
        this.state = this.stateService.quizListState;
    }
    
    ngOnInit(): void {
        this.displayedColumns = this.quizType === 'test'
        ? ['Nom', 'Base de données', 'Date début', 'Date fin', 'Statut', 'Evaluation', 'Actions']
        : ['Nom', 'Base de données', 'Statut', 'Actions']
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.state.bind(this.dataSource);

        this.refresh();
    }

    refresh(){
        if(this.quizType === 'training'){
            this.quizService.getTrainings().subscribe(quizzes => {
                this.dataSource.data = quizzes;
                this.state.restoreState(this.dataSource);
                this.filter=this.state.filter;
            })
        }else {
            this.quizService.getTests().subscribe(quizzes => {
                this.dataSource.data = quizzes;
                this.state.restoreState(this.dataSource);
                this.filter=this.state.filter;
            })
        }
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

    openQuiz(firstQuestionId: number): void {
        this.router.navigate(['/question/' + firstQuestionId]);
    }
}