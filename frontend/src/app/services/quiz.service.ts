import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Quiz } from "../models/quiz";
import { plainToInstance } from "class-transformer";

@Injectable({providedIn:'root'})
export class QuizService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }

    getTrainings(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Quizzes/trainingQuizzes`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }
}