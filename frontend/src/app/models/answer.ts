import { Type } from 'class-transformer';
import { format } from 'date-fns';

export class Answer {
    id?: number;
    sql?: string;
    @Type(() => Date)
    timestamp?: Date;
    isCorrect?: boolean;
    questionId?: number;
    attemptId?: number;

    get getTimeStamp(): string {
        return this.timestamp !== null && this.timestamp? format(this.timestamp, 'dd/MM/yyyy HH:mm:ss') : 'N/A';
    }
}