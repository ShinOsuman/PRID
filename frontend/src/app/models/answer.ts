import { Type } from 'class-transformer';

export class Answer {
    id?: number;
    sql?: string;
    @Type(() => Date)
    timStamp?: Date;
    isCorrect?: boolean;
    questionId?: number;
    attemptId?: number;
}