import "reflect-metadata";
import { Subject } from "rxjs";

export abstract class RxSyncStateBaseService {

    private currentState: RxSyncState | undefined;

    constructor() {
    }

    public onStateChanged: Subject<RxSyncStateEvent> = new Subject();

    public ChangeState(state: RxSyncState) {

        if (this.currentState != state) {
            this.currentState = state;
            this.onStateChanged.next({
                rxSyncState: state
            });
        }

    }
}

export enum RxSyncState { Connected, Disconnected };

export interface RxSyncStateEvent {
    rxSyncState: RxSyncState;
}
