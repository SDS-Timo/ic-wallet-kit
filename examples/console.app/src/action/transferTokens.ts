import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { Principal } from "@dfinity/principal";
import { SendTransactionHandler, SubAccountId } from "@ic-wallet-kit/icrc";
import Container from "typedi";

export const transferTokens = async (
    ledgerAddress: string,
    subAccountId: string,
    receiverAccountPrincipal: string,
    receiverSubAccountId: string,
    amount: string
) => {
    const sendTransactionHandler = Container.get(SendTransactionHandler);
    const result = await sendTransactionHandler.handle({
        //amount: "0.0001",
        //ledgerAddress: "ryjl3-tyaaa-aaaaa-aaaba-cai",
        //indexAddress: "",
        //receiverAccountPrincipal: Principal.fromText("svyv3-apmhd-zl4qv-4k422-25fte-eizwx-o66gb-sqw5u-64jzg-w5m56-nae"),
        //receiverSubAccountId: "0x0",
        //subAccountId: "0x0"

        ledgerAddress: ledgerAddress,
        subAccountId: SubAccountId.parseFromString(subAccountId)!,
        receiverAccountPrincipal: Principal.fromText(receiverAccountPrincipal),
        receiverSubAccountId: SubAccountId.parseFromString(receiverSubAccountId)!,
        amount: amount
    });

    consoleOutputFormJson(result);

}