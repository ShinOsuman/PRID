import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Attempt } from "../models/attempt";


@Injectable({providedIn:'root'})
export class AttemptService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }


    clotureAttempt(id: number): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}api/Attempts/close`, { id });
    }

    getAttempt(id: number): Observable<Attempt> {
        return this.http.post<any>(`${this.baseUrl}api/Attempts/getlastattempt`, { id });
    }

}