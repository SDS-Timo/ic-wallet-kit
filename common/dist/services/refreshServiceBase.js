"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshServiceBase = void 0;
const replications_1 = require("@common/replications");
require("reflect-metadata");
const rxjs_1 = require("rxjs");
class RefreshServiceBase {
    configuration;
    rxSyncStateService;
    constructor(configuration, rxSyncStateService) {
        this.configuration = configuration;
        this.rxSyncStateService = rxSyncStateService;
    }
    onSyncCompleted = new rxjs_1.Subject();
    rxSyncState = replications_1.RxSyncState.Disconnected;
    isIcrcSyncRunning = false;
    async runIcrcSync() {
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
        }
        catch {
            this.onSyncCompleted.next({ success: false });
        }
        finally {
            this.isIcrcSyncRunning = false;
            this.startInterval();
        }
    }
    Interval = null;
    init() {
        this.startInterval();
        this.rxSyncStateService.onStateChanged.subscribe(this.onRxSyncStateChanged);
    }
    onRxSyncStateChanged(rxSyncStateEvent) {
        this.rxSyncState = rxSyncStateEvent.rxSyncState;
    }
    startInterval() {
        const timer = this.configuration.refreshIntervalMinutes * 60 * 1000; //(sec miliseconds)
        this.Interval = setInterval(() => {
            this.runIcrcSync();
        }, timer);
    }
    stopInterval() {
        if (this.Interval) {
            clearInterval(this.Interval);
        }
    }
}
exports.RefreshServiceBase = RefreshServiceBase;
