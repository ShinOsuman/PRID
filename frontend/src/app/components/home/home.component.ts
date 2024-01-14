import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUser) {
        this.router.navigate(['/quizzes']);
    }
}
}
