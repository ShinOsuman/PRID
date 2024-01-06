import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Database } from "src/app/models/database";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { Solution } from "src/app/models/solution";
import { DatabaseService } from "src/app/services/database.service";
import { QuizService } from "src/app/services/quiz.service";


@Component({
    selector: 'quiz-edit',
    templateUrl: './quiz-edit.component.html'
})

export class QuizEditComponent implements OnInit {
    quizEditForm! : FormGroup;

    ctlName! : FormControl;
    ctlDescription! : FormControl;
    ctlIsPublished! : FormControl;
    ctlQuizType! : FormControl;
    ctlDatabase! : FormControl;
    ctlStartDate! : FormControl;
    ctlEndDate! : FormControl;
    quizHasAnswers = false;
    quizId!: number;
    selectedValue: string = "0";
    databases!: Database[];
    quiz!: Quiz;
    questions!: Question[];
    questionsToDelete: Question[] = [];
    panelOpenState = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService
    ) {
        this.ctlName = this.formBuilder.control('', Validators.required);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlIsPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDatabase = this.formBuilder.control(0);
        this.ctlStartDate = this.formBuilder.control('', []);
        this.ctlEndDate = this.formBuilder.control('', []);
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.quizId = this.route.snapshot.params.id;
        if(this.quizId != 0){
            this.quizService.getQuiz(this.quizId).subscribe(quiz => {
                if(quiz){
                    this.quiz = quiz;
                    this.questions = quiz.questions ?? [];
                    this.ctlDatabase.setValue(quiz?.database?.id ?? 0);
                    this.ctlName.setValue(quiz.name);
                    this.ctlDescription.setValue(quiz.description);
                    this.ctlIsPublished.setValue(quiz.isPublished);
                    this.ctlQuizType.setValue(quiz.isTest);
                    this.ctlStartDate.setValue(quiz.startDate);
                    this.ctlEndDate.setValue(quiz.endDate);
                }
            });
        }

        this.databaseService.getDatabases().subscribe(databases => {
            if(databases){
                this.databases = databases;
            }
        });

        
    }

    onSubmit() {
        //TODO
    }

    addQuestion() {
        //crée une nouvelle question et l'ajoute à la liste des questions
        var question = new Question();
        question.order = this.questions.length + 1;
        this.questions.push(question);
    }
    
    deleteQuestion(question: Question) {
        //supprime une question de la liste des questions
        this.questions = this.questions.filter(q => q.id != question.id);
        this.questionsToDelete.push(question);
        this.reassignOrder();
    }

    reassignOrder() {
        //réassigne les ordres des questions
        for(var i = 0; i<= this.questions.length; i++){
            this.questions[i].order = i+1;
        }
    }

    moveUp(question: Question) {
        //déplace une question vers le haut
        var index = this.questions.indexOf(question);
        if(index > 0){
            var temp = this.questions[index-1];
            this.questions[index-1] = question;
            this.questions[index] = temp;
        }
        this.reassignOrder();
    }

    moveDown(question: Question) {
        //déplace une question vers le bas
        var index = this.questions.indexOf(question);
        if(index < this.questions.length - 1){
            var temp = this.questions[index+1];
            this.questions[index+1] = question;
            this.questions[index] = temp;
        }
        this.reassignOrder();
    }

    moveSolutionUp(solution: Solution, question: Question) {
        var index = question.solutions?.indexOf(solution) ?? -1;
        if(index > 0){
            var temp = question.solutions![index-1];
            question.solutions![index-1] = solution;
            question.solutions![index] = temp;
        }
        this.reassignSolutionOrder(question);
    }

    moveSolutionDown(solution: Solution, question: Question) {
        var index = question.solutions?.indexOf(solution) ?? -1;
        if(index < question.solutions!.length - 1){
            var temp = question.solutions![index+1];
            question.solutions![index+1] = solution;
            question.solutions![index] = temp;
        }
        this.reassignSolutionOrder(question);
    }

    reassignSolutionOrder(question: Question) {
        for(var i = 0; i<= question.solutions!.length; i++){
            question.solutions![i].order = i+1;
        }
    }

    addSolution(question: Question) {
        var solution = new Solution();
        solution.order = question.solutions!.length + 1;
        question.solutions!.push(solution);

    }

}