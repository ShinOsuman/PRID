import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import * as _ from "lodash-es";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatTableState } from "src/app/helpers/mattable.state";
import { Quiz } from "src/app/models/quiz";
import { QuizService } from "src/app/services/quiz.service";
import { StateService } from "src/app/services/state.service";

@Component({
    selector: 'training-quiz-list',
    templateUrl: './training-quiz-list.component.html',
    styleUrls: ['./training-quiz-list.component.css']
})
export class TrainingQuizListComponent implements AfterViewInit, OnDestroy {
    displayedColumns: string [] = ['Nom', 'Base de données', 'Statut', 'Actions'];
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    state: MatTableState;
    filter: string = '';

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private quizService: QuizService,
        private stateService: StateService,
        public snackBar: MatSnackBar
    ){
        this.state = this.stateService.quizListState;
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.state.bind(this.dataSource);

        this.refresh();
    }

    refresh(){
        this.quizService.getTrainings().subscribe(quizzes => {
            this.dataSource.data = quizzes;
            this.state.restoreState(this.dataSource);
            this.filter=this.state.filter;
        })
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}