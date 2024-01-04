import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { QuizService } from "src/app/services/quiz.service";


@Component({
    selector: 'quiz-edit',
    templateUrl: './quiz-edit.component.html'
})

export class QuizEditComponent implements OnInit {
    quizEditForm! : FormGroup;

    ctlName! : FormControl;
    ctlDescription! : FormControl;
    selected = "option1";
    isPublished = false;
    quizHasAnswers = false;
    quizId!: number;
    selectedValue: string = "0";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private quizService: QuizService
    ) {

    }

    ngOnInit(): void {
        this.ctlName = this.formBuilder.control('', Validators.required);
        this.ctlDescription = this.formBuilder.control('', Validators.required);
        this.refresh();
    }

    refresh() {
        this.quizId = this.route.snapshot.params.id;
        if(this.quizId != 0){
            this.quizService.getQuiz(this.quizId).subscribe(quiz => {
                if(quiz){
                    this.ctlName.setValue(quiz.name);
                    this.ctlDescription.setValue(quiz.description);
                }
            });
        }
        
    }

    onSubmit() {
        //TODO
    }
}