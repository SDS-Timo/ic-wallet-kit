import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { AddContactHandler, AssetRepository, SubAccountId } from "@ic-wallet-kit/icrc";

import { Container } from "typedi";


export const addContact = async (principal: string, contactName: string, ledgerAddress: string, subAccountId: string, subAccountName: string) => {

    const handler = Container.get(AddContactHandler);

    let assetRepository = Container.get("AssetRepository") as AssetRepository;

    const asset = await assetRepository.getAssetOrDefault(ledgerAddress);
    const assets = asset ? [{
        ledgerAddress: asset.ledgerAddress,
        subAccounts: [
            {
                name: subAccountName,
                subAccountId: SubAccountId.parseFromString(subAccountId)
            }
        ]
    }]
        : []
    const result = await handler.handle({
        principal: principal,
        name: contactName,
        assets: assets
    });

    consoleOutputFormJson(result);
}