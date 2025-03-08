"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxSyncState = exports.RxSyncStateBaseService = void 0;
require("reflect-metadata");
const rxjs_1 = require("rxjs");
class RxSyncStateBaseService {
    currentState;
    constructor() {
    }
    onStateChanged = new rxjs_1.Subject();
    ChangeState(state) {
        if (this.currentState != state) {
            this.currentState = state;
            this.onStateChanged.next({
                rxSyncState: state
            });
        }
    }
}
exports.RxSyncStateBaseService = RxSyncStateBaseService;
var RxSyncState;
(function (RxSyncState) {
    RxSyncState[RxSyncState["Connected"] = 0] = "Connected";
    RxSyncState[RxSyncState["Disconnected"] = 1] = "Disconnected";
})(RxSyncState || (exports.RxSyncState = RxSyncState = {}));
;
