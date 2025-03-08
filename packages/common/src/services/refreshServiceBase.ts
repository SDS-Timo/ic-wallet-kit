

import { RxSyncState, RxSyncStateBaseService, RxSyncStateEvent } from "@common/replications";
import { RefreshServiceConfiguration } from "@common/types/serviceConfiguration/refreshServiceConfiguration";
import "reflect-metadata";
import { Subject } from "rxjs";

export abstract class RefreshServiceBase {

    constructor(
        protected configuration: RefreshServiceConfiguration,
        private rxSyncStateService: RxSyncStateBaseService
    ) {
    }

    public onSyncCompleted: Subject<RefreshEvent> = new Subject();
    public rxSyncState: RxSyncState = RxSyncState.Disconnected;

    private isIcrcSyncRunning: Boolean = false;

    abstract runSync(): Promise<Boolean>;

    public async runIcrcSync(): Promise<void> {
        if (this.isIcrcSyncRunning) {
            return;
        }

        this.stopInterval();

        try {
            this.isIcrcSyncRunning = true;

            let isSuccess = await this.runSync();

            this.onSyncCompleted.next({
                success: isSuccess
            });

        } catch {
            this.onSyncCompleted.next({ success: false });
        }
        finally {
            this.isIcrcSyncRunning = false;
            this.startInterval();
        }
    }

    private Interval: any = null;

    public init() {

        if (this.configuration.enable) {

            this.startInterval();

            this.rxSyncStateService.onStateChanged.subscribe(this.onRxSyncStateChanged);
        }
    }

    private onRxSyncStateChanged(rxSyncStateEvent: RxSyncStateEvent) {
        this.rxSyncState = rxSyncStateEvent.rxSyncState;
    }

    private startInterval() {
        const timer = this.configuration.refreshIntervalMinutes * 60 * 1000; //(sec miliseconds)

        this.Interval = setInterval(() => {
            this.runIcrcSync();
        },
            timer);
    }

    private stopInterval() {
        if (this.Interval) {
            clearInterval(this.Interval);
        }
    }
}

export interface RefreshEvent {
    success: Boolean;
}
