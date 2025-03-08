import Container, { Constructable } from "typedi";

export class WalletContainer {

    public static createContainer(containerId: string): WalletContainer {
        return new WalletContainer(containerId);
    }

    constructor(public containerId: string) {

    }

    public get<T>(type: Constructable<T>): T {
        return Container.of(this.containerId).get(type);
    }

    public set<T = unknown>(type: Constructable<T>, value: any): Container {
        return Container.of(this.containerId).set(type, value);
    }

    public setByName(name: string, value: any): Container {
        return Container.of(this.containerId).set(name, value);
    }
}
