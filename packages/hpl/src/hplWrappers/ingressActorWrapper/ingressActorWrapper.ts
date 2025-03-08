import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { FtInfo, _SERVICE as IngressActor } from "@hpl/candid//ingress/ingress.service.did";
import { idlFactory } from "@hpl/candid/ingress/ingress.did";
import { FtAssetInfo, HplAccountCacheModel, HplStateVirtualAccountsCacheModel, HplVirtualAccountCacheModel, RemoteAccountSelectorCat, RemoteAccountSelectorId, RemoteAccountSelectorIdRange } from "@hpl/types";
import { AccountType } from "@hpl/types/accounts/accountType";
import { HplStateCacheModel } from "@hpl/types/cache/hplStateCacheModel";
import { State } from "@hpl/types/cache/state";
import { ILogger } from "@ic-wallet-kit/common";
import { IngressActorError } from "../../errors/ingressActor.error";

export class IngressActorWrapper {

  private constructor(private actor: ActorSubclass<IngressActor>,
    private logger: ILogger
  ) {
  }

  static create(agent: HttpAgent, canisterId: string, logger: ILogger) {
    const actor = IngressActorWrapper.getIngressActor(agent, canisterId);
    return new IngressActorWrapper(actor, logger);
  }

  public async getAccounts(): Promise<bigint> {
    try {
      const accounts = await this.actor.nAccounts();
      return accounts;
    }
    catch (e: any) {
      if (e.result?.reject_message === "Unknown caller") {
        return BigInt(0);
      }
      throw new IngressActorError("get.accounts", e.message);
    }
  }

  public async getVirtualAccounts(): Promise<bigint> {
    try {
      const virtualAccounts = await this.actor.nVirtualAccounts();
      return virtualAccounts;
    }
    catch (e: any) {
      if (e.result?.reject_message === "Unknown caller") {
        return BigInt(0);
      }
      throw new IngressActorError("get.virtual.accounts", e.message);
    }
  }

  public async getFtAssets(): Promise<bigint> {
    try {
      const ftAssets = await this.actor.nFtAssets();
      return ftAssets;
    }
    catch (e: any) {
      throw new IngressActorError("get.ftAssets", e.message);
    }
  }

  public async getAllAccountsInfo(accounts: bigint): Promise<HplAccountCacheModel[]> {
    try {
      const accountInfo = await this.actor.accountInfo(
        {
          idRange: [BigInt(0), [accounts - BigInt(1)]]
        }
      );

      const result = accountInfo.map((ai) => {
        return {
          accountId: ai[0],
          accountType: ai[1]
        }
      });

      return result;
    }
    catch (e: any) {
      if (e.result?.reject_message === "Unknown caller") {
        return [];
      }
      throw new IngressActorError("get.all.accounts.info", e.message);
    }
  }

  public async getAccountInfo(account: bigint): Promise<Array<[bigint, AccountType]> | []> {
    console.log(this.actor);
    try {
      const accountInfo = await this.actor.accountInfo(
        {
          id: account
        }
      );
      return accountInfo;
    }
    catch (e: any) {
      if (e.result?.reject_message === "Unknown caller") {
        return [];
      }
      throw new IngressActorError("get.accountInfo", e.message);
    }
  }

  public async getFtAssetInfo(ftAssets: bigint): Promise<Array<FtAssetInfo>> {
    try {
      const ftInfo = await this.actor.ftInfo(
        {
          idRange: [BigInt(0), [ftAssets - BigInt(1)]]
        }
      );
      return this.parseFtInfo(ftInfo);
    }
    catch (e: any) {
      throw new IngressActorError("get.ftInfo", e.message);
    }
  }

  public async getAllVirtualAccountInfo(virtualAccounts: bigint): Promise<HplVirtualAccountCacheModel[]> {
    try {
      const virtualAccountInfo = await this.actor.virtualAccountInfo(
        {
          idRange: [BigInt(0), [virtualAccounts - BigInt(1)]]
        }
      );
      const result = virtualAccountInfo.map((vai) => {
        return {
          virtualAccountId: vai[0],
          virtualAccountInfo: {
            accountType: vai[1][0],
            principal: vai[1][1].toString()
          }
        }
      });

      return result;
    }
    catch (e: any) {
      throw new IngressActorError("get.virtualAccountInfo", e.message);
    }
  }

