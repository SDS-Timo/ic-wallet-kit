"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContainer = void 0;
const typedi_1 = __importDefault(require("typedi"));
class WalletContainer {
    containerId;
    static createContainer(containerId) {
        return new WalletContainer(containerId);
    }
    constructor(containerId) {
        this.containerId = containerId;
    }
    get(type) {
        return typedi_1.default.of(this.containerId).get(type);
    }
    set(type, value) {
        return typedi_1.default.of(this.containerId).set(type, value);
    }
    setByName(name, value) {
        return typedi_1.default.of(this.containerId).set(name, value);
    }
}
exports.WalletContainer = WalletContainer;
