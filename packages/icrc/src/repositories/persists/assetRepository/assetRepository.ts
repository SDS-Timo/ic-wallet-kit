import { ValidationError, getPropertyName } from "@ic-wallet-middleware/common";

import { orderBySubAccountId } from "@icrc/extensions/subAccountExtension";
import { IAssetDataStorage } from "@icrc/storage/assetDataStorage/assetDataStorage";
import { WalletAsset, WalletSubAccount } from "@icrc/types";
import { RemoveSubAccountForm } from "@icrc/types/forms/assets/removeSubAccountForm";
import { UpdateAssetForm } from "@icrc/types/forms/assets/updateAssetForm";
import { UpdateSubAccountForm } from "@icrc/types/forms/assets/updateSubAccountForm";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { Inject, Service } from "typedi";

@Service("AssetRepository")
export class AssetRepository {

    private assetDataStorage: IAssetDataStorage

    constructor(
        @Inject("IAssetDataStorage")
        assetDataStorage: IAssetDataStorage) {
        this.assetDataStorage = assetDataStorage;
    }

    async getTokensOrDefault(): Promise<WalletAsset[]> {
        let assets = await this.assetDataStorage.getItems();

        if (assets.length == 0) {
            assets = this.getDefaultTokens();
            await this.assetDataStorage.addItems(assets);
        }

        assets = assets.sort((a: WalletAsset, b: WalletAsset) => a.sortOrder - b.sortOrder);

        for (const a of assets) {
            a.subAccounts = a.subAccounts.sort(orderBySubAccountId);
        }
        return assets;
    }

    async remove(ledgerAddress: string): Promise<void> {
        await this.assetDataStorage.deleteItem(ledgerAddress);
    }

    async addSubAccount(subAccount: WalletSubAccount): Promise<void> {
        const asset = await this.getAssetById(subAccount.ledgerAddress);
        asset.subAccounts.push(subAccount);
        await this.assetDataStorage.updateItem(asset);
    }

    async removeSubAccount(form: RemoveSubAccountForm): Promise<void> {

        const asset = await this.getAssetById(form.ledgerAddress);
        asset.subAccounts = asset.subAccounts.filter((a: WalletSubAccount) => a.subAccountId !== form.subAccountId.toString());
        await this.assetDataStorage.updateItem(asset);
    }

    async updateSubAccount(form: UpdateSubAccountForm): Promise<void> {
        const asset = await this.getAssetById(form.ledgerAddress);

        const subAccount = asset.subAccounts.find((a: WalletSubAccount) => a.subAccountId === form.subAccountId.toString());

        if (!subAccount) {
            throw new ValidationError("subAccount.not.found",
                getPropertyName(form, f => f.subAccountId),
                "SubAccount Not Found")
        }

        subAccount.name = form.subAccountNewName;
        await this.assetDataStorage.updateItem(asset);
    }

    async updateAsset(form: UpdateAssetForm): Promise<void> {
        const asset = await this.getAssetById(form.ledgerAddress);

        asset.name = form.assetName;
        asset.shortDecimal = form.shortDecimal;
        asset.symbol = form.symbol;
        await this.assetDataStorage.updateItem(asset);
    }

    async isAssetExist(ledgerAddress: string): Promise<boolean> {
        const assets = await this.assetDataStorage.getItems();
        const result = assets.find((asst: WalletAsset) => asst.ledgerAddress === ledgerAddress) ? true : false

        return result;
    }

    async getAssetNextIndex(): Promise<number> {
        const assets = await this.assetDataStorage.getItems();
        const assetNumbers = assets.map(a => a.sortOrder);
        const result = Math.max(...assetNumbers, -1);
        return result + 1;
    }

    async getAssetOrDefault(ledgerAddress: string): Promise<WalletAsset | undefined> {
        const result = await this.assetDataStorage.getItem(ledgerAddress);
        return result;
    }

    private async getAssetById(ledgerAddress: string): Promise<WalletAsset> {
        const asset = await this.getAssetOrDefault(ledgerAddress);
        if (!asset) {
            throw new ValidationError("asset.not.found",
                "ledgerAddress",
                "Asset Not Found");
        }
        return asset;
    }

    async addAsset(asset: WalletAsset): Promise<void> {
        await this.assetDataStorage.addItem(asset);
    }

    async checkSupportedStandard(ledgerAddress: string, supportedStandard: SupportedStandardEnum): Promise<boolean> {
        const asset = await this.getAssetById(ledgerAddress);
        const result = asset.supportedStandards.includes(supportedStandard);
        return result;
    }



