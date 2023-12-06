import { Type } from 'class-transformer';
import { Quiz } from './quiz';

export class Question {
    id?: number;
    order?: number;
    body?: string;
    quizId?: number;
    @Type(() => Quiz)
    quiz?: Quiz;
    answerStatus? : string;
    
    get quizName(): string {
        return this.quiz ? this.quiz.name || 'N/A' : 'N/A';
    }
}