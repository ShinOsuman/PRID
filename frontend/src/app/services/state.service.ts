import { Injectable } from "@angular/core";
import { MatTableState } from "../helpers/mattable.state";

@Injectable({ providedIn: 'root' })
export class StateService {
    public quizListState = new MatTableState('Name', 'asc', 5);
}