    private getDefaultTokens(): WalletAsset[] {
        return [
            {
                sortOrder: 0,
                indexAddress: "0",
                symbol: "ICP",
                name: "Internet Computer",
                tokenSymbol: "ICP",
                tokenName: "Internet Computer",
                shortDecimal: 8,
                ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",

                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/png;base64,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"
            },
            {
                sortOrder: 1,
                indexAddress: "ul4oc-4iaaa-aaaaq-qaabq-cai",
                symbol: "TCYCLES",
                name: "Trillion Cycles",
                tokenSymbol: "TCYCLES",
                tokenName: "Trillion Cycles",
                shortDecimal: 12,
                ledgerAddress: "um5iw-rqaaa-aaaaq-qaaba-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "um5iw-rqaaa-aaaaq-qaaba-cai",

                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgzIiBoZWlnaHQ9IjI4NCIgdmlld0JveD0iMCAwIDI4MyAyODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yODAuNDM2IDE0Mi4wNDRDMjgwLjQzNiA2NS4zMTMxIDIxOC4yMzMgMy4xMTAzNSAxNDEuNTAyIDMuMTEwMzVDNjQuNzcwNyAzLjExMDM1IDIuNTY3ODcgNjUuMzEzMSAyLjU2Nzg3IDE0Mi4wNDRDMi41Njc4NyAyMTguNzc1IDY0Ljc3MDcgMjgwLjk3OCAxNDEuNTAyIDI4MC45NzhDMjE4LjIzMyAyODAuOTc4IDI4MC40MzYgMjE4Ljc3NSAyODAuNDM2IDE0Mi4wNDRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBvcGFjaXR5PSIwLjIiIGQ9Ik0xNDEuNTAxIDI1NC45NTVDMjAzLjg2IDI1NC45NTUgMjU0LjQxMiAyMDQuNDAzIDI1NC40MTIgMTQyLjA0NEMyNTQuNDEyIDc5LjY4NDYgMjAzLjg2IDI5LjEzMjQgMTQxLjUwMSAyOS4xMzI0Qzc5LjE0MTUgMjkuMTMyNCAyOC41ODk0IDc5LjY4NDYgMjguNTg5NCAxNDIuMDQ0QzI4LjU4OTQgMjA0LjQwMyA3OS4xNDE1IDI1NC45NTUgMTQxLjUwMSAyNTQuOTU1WiIgZmlsbD0id2hpdGUiIHN0cm9rZT0idXJsKCNwYWludDBfbGluZWFyXzIwMV8xNTQpIiBzdHJva2Utd2lkdGg9IjE0LjExMzkiLz4KPHBhdGggZD0iTTE1NC4yMDQgMTIzLjY5NlY1MC4zMDM2TDk5LjE1OTcgMTYwLjM5MkgxMzUuODU2VjIzMy43ODRMMTkwLjkgMTIzLjY5NkgxNTQuMjA0WiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzIwMV8xNTQpIi8+CjxwYXRoIGQ9Ik0yODAuNDM2IDE0Mi4wNDRDMjgwLjQzNiA2NS4zMTMxIDIxOC4yMzMgMy4xMTAzNSAxNDEuNTAyIDMuMTEwMzVDNjQuNzcwNyAzLjExMDM1IDIuNTY3ODcgNjUuMzEzMSAyLjU2Nzg3IDE0Mi4wNDRDMi41Njc4NyAyMTguNzc1IDY0Ljc3MDcgMjgwLjk3OCAxNDEuNTAyIDI4MC45NzhDMjE4LjIzMyAyODAuOTc4IDI4MC40MzYgMjE4Ljc3NSAyODAuNDM2IDE0Mi4wNDRaIiBzdHJva2U9InVybCgjcGFpbnQyX2xpbmVhcl8yMDFfMTU0KSIgc3Ryb2tlLXdpZHRoPSI0LjQxMDYiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yMDFfMTU0IiB4MT0iMjEuNTMyNCIgeTE9IjIyLjA3NTYiIHgyPSIyNjYuODk2IiB5Mj0iNzcuMDcwOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjM0IwMEI5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzI1ODZCNiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MV9saW5lYXJfMjAxXzE1NCIgeDE9Ijk5LjE1OTciIHkxPSI1MC4zMDM2IiB4Mj0iMTk2LjQ2NiIgeTI9IjYxLjIwODQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzNCMDBCOSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMyNTg2QjYiLz4KPC9saW5lYXJHcmFkaWVudD4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDJfbGluZWFyXzIwMV8xNTQiIHgxPSIwLjM2MjU3MyIgeTE9IjAuOTA1MDUxIiB4Mj0iMjg5LjAyNSIgeTI9IjY1LjYwNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjM0IwMEI5Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzI1ODZCNiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo="
            },
            {
                sortOrder: 2,
                symbol: "ckBTC",
                name: "ckBTC",
                tokenSymbol: "ckBTC",
                tokenName: "ckBTC",
                shortDecimal: 8,
                ledgerAddress: "mxzaz-hqaaa-aaaar-qaada-cai",
                indexAddress: "n5wcd-faaaa-aaaar-qaaea-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "mxzaz-hqaaa-aaaar-qaada-cai",
                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjE0NiIgdmlld0JveD0iMCAwIDE0NiAxNDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDYiIGhlaWdodD0iMTQ2IiByeD0iNzMiIGZpbGw9IiMzQjAwQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4zODM3IDc3LjIwNTJDMTguNDM0IDEwNS4yMDYgNDAuNzk0IDEyNy41NjYgNjguNzk0OSAxMjkuNjE2VjEzNS45MzlDMzcuMzA4NyAxMzMuODY3IDEyLjEzMyAxMDguNjkxIDEwLjA2MDUgNzcuMjA1MkgxNi4zODM3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzExMF81NzIpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNjguNzY0NiAxNi4zNTM0QzQwLjc2MzggMTguNDAzNiAxOC40MDM3IDQwLjc2MzcgMTYuMzUzNSA2OC43NjQ2TDEwLjAzMDMgNjguNzY0NkMxMi4xMDI3IDM3LjI3ODQgMzcuMjc4NSAxMi4xMDI2IDY4Ljc2NDYgMTAuMDMwMkw2OC43NjQ2IDE2LjM1MzRaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTI5LjYxNiA2OC43MzQzQzEyNy41NjYgNDAuNzMzNSAxMDUuMjA2IDE4LjM3MzQgNzcuMjA1MSAxNi4zMjMyTDc3LjIwNTEgMTBDMTA4LjY5MSAxMi4wNzI0IDEzMy44NjcgMzcuMjQ4MiAxMzUuOTM5IDY4LjczNDNMMTI5LjYxNiA2OC43MzQzWiIgZmlsbD0idXJsKCNwYWludDFfbGluZWFyXzExMF81NzIpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNzcuMjM1NCAxMjkuNTg2QzEwNS4yMzYgMTI3LjUzNiAxMjcuNTk2IDEwNS4xNzYgMTI5LjY0NyA3Ny4xNzQ5TDEzNS45NyA3Ny4xNzQ5QzEzMy44OTcgMTA4LjY2MSAxMDguNzIyIDEzMy44MzcgNzcuMjM1NCAxMzUuOTA5TDc3LjIzNTQgMTI5LjU4NloiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZD0iTTk5LjgyMTcgNjQuNzI0NUMxMDEuMDE0IDU2Ljc1MzggOTQuOTQ0NyA1Mi40Njg5IDg2LjY0NTUgNDkuNjEwNEw4OS4zMzc2IDM4LjgxM0w4Mi43NjQ1IDM3LjE3NUw4MC4xNDM1IDQ3LjY4NzlDNzguNDE1NSA0Ny4yNTczIDc2LjY0MDYgNDYuODUxMSA3NC44NzcxIDQ2LjQ0ODdMNzcuNTE2OCAzNS44NjY1TDcwLjk0NzQgMzQuMjI4NUw2OC4yNTM0IDQ1LjAyMjJDNjYuODIzIDQ0LjY5NjUgNjUuNDE4OSA0NC4zNzQ2IDY0LjA1NiA0NC4wMzU3TDY0LjA2MzUgNDQuMDAyTDU0Ljk5ODUgNDEuNzM4OEw1My4yNDk5IDQ4Ljc1ODZDNTMuMjQ5OSA0OC43NTg2IDU4LjEyNjkgNDkuODc2MiA1OC4wMjM5IDQ5Ljk0NTRDNjAuNjg2MSA1MC42MSA2MS4xNjcyIDUyLjM3MTUgNjEuMDg2NyA1My43NjhDNTguNjI3IDYzLjYzNDUgNTYuMTcyMSA3My40Nzg4IDUzLjcxMDQgODMuMzQ2N0M1My4zODQ3IDg0LjE1NTQgNTIuNTU5MSA4NS4zNjg0IDUwLjY5ODIgODQuOTA3OUM1MC43NjM3IDg1LjAwMzQgNDUuOTIwNCA4My43MTU1IDQ1LjkyMDQgODMuNzE1NUw0Mi42NTcyIDkxLjIzODlMNTEuMjExMSA5My4zNzFDNTIuODAyNSA5My43Njk3IDU0LjM2MTkgOTQuMTg3MiA1NS44OTcxIDk0LjU4MDNMNTMuMTc2OSAxMDUuNTAxTDU5Ljc0MjYgMTA3LjEzOUw2Mi40MzY2IDk2LjMzNDNDNjQuMjMwMSA5Ni44MjEgNjUuOTcxMiA5Ny4yNzAzIDY3LjY3NDkgOTcuNjkzNEw2NC45OTAyIDEwOC40NDhMNzEuNTYzNCAxMTAuMDg2TDc0LjI4MzYgOTkuMTg1M0M4NS40OTIyIDEwMS4zMDYgOTMuOTIwNyAxMDAuNDUxIDk3LjQ2ODQgOTAuMzE0MUMxMDAuMzI3IDgyLjE1MjQgOTcuMzI2MSA3Ny40NDQ1IDkxLjQyODggNzQuMzc0NUM5NS43MjM2IDczLjM4NDIgOTguOTU4NiA3MC41NTk0IDk5LjgyMTcgNjQuNzI0NVpNODQuODAzMiA4NS43ODIxQzgyLjc3MiA5My45NDM4IDY5LjAyODQgODkuNTMxNiA2NC41NzI3IDg4LjQyNTNMNjguMTgyMiA3My45NTdDNzIuNjM4IDc1LjA2ODkgODYuOTI2MyA3Ny4yNzA0IDg0LjgwMzIgODUuNzgyMVpNODYuODM2NCA2NC42MDY2Qzg0Ljk4MyA3Mi4wMzA3IDczLjU0NDEgNjguMjU4OCA2OS44MzM1IDY3LjMzNEw3My4xMDYgNTQuMjExN0M3Ni44MTY2IDU1LjEzNjQgODguNzY2NiA1Ni44NjIzIDg2LjgzNjQgNjQuNjA2NloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTEwXzU3MiIgeDE9IjUzLjQ3MzYiIHkxPSIxMjIuNzkiIHgyPSIxNC4wMzYyIiB5Mj0iODkuNTc4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMTBfNTcyIiB4MT0iMTIwLjY1IiB5MT0iNTUuNjAyMSIgeDI9IjgxLjIxMyIgeTI9IjIyLjM5MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjIxIiBzdG9wLWNvbG9yPSIjRjE1QTI0Ii8+CjxzdG9wIG9mZnNldD0iMC42ODQxIiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="
            },
            {
                sortOrder: 3,
                symbol: "ckETH",
                name: "ckETH",
                tokenSymbol: "ckETH",
                tokenName: "ckETH",
                shortDecimal: 8,
                ledgerAddress: "ss2fx-dyaaa-aaaar-qacoq-cai",
                indexAddress: "s3zol-vqaaa-aaaar-qacpa-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "ss2fx-dyaaa-aaaar-qacoq-cai",
                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjE0NiIgdmlld0JveD0iMCAwIDE0NiAxNDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDYiIGhlaWdodD0iMTQ2IiByeD0iNzMiIGZpbGw9IiMzQjAwQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4zODM3IDc3LjIwNTJDMTguNDM0IDEwNS4yMDYgNDAuNzk0IDEyNy41NjYgNjguNzk0OSAxMjkuNjE2VjEzNS45NEMzNy4zMDg3IDEzMy44NjcgMTIuMTMzIDEwOC42OTEgMTAuMDYwNSA3Ny4yMDUySDE2LjM4MzdaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTEwXzU4NikiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02OC43NjQ2IDE2LjM1MzRDNDAuNzYzOCAxOC40MDM2IDE4LjQwMzcgNDAuNzYzNyAxNi4zNTM1IDY4Ljc2NDZMMTAuMDMwMyA2OC43NjQ2QzEyLjEwMjcgMzcuMjc4NCAzNy4yNzg1IDEyLjEwMjYgNjguNzY0NiAxMC4wMzAyTDY4Ljc2NDYgMTYuMzUzNFoiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMjkuNjE2IDY4LjczNDNDMTI3LjU2NiA0MC43MzM0IDEwNS4yMDYgMTguMzczMyA3Ny4yMDUxIDE2LjMyMzFMNzcuMjA1MSA5Ljk5OTk4QzEwOC42OTEgMTIuMDcyNCAxMzMuODY3IDM3LjI0ODEgMTM1LjkzOSA2OC43MzQzTDEyOS42MTYgNjguNzM0M1oiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xMTBfNTg2KSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTc3LjIzNTQgMTI5LjU4NkMxMDUuMjM2IDEyNy41MzYgMTI3LjU5NiAxMDUuMTc2IDEyOS42NDcgNzcuMTc0OUwxMzUuOTcgNzcuMTc0OUMxMzMuODk3IDEwOC42NjEgMTA4LjcyMiAxMzMuODM3IDc3LjIzNTQgMTM1LjkwOUw3Ny4yMzU0IDEyOS41ODZaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGQ9Ik03My4xOTA0IDMxVjYxLjY4MThMOTkuMTIzIDczLjI2OTZMNzMuMTkwNCAzMVoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNNzMuMTkwNCAzMUw0Ny4yNTQ0IDczLjI2OTZMNzMuMTkwNCA2MS42ODE4VjMxWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTczLjE5MDQgOTMuMTUyM1YxMTRMOTkuMTQwMyA3OC4wOTg0TDczLjE5MDQgOTMuMTUyM1oiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgo8cGF0aCBkPSJNNzMuMTkwNCAxMTRWOTMuMTQ4OEw0Ny4yNTQ0IDc4LjA5ODRMNzMuMTkwNCAxMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNzMuMTkwNCA4OC4zMjY5TDk5LjEyMyA3My4yNjk2TDczLjE5MDQgNjEuNjg4N1Y4OC4zMjY5WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CjxwYXRoIGQ9Ik00Ny4yNTQ0IDczLjI2OTZMNzMuMTkwNCA4OC4zMjY5VjYxLjY4ODdMNDcuMjU0NCA3My4yNjk2WiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC42Ii8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTEwXzU4NiIgeDE9IjUzLjQ3MzYiIHkxPSIxMjIuNzkiIHgyPSIxNC4wMzYyIiB5Mj0iODkuNTc4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMTBfNTg2IiB4MT0iMTIwLjY1IiB5MT0iNTUuNjAyMSIgeDI9IjgxLjIxMyIgeTI9IjIyLjM5MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjIxIiBzdG9wLWNvbG9yPSIjRjE1QTI0Ii8+CjxzdG9wIG9mZnNldD0iMC42ODQxIiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="
            },
            {
                sortOrder: 4,
                symbol: "ckUSDC",
                name: "ckUSDC",
                tokenSymbol: "ckUSDC",
                tokenName: "ckUSDC",
                shortDecimal: 8,
                ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
                indexAddress: "xrs4b-hiaaa-aaaar-qafoa-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "xevnm-gaaaa-aaaar-qafnq-cai",
                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ2IiBoZWlnaHQ9IjE0NiIgdmlld0JveD0iMCAwIDE0NiAxNDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNDYiIGhlaWdodD0iMTQ2IiByeD0iNzMiIGZpbGw9IiMzQjAwQjkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNi4zODM3IDc3LjIwNTJDMTguNDM0IDEwNS4yMDYgNDAuNzk0IDEyNy41NjYgNjguNzk0OSAxMjkuNjE2VjEzNS45NEMzNy4zMDg3IDEzMy44NjcgMTIuMTMzIDEwOC42OTEgMTAuMDYwNSA3Ny4yMDUySDE2LjM4MzdaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTEwXzYwNCkiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02OC43NjQ2IDE2LjM1MzRDNDAuNzYzOCAxOC40MDM2IDE4LjQwMzcgNDAuNzYzNyAxNi4zNTM1IDY4Ljc2NDZMMTAuMDMwMyA2OC43NjQ2QzEyLjEwMjcgMzcuMjc4NCAzNy4yNzg1IDEyLjEwMjYgNjguNzY0NiAxMC4wMzAyTDY4Ljc2NDYgMTYuMzUzNFoiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMjkuNjE2IDY4LjczNDNDMTI3LjU2NiA0MC43MzM0IDEwNS4yMDYgMTguMzczMyA3Ny4yMDUxIDE2LjMyMzFMNzcuMjA1MSA5Ljk5OTk4QzEwOC42OTEgMTIuMDcyNCAxMzMuODY3IDM3LjI0ODEgMTM1LjkzOSA2OC43MzQzTDEyOS42MTYgNjguNzM0M1oiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl8xMTBfNjA0KSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTc3LjIzNTQgMTI5LjU4NkMxMDUuMjM2IDEyNy41MzYgMTI3LjU5NiAxMDUuMTc2IDEyOS42NDcgNzcuMTc0OUwxMzUuOTcgNzcuMTc0OUMxMzMuODk3IDEwOC42NjEgMTA4LjcyMiAxMzMuODM3IDc3LjIzNTQgMTM1LjkwOUw3Ny4yMzU0IDEyOS41ODZaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGQ9Ik04OS4yMjUzIDgyLjMzOTdDODkuMjI1MyA3My43Mzc1IDg0LjA2MjggNzAuNzg3NSA3My43Mzc4IDY5LjU1NDRDNjYuMzYyOCA2OC41NjkxIDY0Ljg4NzggNjYuNjA0NCA2NC44ODc4IDYzLjE2NDdDNjQuODg3OCA1OS43MjUgNjcuMzQ4MSA1Ny41MTI1IDcyLjI2MjggNTcuNTEyNUM3Ni42ODc4IDU3LjUxMjUgNzkuMTQ4MSA1OC45ODc1IDgwLjM3NTMgNjIuNjc1QzgwLjYyMzEgNjMuNDEyNSA4MS4zNjA2IDYzLjkwMjIgODIuMDk4MSA2My45MDIySDg2LjAzMzRDODcuMDE4NyA2My45MDIyIDg3Ljc1NjIgNjMuMTY0NyA4Ny43NTYyIDYyLjE3OTRWNjEuOTMxNkM4Ni43NzA5IDU2LjUyMTMgODIuMzQ1OSA1Mi4zNDQxIDc2LjY5MzcgNTEuODU0NFY0NS45NTQ0Qzc2LjY5MzcgNDQuOTY5MSA3NS45NTYyIDQ0LjIzMTYgNzQuNzI5IDQzLjk4OTdINzEuMDQxNUM3MC4wNTYyIDQzLjk4OTcgNjkuMzE4NyA0NC43MjcyIDY5LjA3NjggNDUuOTU0NFY1MS42MDY2QzYxLjcwMTggNTIuNTkxOSA1Ny4wMjkgNTcuNTA2NiA1Ny4wMjkgNjMuNjU0NEM1Ny4wMjkgNzEuNzY2OSA2MS45NDM3IDc0Ljk2NDcgNzIuMjY4NyA3Ni4xOTE5Qzc5LjE1NCA3Ny40MTkxIDgxLjM2NjUgNzguODk0MSA4MS4zNjY1IDgyLjgyOTRDODEuMzY2NSA4Ni43NjQ3IDc3LjkyNjggODkuNDY2OSA3My4yNTQgODkuNDY2OUM2Ni44NjQzIDg5LjQ2NjkgNjQuNjUxOCA4Ni43NjQ3IDYzLjkxNDMgODMuMDc3MkM2My42NjY1IDgyLjA5MTkgNjIuOTI5IDgxLjYwMjIgNjIuMTkxNSA4MS42MDIySDU4LjAxNDNDNTcuMDI5IDgxLjYwMjIgNTYuMjkxNSA4Mi4zMzk3IDU2LjI5MTUgODMuMzI1VjgzLjU3MjhDNTcuMjc2OCA4OS43MjA2IDYxLjIwNjIgOTQuMTQ1NiA2OS4zMTg3IDk1LjM3MjhWMTAxLjI3M0M2OS4zMTg3IDEwMi4yNTggNzAuMDU2MiAxMDIuOTk2IDcxLjI4MzQgMTAzLjIzN0g3NC45NzA5Qzc1Ljk1NjIgMTAzLjIzNyA3Ni42OTM3IDEwMi41IDc2LjkzNTYgMTAxLjI3M1Y5NS4zNzI4Qzg0LjMwNDcgOTQuMTM5NyA4OS4yMjUzIDg4Ljk3NzIgODkuMjI1MyA4Mi4zMzk3WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTYwLjQ2MjYgMTA4LjE1MkM0MS4yODc2IDEwMS4yNjcgMzEuNDUyMyA3OS44Nzk0IDM4LjU4NTQgNjAuOTUyMkM0Mi4yNzI5IDUwLjYyNzIgNTAuMzg1NCA0Mi43NjI1IDYwLjQ2MjYgMzkuMDc1QzYxLjQ0NzggMzguNTg1MyA2MS45Mzc1IDM3Ljg0NzggNjEuOTM3NSAzNi42MTQ3VjMzLjE3NUM2MS45Mzc1IDMyLjE4OTcgNjEuNDQ3OCAzMS40NTIyIDYwLjQ2MjYgMzEuMjEwM0M2MC4yMTQ4IDMxLjIxMDMgNTkuNzI1MSAzMS4yMTAzIDU5LjQ3NzMgMzEuNDU4MUMzNi4xMjUxIDM4LjgzMzEgMjMuMzM5OCA2My42NjAzIDMwLjcxNDggODcuMDE4NEMzNS4xMzk4IDEwMC43ODMgNDUuNzEyNiAxMTEuMzU2IDU5LjQ3NzMgMTE1Ljc4MUM2MC40NjI2IDExNi4yNzEgNjEuNDQyIDExNS43ODEgNjEuNjg5OCAxMTQuNzk2QzYxLjkzNzYgMTE0LjU0OCA2MS45Mzc1IDExNC4zMDYgNjEuOTM3NSAxMTMuODFWMTEwLjM3MUM2MS45Mzc1IDEwOS42MjcgNjEuMjAwMSAxMDguNjQ4IDYwLjQ2MjYgMTA4LjE1MlpNODYuNTE2OSAzMS40NTIyQzg1LjUzMTYgMzAuOTYyNSA4NC41NTIyIDMxLjQ1MjIgODQuMzA0NCAzMi40Mzc1Qzg0LjA1NjYgMzIuNjg1MyA4NC4wNTY2IDMyLjkyNzIgODQuMDU2NiAzMy40MjI4VjM2Ljg2MjVDODQuMDU2NiAzNy44NDc4IDg0Ljc5NDIgMzguODI3MiA4NS41MzE3IDM5LjMyMjhDMTA0LjcwNyA0Ni4yMDgxIDExNC41NDIgNjcuNTk1NiAxMDcuNDA5IDg2LjUyMjhDMTAzLjcyMSA5Ni44NDc4IDk1LjYwODggMTA0LjcxMyA4NS41MzE3IDEwOC40Qzg0LjU0NjMgMTA4Ljg5IDg0LjA1NjYgMTA5LjYyNyA4NC4wNTY2IDExMC44NlYxMTQuM0M4NC4wNTY2IDExNS4yODUgODQuNTQ2MyAxMTYuMDIzIDg1LjUzMTcgMTE2LjI2NUM4NS43Nzk0IDExNi4yNjUgODYuMjY5MSAxMTYuMjY1IDg2LjUxNjkgMTE2LjAxN0MxMDkuODY5IDEwOC42NDIgMTIyLjY1NCA4My44MTQ3IDExNS4yNzkgNjAuNDU2NkMxMTAuODU0IDQ2LjQ1IDEwMC4wNCAzNS44NzcyIDg2LjUxNjkgMzEuNDUyMloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTEwXzYwNCIgeDE9IjUzLjQ3MzYiIHkxPSIxMjIuNzkiIHgyPSIxNC4wMzYyIiB5Mj0iODkuNTc4NiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xMTBfNjA0IiB4MT0iMTIwLjY1IiB5MT0iNTUuNjAyMSIgeDI9IjgxLjIxMyIgeTI9IjIyLjM5MTQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjIxIiBzdG9wLWNvbG9yPSIjRjE1QTI0Ii8+CjxzdG9wIG9mZnNldD0iMC42ODQxIiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg=="
            },
            {
                sortOrder: 5,
                symbol: "ckUSDT",
                name: "ckUSDT",
                tokenSymbol: "ckUSDT",
                tokenName: "ckUSDT",
                shortDecimal: 6,
                ledgerAddress: "cngnf-vqaaa-aaaar-qag4q-cai",
                indexAddress: "cefgz-dyaaa-aaaar-qag5a-cai",
                subAccounts: [
                    {
                        name: "Default",
                        subAccountId: "0x0",
                        ledgerAddress: "cngnf-vqaaa-aaaar-qag4q-cai",
                    },
                ],
                supportedStandards: [SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2],
                logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzYwIiBoZWlnaHQ9IjM2MCIgdmlld0JveD0iMCAwIDM2MCAzNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF84NzZfNzEpIj4KPHBhdGggZD0iTTE4MCAwQzI3OS40IDAgMzYwIDgwLjYgMzYwIDE4MEMzNjAgMjc5LjQgMjc5LjQgMzYwIDE4MCAzNjBDODAuNiAzNjAgMCAyNzkuNCAwIDE4MEMwIDgwLjYgODAuNiAwIDE4MCAwWiIgZmlsbD0iIzNCMDBCOSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTQwLjQwMDEgMTkwLjQwMkM0NS40MDAxIDI1OS40MDIgMTAwLjYgMzE0LjYwMiAxNjkuNiAzMTkuNjAyVjMzNS4yMDJDOTIuMDAwMSAzMzAuMDAyIDMwIDI2OC4wMDIgMjQuOCAxOTAuNDAySDQwLjQwMDFaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfODc2XzcxKSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2OS42IDQwLjQwMDhDMTAwLjYgNDUuNDAwOCA0NS40MDAxIDEwMC42MDEgNDAuNDAwMSAxNjkuNjAxSDI0LjhDMjkuOCA5Mi4wMDA4IDkyLjAwMDEgMjkuODAwOCAxNjkuNiAyNC44MDA4VjQwLjQwMDhaIiBmaWxsPSIjMjlBQkUyIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMzE5LjYgMTY5LjQwMkMzMTQuNiAxMDAuNDAyIDI1OS40IDQ1LjIwMTYgMTkwLjQgNDAuMjAxNlYyNC42MDE2QzI2OCAyOS44MDE2IDMzMC4yIDkxLjgwMTYgMzM1LjIgMTY5LjQwMkgzMTkuNloiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl84NzZfNzEpIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTkwLjQgMzE5LjYwMkMyNTkuNCAzMTQuNjAyIDMxNC42IDI1OS40MDIgMzE5LjYgMTkwLjQwMkgzMzUuMkMzMzAuMiAyNjguMDAyIDI2OCAzMzAuMDAyIDE5MC40IDMzNS4yMDJWMzE5LjYwMloiIGZpbGw9IiMyOUFCRTIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xOTUuODAxIDE4NS40MDdDMTk0LjkxNCAxODUuNDc0IDE5MC4zMzQgMTg1Ljc0OCAxODAuMTE5IDE4NS43NDhDMTcxLjk5MyAxODUuNzQ4IDE2Ni4yMjQgMTg1LjUwNCAxNjQuMiAxODUuNDA3QzEzMi43OTkgMTg0LjAyMyAxMDkuMzYxIDE3OC41NDUgMTA5LjM2MSAxNzEuOTg3QzEwOS4zNjEgMTY1LjQyOCAxMzIuNzk5IDE1OS45NTggMTY0LjIgMTU4LjU1MVYxNzkuOTUyQzE2Ni4yNTQgMTgwLjEgMTcyLjEzMyAxODAuNDQ4IDE4MC4yNTkgMTgwLjQ0OEMxOTAuMDA5IDE4MC40NDggMTk0Ljg5MiAxODAuMDQxIDE5NS43NzEgMTc5Ljk1OVYxNTguNTY2QzIyNy4xMDUgMTU5Ljk2NSAyNTAuNDkyIDE2NS40NDMgMjUwLjQ5MiAxNzEuOTg3QzI1MC40OTIgMTc4LjUzMSAyMjcuMTEzIDE4NC4wMDggMTk1Ljc3MSAxODUuNEwxOTUuODAxIDE4NS40MDdaTTE5NS44MDEgMTU2LjM1M1YxMzcuMjAzSDIzOS41M1YxMDhIMTIwLjQ3MVYxMzcuMjAzSDE2NC4xOTNWMTU2LjM0NUMxMjguNjU1IDE1Ny45ODEgMTAxLjkzIDE2NS4wMzYgMTAxLjkzIDE3My40OUMxMDEuOTMgMTgxLjk0MyAxMjguNjU1IDE4OC45OSAxNjQuMTkzIDE5MC42MzRWMjUySDE5NS43OTNWMTkwLjYxMUMyMzEuMjQ5IDE4OC45NzUgMjU3LjkzIDE4MS45MjggMjU3LjkzIDE3My40ODJDMjU3LjkzIDE2NS4wMzYgMjMxLjI3MiAxNTcuOTg5IDE5NS43OTMgMTU2LjM0NUwxOTUuODAxIDE1Ni4zNTNaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfODc2XzcxIiB4MT0iMTMwLjcyIiB5MT0iMzA0LjEyMiIgeDI9IjMzLjQ4IiB5Mj0iMjIyLjIyMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNFRDFFNzkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjNTIyNzg1Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl84NzZfNzEiIHgxPSIzMDkuMzIiIHkxPSIxMjMuMDYyIiB4Mj0iMjEyLjA4IiB5Mj0iNDEuMTYxNSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBvZmZzZXQ9IjAuMjEiIHN0b3AtY29sb3I9IiNGMTVBMjQiLz4KPHN0b3Agb2Zmc2V0PSIwLjY4IiBzdG9wLWNvbG9yPSIjRkJCMDNCIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxjbGlwUGF0aCBpZD0iY2xpcDBfODc2XzcxIj4KPHJlY3Qgd2lkdGg9IjM2MCIgaGVpZ2h0PSIzNjAiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="
            },
        ];
    }

}
