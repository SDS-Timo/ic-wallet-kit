import "reflect-metadata";
import { Subject } from "rxjs";
export declare abstract class RxSyncStateBaseService {
    private currentState;
    constructor();
    onStateChanged: Subject<RxSyncStateEvent>;
    ChangeState(state: RxSyncState): void;
}
export declare enum RxSyncState {
    Connected = 0,
    Disconnected = 1
}
export interface RxSyncStateEvent {
    rxSyncState: RxSyncState;
}
