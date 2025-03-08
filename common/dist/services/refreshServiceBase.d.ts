import { RxSyncState, RxSyncStateBaseService } from "@common/replications";
import { RefreshServiceConfiguration } from "@common/types/serviceConfiguration/refreshServiceConfiguration";
import "reflect-metadata";
import { Subject } from "rxjs";
export declare abstract class RefreshServiceBase {
    private configuration;
    private rxSyncStateService;
    constructor(configuration: RefreshServiceConfiguration, rxSyncStateService: RxSyncStateBaseService);
    onSyncCompleted: Subject<RefreshEvent>;
    rxSyncState: RxSyncState;
    private isIcrcSyncRunning;
    abstract runSync(): Promise<Boolean>;
    runIcrcSync(): Promise<void>;
    private Interval;
    init(): void;
    private onRxSyncStateChanged;
    private startInterval;
    private stopInterval;
}
export interface RefreshEvent {
    success: Boolean;
}
