import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "@icrc/candid/icrc84/icrc84.did";
import { _SERVICE as Icrc84Actor, TokenInfo } from "@icrc/candid/icrc84/icrc84.service.did";
import { Icrc84Error } from "@icrc/errors/icrc84Error";
import { SubAccountId } from "@icrc/types";
import { LocalCacheCreditModel, NotifyModel, WithdrawResult } from "@icrc/types/services";

export class Icrc84ActorWrapper {
    private constructor(private actor: ActorSubclass<Icrc84Actor>) {
    }

    static create(agent: HttpAgent, servicePrincipal: string) {
        const actor = Icrc84ActorWrapper.getIcrc84Actor(agent, servicePrincipal);
        return new Icrc84ActorWrapper(actor);
    }

    public async getSupportedAssets(): Promise<Principal[]> {
        try {
            const result = await this.actor.icrc84_supported_tokens();
            return result;
        }
        catch (e: any) {
            throw new Icrc84Error("getSupportedAssets", e.message);
        }
    }

    public async getAssetInfo(ledgerAddress: string): Promise<TokenInfo> {
        try {
            const result = await this.actor.icrc84_token_info(Principal.fromText(ledgerAddress));
            return result;
        }
        catch (e: any) {
            throw new Icrc84Error("getAssetInfo", e.message);
        }
    }

    public async getAllCredits(): Promise<LocalCacheCreditModel[]> {
        try {
            const credits = await this.actor.icrc84_all_credits();

            const result = credits.map((cr) => {
                return {
                    ledgerAddress: cr[0].toString(),
                    credit: cr[1]
                }
            });

            return result;
        }
        catch (e: any) {
            throw new Icrc84Error("getAllCredits", e.message);
        }
    }

    public async getCredit(ledgerAddress: string): Promise<bigint> {
        try {
            const result = await this.actor.icrc84_credit(Principal.fromText(ledgerAddress));
            return result;
        }
        catch (e: any) {
            throw new Icrc84Error("getCredit", e.message);
        }
    }

    public async trackedDeposit(ledgerAddress: string): Promise<bigint> {
        try {
            const response: any = await this.actor.icrc84_trackedDeposit(Principal.fromText(ledgerAddress));
            const result = response.Ok as bigint
            if (result || result === BigInt(0)) {
                return result
            }

            if (response.Err?.NotAvailable) {
                throw new Icrc84Error("tracked.deposit.error.not.available", response.Err.NotAvailable.message)
            }

            throw new Icrc84Error("tracked.deposit", "tracked deposit actor error");
        }
        catch (e: any) {
            throw new Icrc84Error("trackedDeposit", e.message);
        }
    }

    public async notify(ledgerAddress: string): Promise<NotifyModel> {
        try {
            const response: any = await this.actor.icrc84_notify({
                token: Principal.fromText(ledgerAddress)
            });
            if (response.Ok) {
                return {
                    Credit: response.Ok.credit,
                    CreditInc: response.Ok.credit_inc,
                    DepositInc: response.Ok.deposit_inc
                }
            }

            if (response.Err?.NotAvailable) {
                throw new Icrc84Error("notify.error.not.available", response.Err.NotAvailable.message)
            }
            if (response.Err?.CallLedgerError) {
                throw new Icrc84Error("notify.error.call.ledger.error", response.Err.CallLedgerError.message)
            }

            throw new Icrc84Error("notify", "notify actor error");
        }
        catch (e: any) {
            throw new Icrc84Error("notify", e.message);
        }
    }

    public async withdraw(owner: string, ledgerAddress: string, toSubAccount: [Uint8Array], amount: bigint, expectedFee: [] | [bigint]): Promise<WithdrawResult> {
        try {
            const response: any = await this.actor.icrc84_withdraw({
                token: Principal.fromText(ledgerAddress),
                to: {
                    owner: Principal.fromText(owner),
                    subaccount: toSubAccount,
                },
                amount: amount,
                expected_fee: expectedFee
            });
            if (response.Ok) {
                return {
                    txId: response.Ok.txid,
                    amount: response.Ok.amount
                };
            }

            if (response.Err?.AmountBelowMinimum) {
                throw new Icrc84Error("withdraw.amount.below.minimum", "Amount Below Minimum");
            }
            if (response.Err?.InsufficientCredit) {
                throw new Icrc84Error("withdraw.insufficient.credit", "Insufficient Credit");
            }
            if (response.Err?.CallLedgerError) {
                throw new Icrc84Error("withdraw.call.ledger.error", response.Err.CallLedgerError.message);
            }
            if (response.Err?.BadFee) {
                throw new Icrc84Error("withdraw.bad.fee", `Bad Expected Fee: ${response.Err.BadFee.expected_fee}`);
            }

            throw new Icrc84Error("withdraw", "withdraw actor error");
        }
        catch (e: any) {
            throw new Icrc84Error("withdraw custom message", e.message);
        }
    }
    public async principalToSubaccount(principal: Principal): Promise<SubAccountId | undefined> {
        try {
            const subAccount = await this.actor.principalToSubaccount(principal);
            if (subAccount.length > 0) {
                return SubAccountId.parseFromUint8Array(subAccount[0] as Uint8Array);
            }
            return undefined;
        }
        catch (e: any) {
            throw new Icrc84Error("principalToSubaccount", e.message);
        }
    }

    private static getIcrc84Actor(agent: HttpAgent, servicePrincipal: string): ActorSubclass<Icrc84Actor> {
        const ownersActor = Actor.createActor<Icrc84Actor>(idlFactory, {
            agent: agent,
            canisterId: servicePrincipal,
        });
        return ownersActor;
    }

}
