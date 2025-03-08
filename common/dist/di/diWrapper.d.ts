import Container, { Constructable } from "typedi";
export declare class WalletContainer {
    containerId: string;
    static createContainer(containerId: string): WalletContainer;
    constructor(containerId: string);
    get<T>(type: Constructable<T>): T;
    set<T = unknown>(type: Constructable<T>, value: any): Container;
    setByName(name: string, value: any): Container;
}
