import { buildAvailableAssetView } from "@icrc/maps/serviceMapper";
import { AvailableAssetView, SupportedStandardEnum, WalletAsset } from "@icrc/types";
import { TokenModel } from "@icrc/wrappers";


describe("buildAvailableAssetView Tests", () => {
    const mockAssets: WalletAsset[] = [
        {
            ledgerAddress: "asset-ledger-1",
            name: "Asset One",
            symbol: "AS1",
            shortDecimal: 8,
            logo: "logo1.png",
            indexAddress: "asset-index-1",
            sortOrder: 0,
            tokenName: "token-name-1",
            tokenSymbol: "token-symbol-2",
            supportedStandards: [SupportedStandardEnum.ICRC1],
            subAccounts: []
        },
        {
            ledgerAddress: "asset-ledger-2",
            name: "Asset Two",
            symbol: "AS2",
            shortDecimal: 6,
            logo: "logo2.png",
            indexAddress: "asset-index-2",
            sortOrder: 0,
            tokenName: "token-name-2",
            tokenSymbol: "token-symbol-3",
            supportedStandards: [SupportedStandardEnum.ICRC1],
            subAccounts: []
        },
    ];

    const mockTokens: TokenModel[] = [
        {
            ledgerAddress: "token-ledger-1",
            name: "Token One",
            symbol: "TK1",
            decimal: 10,
            logo: "logo3.png",
            supportedStandard: [SupportedStandardEnum.ICRC1],
            indexAddress: "index-address-1"
        },
        {
            ledgerAddress: "token-ledger-2",
            name: "Token Two",
            symbol: "TK2",
            decimal: 4,
            logo: "logo4.png",
            supportedStandard: [SupportedStandardEnum.ICRC2],
            indexAddress: "index-address-2"
        },
    ];

    const supportedAssets = [
        "asset-ledger-1",
        "token-ledger-2",
        "unknown-ledger",
    ];

    describe("buildAvailableAssetView", () => {
        it("buildAvailableAssetView: should build available asset view with matching assets and tokens", () => {
            const result = buildAvailableAssetView(mockAssets, mockTokens, supportedAssets);

            const expected: AvailableAssetView[] = [
                {
                    ledgerAddress: "asset-ledger-1",
                    name: "Asset One",
                    symbol: "AS1",
                    decimal: 8,
                    shortDecimal: 8,
                    logo: "logo1.png",
                },
                {
                    ledgerAddress: "token-ledger-2",
                    name: "Token Two",
                    symbol: "TK2",
                    decimal: 4,
                    shortDecimal: 4,
                    logo: "logo4.png",
                },
            ];

            expect(result).toEqual(expected);
        });

        it("buildAvailableAssetView: should return an empty array if no supported assets match", () => {
            const result = buildAvailableAssetView(
                mockAssets,
                mockTokens,
                ["unknown-ledger"]
            );

            expect(result).toEqual([]);
        });

        it("buildAvailableAssetView: should handle empty assets and tokens arrays", () => {
            const result = buildAvailableAssetView([], [], supportedAssets);

            expect(result).toEqual([]);
        });

        it("buildAvailableAssetView: should prioritize WalletAsset over TokenModel if both match", () => {
            const duplicateSupportedAssets = ["asset-ledger-1", "token-ledger-1"];

            const result = buildAvailableAssetView(mockAssets, mockTokens, duplicateSupportedAssets);

            const expected: AvailableAssetView[] = [
                {
                    ledgerAddress: "asset-ledger-1",
                    name: "Asset One",
                    symbol: "AS1",
                    decimal: 8,
                    shortDecimal: 8,
                    logo: "logo1.png",
                },
                {
                    ledgerAddress: "token-ledger-1",
                    name: "Token One",
                    symbol: "TK1",
                    decimal: 10,
                    shortDecimal: 10,
                    logo: "logo3.png",
                },
            ];

            expect(result).toEqual(expected);
        });
    });
});
