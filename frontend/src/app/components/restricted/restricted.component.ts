import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'app-restricted',
    template: `
    <h1>Restricted Access</h1>
    <p>You will be redirected automatically to the home page...</p>
    `
})

export class RestrictedComponent implements OnInit {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        setTimeout(() => {
            var user = this.authenticationService.currentUser;
            if(user){
                user.role == Role.Student ? this.router.navigate(['/quizzes']) : this.router.navigate(['/login']);
            }else {
                this.router.navigate(['/login']);
            }
        }, 2000);
    }
}
