import { Type } from 'class-transformer';
import { Database } from './database';


export class Quiz {
    id?: number;
    name?: string;
    description?: string;
    isPublished?: boolean;
    isClosed?: boolean;
    isTest?: boolean;
    startDate?: Date;
    endDate?: Date;
    databaseId?: number;
    @Type(() => Database)
    database?: Database;
    status? : string;

}
