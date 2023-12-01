import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Quiz } from 'src/app/models/quiz';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { StateService } from 'src/app/services/state.service';


@Component({
    selector: 'quizzes',
    templateUrl: 'quizzes.component.html',
    styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent{
    dataSource: MatTableDataSource<Quiz> = new MatTableDataSource();
    filter : string = '';
    state: MatTableState;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private stateService: StateService
    ) {
        // redirect to home if not logged
        if (!this.authenticationService.currentUser) {
            this.router.navigate(['/restricted']);
        }
        this.state = this.stateService.quizListState;
    }

    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }
}
