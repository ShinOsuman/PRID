import { Type } from 'class-transformer';
import { Quiz } from './quiz';
import { Solution } from './solution';

export class Question {
    id?: number;
    order?: number;
    body?: string;
    quizId?: number;
    @Type(() => Quiz)
    quiz?: Quiz;
    answerStatus? : string;
    answer? : string;
    previousQuestion?: number;
    nextQuestion?: number;
    sendButtonDisabled?: boolean = true;
    solutions?: Solution[];

    get quizName(): string {
        return this.quiz ? this.quiz.name || 'N/A' : 'N/A';
    }

    get previousButtonDisabled(): boolean {
        return this.previousQuestion == 0;
    }

    get nextButtonDisabled(): boolean {
        return this.nextQuestion == 0;
    }

    get isTest(): boolean {
        return this.quiz?.isTest ?? false;
    }

}