  public async getState(
    virtualAccounts: bigint,
    ftAssets: bigint,
    accounts: bigint,
    remotesToLook: [] | [RemoteAccountSelectorId | RemoteAccountSelectorCat | RemoteAccountSelectorIdRange]
  ): Promise<HplStateCacheModel> {
    try {
      const state = await this.actor.state(
        {
          ftSupplies: ftAssets > BigInt(0) ? [{ idRange: [BigInt(0), [ftAssets - BigInt(1)]] }] : [],
          virtualAccounts: virtualAccounts > BigInt(0) ? [{ idRange: [BigInt(0), [virtualAccounts - BigInt(1)]] }] : [],
          accounts: accounts > BigInt(0) ? [{ idRange: [BigInt(0), [accounts - BigInt(1)]] }] : [],
          remoteAccounts: remotesToLook,
        }
      );
      return this.parseState(state);
    }
    catch (e: any) {
      throw new IngressActorError("get.state", e.message);
    }
  }

  public async getVirtualAccountState(virtualAccountId: bigint): Promise<HplStateVirtualAccountsCacheModel> {
    let result: HplStateVirtualAccountsCacheModel | undefined;
    try {
      const stateResult = await this.actor.state(
        {
          ftSupplies: [],
          virtualAccounts: [{ id: virtualAccountId }],
          accounts: [],
          remoteAccounts: [],
        }
      );
      const state = this.parseState(stateResult);
      result = state.virtualAccounts.find((vt) => vt.virtualAccountId === virtualAccountId)
    }
    catch (e: any) {
      throw new IngressActorError("get.virtualAccountState", e.message);
    }
    if (!result) {
      throw new IngressActorError("get.virtualAccountState.not.found", "VirtualAccount not found");
    }
    return result;
  }

  public async getAdminState(): Promise<HplStateCacheModel> {
    try {
      const state = await this.actor.adminState(
        {
          ftSupplies: [],
          virtualAccounts: [],
          accounts: [{ idRange: [BigInt(0), []] }],
          remoteAccounts: [],
        }
      );

      return this.parseState(state);
    }
    catch (e: any) {
      throw new IngressActorError("get.admin.state", e.message);
    }
  }

  public async openAccount(ftAssetId: bigint): Promise<bigint> {
    try {
      const response: any = await this.actor.openAccounts([{
        ft: ftAssetId
      }])

      if (response.ok && response.ok.first) {
        return response.ok.first
      }

      if (response.err?.InvalidArguments) {
        throw new IngressActorError("open.account.error.invalid.arguments", response.err.InvalidArguments)
      }

      if (response.err?.NoSpaceForPrincipal) {
        throw new IngressActorError("open.account.error.no.space.for.principal", response.err.NoSpaceForPrincipal)
      }

      if (response.err?.NoSpaceForSubaccount) {
        throw new IngressActorError("open.account.error.no.space.for.subaccount", response.err.NoSpaceForSubaccount)
      }

      throw new IngressActorError("open.account", "open account actor error");

    }
    catch (e: any) {
      throw new IngressActorError("open.account", e.message);
    }
  }

  public async openVirtualAccount(assetId: bigint, accountId: bigint, accessByPrincipal: Principal, amount: bigint, expiration?: bigint): Promise<bigint> {
    try {
      const response: any = await this.actor.openVirtualAccounts([
        [
          { ft: assetId },
          accessByPrincipal,
          { ft: amount },
          accountId,
          expiration ? expiration : BigInt(0),
        ],
      ])

      if (response.ok && response.ok.first) {
        return response.ok.first
      }

      if (response.err?.InvalidArguments) {
        throw new IngressActorError("open.virtual.account.error.invalid.arguments", response.err.InvalidArguments)
      }

      if (response.err?.NoSpaceForAccount) {
        throw new IngressActorError("open.virtual.account.error.no.space.for.account", response.err.NoSpaceForAccount)
      }

      throw new IngressActorError("open.virtual.account", "open virtualAccount actor error");

    }
    catch (e: any) {

      this.logger.logError(e, "IngressActorWrapper openVirtualAccount");

      throw new IngressActorError("open.virtual.account", e.message);
    }
  }

