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

    getTests(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Quizzes/testQuizzes`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getQuizzes(): Observable<Quiz[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Quizzes/all`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getQuiz(id: number): Observable<Quiz> {
        return this.http.get<any>(`${this.baseUrl}api/Quizzes/${id}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    getByName(name: string): Observable<Quiz> {
        return this.http.get<any>(`${this.baseUrl}api/Quizzes/getByName/${name}`).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    deleteQuiz(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}api/Quizzes/${id}`);
    }

    saveQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.post<any>(`${this.baseUrl}api/Quizzes`, quiz).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }

    editQuiz(quiz: Quiz): Observable<Quiz> {
        return this.http.put<any>(`${this.baseUrl}api/Quizzes`, quiz).pipe(
            map(res => plainToInstance(Quiz, res))
        );
    }
}