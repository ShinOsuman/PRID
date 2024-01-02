import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    templateUrl: 'teacher.component.html'
})

export class TeacherComponent {
    filter : string = '';
  
    constructor(
        private router: Router,
    ) {}


    filterChanged(e: KeyboardEvent) {  
        //TODO
    }

    createQuiz(id: number) {
        this.router.navigate(['/quizedition/' + id]);
    }

}