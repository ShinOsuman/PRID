import { Inject, Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { plainToInstance } from "class-transformer";
import { HttpClient } from "@angular/common/http";
import { Database } from "../models/database";


@Injectable({providedIn:'root'})
export class DatabaseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }

    getDatabases(): Observable<Database[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/Databases/getDatabases`).pipe(
            map(res => plainToInstance(Database, res))
        );
    }
}