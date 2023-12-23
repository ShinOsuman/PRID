import { Inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { plainToInstance } from "class-transformer";
import { HttpClient } from "@angular/common/http";
import { Question } from "../models/question";
import { Query } from "../models/query";


@Injectable({providedIn:'root'})
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }

    getQuestion(id: number): Observable<Question> {
        return this.http.get<any>(`${this.baseUrl}api/Questions/${id}`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }

    evaluate(questionId: number, sql: string, isDisplay: boolean ): Observable<Query> {
        return this.http.post<any>(`${this.baseUrl}api/Questions/evaluate`, { questionId, sql, isDisplay }).pipe(
            map(res => plainToInstance(Query, res))
        );
    }

}