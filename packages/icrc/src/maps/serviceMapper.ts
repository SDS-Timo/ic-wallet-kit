import { AvailableAssetView, WalletAsset } from "@icrc/types";
import { TokenModel } from "@icrc/wrappers";

export function buildAvailableAssetView(
    assets: WalletAsset[],
    tokens: TokenModel[],
    supportedAssets: string[]): AvailableAssetView[] {
    const availableAssets: AvailableAssetView[] = [];
    supportedAssets.forEach((supportedAsset) => {
        const asset = assets.find((ass) => ass.ledgerAddress === supportedAsset);
        if (asset) {
            availableAssets.push({
                ledgerAddress: asset.ledgerAddress,
                name: asset.name,
                symbol: asset.symbol,
                decimal: asset.shortDecimal,
                shortDecimal: asset.shortDecimal,
                logo: asset.logo
            })
            return;
        }
        const token = tokens.find((ass) => ass.ledgerAddress === supportedAsset);
        if (token) {
            availableAssets.push({
                ledgerAddress: token.ledgerAddress,
                name: token.name,
                symbol: token.symbol,
                decimal: token.decimal,
                shortDecimal: token.decimal,
                logo: token.logo
            })
            return;
        }
    });

    return availableAssets;

}
