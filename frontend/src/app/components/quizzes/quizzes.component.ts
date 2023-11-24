import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
    selector: 'quizzes',
    templateUrl: 'quizzes.component.html'
})
export class QuizzesComponent{
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if not logged
        if (!this.authenticationService.currentUser) {
            this.router.navigate(['/']);
        }
    }
}
