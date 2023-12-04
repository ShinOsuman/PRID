import { Type } from 'class-transformer';
import { Database } from './database';


export class Quiz {
    id?: number;
    name?: string;
    description?: string;
    isPublished?: boolean;
    isClosed?: boolean;
    isTest?: boolean;
    @Type(() => Date)
    startDate?: Date;
    @Type(() => Date)
    endDate?: Date;
    databaseId?: number;
    @Type(() => Database)
    database?: Database;
    status? : string;
    evaluation? : string;

    get testStartDate(): string {
        return this.startDate !== null && this.startDate? this.startDate?.toLocaleDateString('fr-BE') : 'N/A';
    }

    get testEndDate(): string {
        return this.endDate !== null && this.endDate? this.endDate?.toLocaleDateString('fr-BE') : 'N/A';
    }
}
