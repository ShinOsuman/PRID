import { Type } from 'class-transformer';
import { Database } from './database';
import { Question } from './question';


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
    firstQuestionId? : number;
    questions?: Question[];

    get testStartDate(): string {
        return this.startDate !== null && this.startDate? this.startDate?.toLocaleDateString('fr-BE') : 'N/A';
    }

    get testEndDate(): string {
        return this.endDate !== null && this.endDate? this.endDate?.toLocaleDateString('fr-BE') : 'N/A';
    }

    get iconTooltip(): string {
        if(this.status == "EN_COURS"){
            return "poursuivre";
        }else if(this.status == "PAS_COMMENCE"){
            return "commencer";
        }else if(this.status == "FINI"){
            return "revoir";
        }
        return "";
    }

    get quizType(): string {
        if(this.isTest){
            return "Test";
        }else{
            return "Training";
        }
    }

    get quizStatus(): string {
        if(this.isPublished){
            if(this.isClosed){
                return "CLOTURE";
            }else {
                return "PUBLIE";
            }
        }
        return "PAS_PUBLIE";
    }
}