  public async updateVirtualAccount(virtualAccountId: bigint, accountId: bigint, amount: bigint, expiration?: bigint): Promise<[bigint, bigint]> {
    try {
      const response: any = await this.actor.updateVirtualAccounts([
        [
          virtualAccountId,
          {
            backingAccount: [accountId],
            state: [{ ft_set: amount }],
            expiration: expiration ? [expiration] : [],
          },
        ],
      ])

      if (response.ok && response.ok[0] && response.ok[0].ft) {
        return response.ok[0].ft;
      }

      if (response.err?.InvalidArguments) {
        throw new IngressActorError("update.virtual.account.error.invalid.arguments", response.err.InvalidArguments);
      }

      if (response.err?.InsufficientFunds) {
        throw new IngressActorError("update.virtual.account.error.insufficient.funds", response.err.InsufficientFunds);
      }

      if (response.err?.DeletedVirtualAccount) {
        throw new IngressActorError("update.virtual.account.error.deleted", response.err.DeletedVirtualAccount);
      }

      throw new IngressActorError("update.virtual.account", "update virtualAccount actor error");

    }
    catch (e: any) {
      throw new IngressActorError("update.virtual.account", e.message);
    }
  }

  public async deleteVirtualAccounts(virtualAccountId: bigint): Promise<Array<{ ft: bigint }>> {
    try {
      const response: any = await this.actor.deleteVirtualAccounts([virtualAccountId])

      if (response.ok?.length > 0 && response.ok) {
        return response.ok
      }

      if (response.err?.InvalidArguments) {
        throw new IngressActorError("delete.virtual.account.error.invalid.arguments", response.err.InvalidArguments)
      }

      if (response.err?.DeletedVirtualAccount) {
        throw new IngressActorError("delete.virtual.account.error", response.err.DeletedVirtualAccount)
      }

      throw new IngressActorError("delete.virtual.account", "Delete virtualAccount actor error");

    }
    catch (e: any) {
      throw new IngressActorError("delete.virtual.account", e.message);
    }
  }

  public async remoteAccountInfo(selector: RemoteAccountSelectorId | RemoteAccountSelectorCat | RemoteAccountSelectorIdRange) {
    try {
      const remoteAccountInfo = await this.actor.remoteAccountInfo(selector);
      return remoteAccountInfo;
    }
    catch (e: any) {
      throw new IngressActorError("get.remoteAccountInfo", e.message);
    }
  }

  public async feeRatio(): Promise<bigint> {
    try {
      const feeConstant = await this.actor.feeRatio();
      return feeConstant;
    }
    catch (e: any) {
      throw new IngressActorError("get.fee.ratio", e.message);
    }
  }

  private parseState(state: State): HplStateCacheModel {
    const result: HplStateCacheModel =
    {
      ftSupplies: state.ftSupplies.map((sup) => {
        return {
          assetId: sup[0],
          ftSupply: sup[1]
        }
      }),
      accounts: state.accounts.map((acc) => {
        return {
          accountId: acc[0],
          accountState: acc[1]
        }
      }),
      virtualAccounts: state.virtualAccounts.map((acc) => {
        return {
          virtualAccountId: acc[0],
          accountState: acc[1][0],
          accountId: acc[1][1],
          time: acc[1][2]
        }
      }),
      remoteAccounts: state.remoteAccounts.map((ra) => {
        return {
          remotePrincipal: ra[0][0].toString(),
          remoteAccountId: ra[0][1],
          accountState: ra[1][0],
          time: ra[1][1]
        }
      })
    }

    return result;
  }

  private parseFtInfo(ftAssets: Array<[bigint, FtInfo]>) {
    const result: FtAssetInfo[] = [];
    ftAssets.forEach((ftAsset) => {
      const item: FtAssetInfo = {
        assetId: ftAsset[0],
        controller: ftAsset[1].controller.toString(),
        decimals: ftAsset[1].decimals,
        description: ftAsset[1].description
      }
      result.push(item);
    })
    return result;
  }

  private static getIngressActor(agent: HttpAgent, canister: string): ActorSubclass<IngressActor> {
    const canisterId = Principal.fromText(canister);
    const ingressActor = Actor.createActor<IngressActor>(idlFactory, {
      agent,
      canisterId
    });
    return ingressActor;
  }
}
