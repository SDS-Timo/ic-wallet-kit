"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchOnlyIdentity = void 0;
const principal_1 = require("@dfinity/principal");
class WatchOnlyIdentity {
    principal;
    constructor(principal) {
        this.principal = principal_1.Principal.fromText(principal);
    }
    getPrincipal() {
        return this.principal;
    }
    // eslint-disable-next-line require-await
    async transformRequest(request) {
        return {
            ...request,
            body: { content: request.body }
        };
    }
}
exports.WatchOnlyIdentity = WatchOnlyIdentity;
