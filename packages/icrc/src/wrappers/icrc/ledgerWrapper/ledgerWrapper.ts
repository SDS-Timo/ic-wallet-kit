import { HttpAgent } from "@dfinity/agent";
import { AllowanceParams, ApproveParams, IcrcLedgerCanister, IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { IcrcLegerError } from "@icrc/errors/icrcLedgerError";
import { MetadataInfo, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";

export class LedgerWrapper {

    private constructor(private icrcLedgerCanister: IcrcLedgerCanister) {

    }

    static create(agent: HttpAgent, ledgerAddress: any) {
        const icrcLedgerCanister = LedgerWrapper.getIcrcLedgerCanister(agent, ledgerAddress);
        return new LedgerWrapper(icrcLedgerCanister);
    }

    public async getBalance(subAccountId: SubAccountId, principal: Principal): Promise<bigint> {
        try {
            const balance = await this.icrcLedgerCanister.balance({
                owner: principal,
                subaccount: subAccountId.toUint8Array(),
                certified: false,
            });

            return balance;
        }
        catch (e: any) {
            throw new IcrcLegerError("get.balance.generic", e.message);
        }
    }

    public async transfer(info: TransferInfo): Promise<bigint> {
        try {

            const blockIndex = await this.icrcLedgerCanister.transfer({
                to: {
                    owner: info.toAccountPrincipal,
                    subaccount: info.toSubAccountId ? [info.toSubAccountId.toUint8Array()] : [],
                },
                amount: info.amount,
                from_subaccount: info.fromSubAccountId.toUint8Array(),
            });

            return blockIndex;

        } catch (e: any) {

            let message = e.message as string;

            const searchMessage = "Reject text: ";
            let indexOfMessage = message.indexOf("Reject text: ");

            if (indexOfMessage >= 0) {
                message = message.substring(indexOfMessage + searchMessage.length).trim();

                throw new IcrcLegerError("transfer.rejected", message);
            }
            throw new IcrcLegerError("transfer.generic", e.message);
        }
    }

    public async transferFrom(info: TransferFromInfo): Promise<bigint> {
        try {
            const blockIndex = await this.icrcLedgerCanister.transferFrom({
                from: {
                    owner: info.fromAccountPrincipal,
                    subaccount: [info.fromSubAccountId.toUint8Array()]
                },
                to: {
                    owner: info.toAccountPrincipal,
                    subaccount: [info.toSubAccountId.toUint8Array()]
                },
                amount: info.amount
            });
            return blockIndex;
        }
        catch (e: any) {
            let message = e.message as string;

            const searchMessage = "Reject text: ";
            let indexOfMessage = message.indexOf("Reject text: ");

            if (indexOfMessage >= 0) {
                message = message.substring(indexOfMessage + searchMessage.length).trim();

                throw new IcrcLegerError("transfer.rejected", message);
            }
            throw new IcrcLegerError("transfer.generic", e.message);
        }

    }

    public async getIcrcMetadataInfo() {

        try {
            const metadata = await this.icrcLedgerCanister.metadata({
                certified: false,
            });

            return LedgerWrapper.parseMetadataInfo(metadata);
        }
        catch (e: any) {

            let message = e.message as string;

            const searchMessage = "Body: ";
            let indexOfMessage = message.indexOf(searchMessage);

            if (indexOfMessage >= 0) {
                message = message.substring(indexOfMessage + searchMessage.length).trim();

                throw new IcrcLegerError("get.metadata.bad.request", message);
            }

            throw new IcrcLegerError("get.metadata.generic", e.message);
        }
    }

    public async getTransactionFee() {

        try {
            const transactionFee = await this.icrcLedgerCanister.transactionFee({
                certified: false,
            });

            return transactionFee;
        }
        catch (e: any) {

            throw new IcrcLegerError("get.transaction.fee.generic", e.message);
        }
    }

    public async getAllowance(ownerPrincipal: Principal, spenderPrincipal: Principal, subaccount: SubAccountId, spenderSubaccount?: SubAccountId) {
        try {

            const param: AllowanceParams = {
                spender: {
                    owner: spenderPrincipal,
                    subaccount: spenderSubaccount
                        ? [spenderSubaccount.toUint8Array()]
                        : []
                },
                account: {
                    owner: ownerPrincipal,
                    subaccount: [subaccount.toUint8Array()]
                }
            }
            const allowance = await this.icrcLedgerCanister.allowance(param);

            return {
                allowance: allowance.allowance,
                expiration: this.convertDate(allowance.expires_at)
            };
        }
        catch (e: any) {

            throw new IcrcLegerError("approve.allowance.generic", e.message);
        }
    }

    private convertDate(expiresAt: [] | [bigint]): bigint | undefined {
        return expiresAt.length > 0 ? expiresAt[0] : undefined
    }

    public static async approveAllowance(info: AllowanceDataModel, agent: HttpAgent) {
        const ledgerWrapper = LedgerWrapper.create(agent, info.ledgerAddress);
        await ledgerWrapper.approveAllowance(info);
    }

    public async approveAllowance(info: AllowanceDataModel) {
        try {

            const params: ApproveParams = {
                amount: info.amount,
                spender: {
                    owner: Principal.fromText(info.spenderPrincipal),
                    subaccount: [info.spenderSubId.toUint8Array()]
                },
                from_subaccount: info.subAccountId.toUint8Array(),
                expires_at: info.expiration ? BigInt(info.expiration) : undefined
            }

            const result = await this.icrcLedgerCanister.approve(params);

            return result;
        }
        catch (e: any) {

            throw new IcrcLegerError("approve.allowance", e.message);
        }
    }

    public static parseMetadataInfo(metadata: IcrcTokenMetadataResponse): MetadataInfo {
        let symbol = "symbol";
        let name = "symbol";
        let decimals = 0;
        let logo = "";
        let fee = BigInt(0);

        metadata.map((dt: any) => {
            if (dt[0] === "icrc1:symbol") {
                const auxSymbol = dt[1] as { Text: string };
                symbol = auxSymbol.Text;
            }
            if (dt[0] === "icrc1:name") {
                const auxName = dt[1] as { Text: string };
                name = auxName.Text;
            }
            if (dt[0] === "icrc1:decimals") {
                const auxDec = dt[1] as any;
                decimals = Number(auxDec.Nat);
            }
            if (dt[0] === "icrc1:logo") {
                const auxName = dt[1] as { Text: string };
                logo = auxName.Text;
            }
            if (dt[0] === "icrc1:fee") {
                const feeList = dt[1] as { Nat: number[] };

                let feeRaw = feeList.Nat[0];

                if (!feeRaw) {
                    const feeNumber = dt[1] as { Nat: number };
                    feeRaw = feeNumber.Nat;
                }

                fee = BigInt(feeRaw);
            }

        });

        return { symbol, name, decimals, logo, fee: fee };
    }

    private static getIcrcLedgerCanister(agent: HttpAgent, ledgerAddress: any): IcrcLedgerCanister {

        try {
            const result = IcrcLedgerCanister.create({
                agent: agent,
                canisterId: ledgerAddress,
            });

            return result;
        }
        catch (e: any) {
            if (e.message && e.message.toString().indexOf("Canister ID is required") > -1) {
                throw e;
            }

            throw new IcrcLegerError("getIcrcLedgerCanister", e.message);
        }
    }
}

export interface TransferInfo {
    fromSubAccountId: SubAccountId;
    toAccountPrincipal: Principal;
    toSubAccountId?: SubAccountId;
    amount: bigint;
}

export interface TransferFromInfo {
    fromAccountPrincipal: Principal;
    fromSubAccountId: SubAccountId;
    toAccountPrincipal: Principal;
    toSubAccountId: SubAccountId;
    amount: bigint;
}