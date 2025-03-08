import { AssetManagerConfiguration } from "@icrc/types/configuration/assetManagerConfiguration";

describe("AssetManagerConfiguration Tests", () => {

    it("AssetManagerConfiguration: Should have default values", () => {
        const config = new AssetManagerConfiguration();
        expect(config.defaultDateTimeFormat).toBe("MM/DD/YYYY HH:mm:ss");
        expect(config.tokenMarketCanister).toBeUndefined();
    });

    it("AssetManagerConfiguration: Should allow setting tokenMarketCanister", () => {
        const config = new AssetManagerConfiguration();
        config.tokenMarketCanister = "mock-canister-id";
        expect(config.tokenMarketCanister).toBe("mock-canister-id");
    });

    it("AssetManagerConfiguration: Should allow overriding defaultDateTimeFormat", () => {
        const config = new AssetManagerConfiguration();
        config.defaultDateTimeFormat = "YYYY-MM-DD HH:mm";
        expect(config.defaultDateTimeFormat).toBe("YYYY-MM-DD HH:mm");
    });

});