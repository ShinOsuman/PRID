import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";


@Component({
    selector: 'quiz-edit',
    templateUrl: './quiz-edit.component.html'
})

export class QuizEditComponent implements OnInit {
    quizEditForm! : FormGroup;

    ctlName! : FormControl;
    ctlDescription! : FormControl;
    ctlquizType! : FormControl;

    constructor(
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit(): void {
        this.ctlName = this.formBuilder.control('', Validators.required);
        this.ctlDescription = this.formBuilder.control('', Validators.required);
        this.ctlquizType = this.formBuilder.control('', Validators.required);
    }

    onSubmit() {
        //TODO
    }
}