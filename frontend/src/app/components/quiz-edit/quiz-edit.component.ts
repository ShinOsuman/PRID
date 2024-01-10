import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Database } from "src/app/models/database";
import { Question } from "src/app/models/question";
import { Quiz } from "src/app/models/quiz";
import { Solution } from "src/app/models/solution";
import { DatabaseService } from "src/app/services/database.service";
import { QuizService } from "src/app/services/quiz.service";
import { QuizDeleteComponent } from "../quiz-delete/quiz-delete.component";


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
    databases!: Database[];
    quiz!: Quiz;
    questions!: Question[];
    panelOpenState = false;
    quizError: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private quizService: QuizService,
        private databaseService: DatabaseService,
        public dialog: MatDialog,
        private router: Router

    ) {
        this.ctlName = this.formBuilder.control('', [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
        ], [this.nameUsed()]);
        this.ctlDescription = this.formBuilder.control('', []);
        this.ctlIsPublished = this.formBuilder.control(false);
        this.ctlQuizType = this.formBuilder.control(false);
        this.ctlDatabase = this.formBuilder.control('', [
            Validators.required
        ]);
        this.ctlStartDate = this.formBuilder.control('', []);
        this.ctlEndDate = this.formBuilder.control('', []);

        this.quizEditForm = this.formBuilder.group({
            name: this.ctlName,
            description: this.ctlDescription,
            isPublished: this.ctlIsPublished,
            isTest: this.ctlQuizType,
            databaseId: this.ctlDatabase,
            startDate: this.ctlStartDate,
            endDate: this.ctlEndDate
        });
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
        }else {
            this.quiz = new Quiz();
            this.quiz.questions = [];
            this.questions = this.quiz.questions;
        }

        this.databaseService.getDatabases().subscribe(databases => {
            if(databases){
                this.databases = databases;
            }
        });

        
    }

    saveQuiz(){

        //on réattribue la liste de questions à l'objet quiz 
        //parce que l'objet change de référence quand on le modifie dans le formulaire
        this.quiz.questions = this.questions;
        this.quiz.name = this.ctlName.value;
        this.quiz.description = this.ctlDescription.value;
        this.quiz.isPublished = this.ctlIsPublished.value;
        this.quiz.isTest = this.ctlQuizType.value;
        if(this.quiz.isTest){
            this.quiz.startDate = this.ctlStartDate.value;
            this.quiz.endDate = this.ctlEndDate.value;
        }
        this.quiz.database = this.databases.find(d => d.id == this.ctlDatabase.value);
        this.quiz.databaseId = this.ctlDatabase.value;

        if(this.quizId != 0){
            this.quizService.editQuiz(this.quiz).subscribe(res => {
                console.log("tets");
                if(res){
                    this.refresh();
                }
            });
        }else {
            this.quizService.saveQuiz(this.quiz).subscribe(res => {
                if(res){
                    this.refresh();
                }
            });
        }

        
    }

    quizHasNoQuestions(): boolean {
        if(this.questions){
            if(this.questions.length == 0){
                this.quizError = "Aucune question";
                return true;
            }else {
                var q = this.questions.find(q => q.body!.length < 2);
                if(q){
                    this.quizError = "L'intitulé de chaque question doit contenir minimum 2 caractères";
                    return true;
                }else {
                    var s = this.questions.find(q => q.solutions!.length == 0);
                    if(s){
                        this.quizError = "Chaque question doit avoir au moins une solution";
                        return true;
                    }else {
                        var s = this.questions.find(q => q.solutions!.find(s => s.sql!.length == 0));
                        if(s){
                            this.quizError = "Aucune solution ne peut être vide";
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    nameUsed(): any {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const name = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.quizService.getByName(name).subscribe(quiz => {
                            if(this.quizId == 0){
                                resolve(quiz ? { nameUsed: true } : null);
                            }else {
                                resolve(quiz.id != this.quiz.id ? { nameUsed: true } : null);
                            }
                        });
                    }
                }, 300);
            });
        };
    }

    addQuestion() {
        //crée une nouvelle question et l'ajoute à la liste des questions
        var question = new Question();
        question.body = "";
        question.order = this.questions.length + 1;
        question.solutions = [];
        this.questions.push(question);
    }
    
    deleteQuestion(question: Question) {
        //supprime une question de la liste des questions
        var index = this.questions.indexOf(question);
        this.questions = this.questions.filter(q => q.order != question.order);
        this.reassignOrder();
    }

    reassignOrder() {
        //réassigne les ordres des questions
        for(var i = 0; i< this.questions.length; i++){
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
        for(var i = 0; i< question.solutions!.length; i++){
            question.solutions![i].order = i+1;
        }
    }

    addSolution(question: Question) {
        var solution = new Solution();
        solution.sql = "";
        solution.order = question.solutions!.length + 1;
        question.solutions!.push(solution);

    }

    deleteSolution(solution: Solution, question: Question) {
        question.solutions = question.solutions!.filter(s => s.order != solution.order);
        this.reassignSolutionOrder(question);
    }

    deleteQuiz(){
        if(this.quizId != 0){
            const dlg = this.dialog.open(QuizDeleteComponent);
            dlg.beforeClosed().subscribe(result => {
                if(result){
                    this.quizService.deleteQuiz(this.quizId).subscribe(res => {
                        this.router.navigate(['/teacher']);
                    });
                }
            })
        }
    }

}