import { Actor } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { mockCanisterService } from "@hpl/__tests_utils/mockConstrains";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { seedToIdentifierService } from "@hpl/__tests_utils/seedToIdentity";
import { IngressActorError } from "@hpl/errors";
import { IngressActorWrapper } from "@hpl/hplWrappers/ingressActorWrapper/ingressActorWrapper";


describe("IngressActorWrapper Tests", () => {
  const principal = "gjcgk-x4xlt-6dzvd-q3mrr-pvgj5-5bjoe-beege-n4b7d-7hna5-pa5uq-5qe";
  const controller = "2vxsx-fae";

  const state = {
    ftSupplies: [[1n, 11n]],
    virtualAccounts: [[3n, [{ ft: 1n }, 2n, 0n]]],
    accounts: [[2n, { ft: 1n }]],
    remoteAccounts: [[[Principal.fromText(principal), 3n], [{ ft: 1n }, 0n]]]
  }

  const mockStateData = {
    ftSupplies: [
      {
        assetId: 1n,
        ftSupply: 11n
      }
    ],
    virtualAccounts: [
      {
        accountId: 2n,
        accountState: {
          ft: 1n
        },
        time: 0n,
        virtualAccountId: 3n
      }
    ],
    accounts: [{
      accountId: 2n,
      accountState: {
        ft: 1n
      }
    }],
    remoteAccounts: [{
      accountState: {
        ft: 1n
      },
      remoteAccountId: 3n,
      remotePrincipal: principal,
      time: 0n,
    }]
  };

  let logger: MockLogger;
  let identifierService: ReturnType<typeof seedToIdentifierService>;
  let wrapper: IngressActorWrapper;
  let mockMarketActor = {
    nAccounts: jest.fn().mockResolvedValue(Promise.resolve(2n)),
    accountInfo: jest.fn().mockResolvedValue(Promise.resolve([[2n, { ft: 1n }]])),
    nVirtualAccounts: jest.fn().mockResolvedValue(Promise.resolve(3n)),
    virtualAccountInfo: jest.fn().mockResolvedValue(Promise.resolve([[3n, [{ ft: 1n }, Principal.fromText(principal)]]])),
    nFtAssets: jest.fn().mockResolvedValue(Promise.resolve(1n)),
    ftInfo: jest.fn().mockResolvedValue(Promise.resolve([[1n, { controller: Principal.fromText(controller), decimals: 8, description: "mock-description" }]])),
    state: jest.fn().mockResolvedValue(Promise.resolve(state)),
    adminState: jest.fn().mockResolvedValue(Promise.resolve(state)),
    openAccounts: jest.fn().mockResolvedValue(Promise.resolve({ ok: { first: 21n } })),
    openVirtualAccounts: jest.fn().mockResolvedValue(Promise.resolve({ ok: { first: 31n } })),
    updateVirtualAccounts: jest.fn().mockResolvedValue(Promise.resolve({ ok: [{ ft: 1n }] })),
    deleteVirtualAccounts: jest.fn().mockResolvedValue(Promise.resolve({ ok: [{ ft: 1n }] })),
    remoteAccountInfo: jest.fn().mockResolvedValue(Promise.resolve([[[Principal.fromText(principal), 2n], { ft: 1n }]])),
    feeRatio: jest.fn().mockResolvedValue(Promise.resolve(1n))
  };
  Actor.createActor = jest.fn().mockReturnValue(mockMarketActor);

  beforeEach(() => {
    logger = new MockLogger();
    identifierService = seedToIdentifierService("b");
    wrapper = IngressActorWrapper.create(identifierService.getAgent(), mockCanisterService.getLedgerCanisterId(), logger);
  });

  it("should return accounts", async () => {
    const result = await wrapper.getAccounts();
    expect(result).toEqual(2n);
  });

  it("should return account info", async () => {
    const result = await wrapper.getAccountInfo(BigInt(2));
    await expect(result).toEqual([[2n, { "ft": 1n }]]);
  });

  it("should return all accounts info", async () => {
    const result = await wrapper.getAllAccountsInfo(BigInt(2));
    await expect(result).toEqual([{ accountId: 2n, accountType: { "ft": 1n } }]);
  });

  it("should return ftAssets", async () => {
    const result = await wrapper.getFtAssets();
    expect(result).toEqual(1n);
  });

  it("should return FtAssets info", async () => {
    const mockData = [{
      assetId: 1n,
      controller: controller,
      decimals: 8,
      description: "mock-description"
    }];
    const result = await wrapper.getFtAssetInfo(BigInt(1));
    expect(result).toEqual(mockData);
  });

  it("should return virtual accounts", async () => {
    const result = await wrapper.getVirtualAccounts();
    expect(result).toEqual(3n);
  });

  it("should return all virtual accounts info", async () => {
    const mockData = [{
      virtualAccountId: 3n,
      virtualAccountInfo: {
        accountType: {
          ft: 1n
        },
        principal: principal
      }
    }];
    const result = await wrapper.getAllVirtualAccountInfo(BigInt(3));
    expect(result).toEqual(mockData);
  });

  it("should return state", async () => {
    const result = await wrapper.getState(3n, 1n, 2n, [{ id: [Principal.fromText(principal), 3n] }]);
    expect(result).toEqual(mockStateData);
  });

  it("should return state without asset, account, virtual account ", async () => {
    const result = await wrapper.getState(0n, 0n, 0n, [{ id: [Principal.fromText(principal), 3n] }]);
    expect(result).toEqual(mockStateData);
  });

  it("should return virtual account state", async () => {
    const result = await wrapper.getVirtualAccountState(3n);
    expect(result).toEqual(mockStateData.virtualAccounts[0]);
  });

  it("should return admin state", async () => {
    const result = await wrapper.getAdminState();
    expect(result).toEqual(mockStateData);
  });

  it("should return open account", async () => {
    const result = await wrapper.openAccount(1n);
    expect(result).toEqual(21n);
  });

  it("should return open virtual account with expiration", async () => {
    const result = await wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n, 1n);
    expect(result).toEqual(31n);
  });

  it("should return open virtual account without expiration", async () => {
    const result = await wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n);
    expect(result).toEqual(31n);
  });

  it("should return update virtual account with expiration", async () => {
    const result = await wrapper.updateVirtualAccount(31n, 2n, 10n, 1n);
    expect(result).toEqual(1n);
  });

  it("should return update virtual account without expiration", async () => {
    const result = await wrapper.updateVirtualAccount(31n, 2n, 10n);
    expect(result).toEqual(1n);
  });

  it("should return delete virtual account with expiration", async () => {
    const result = await wrapper.deleteVirtualAccounts(31n);
    expect(result).toEqual([{ ft: 1n }]);
  });

  it("should return remote account info", async () => {
    const result = await wrapper.remoteAccountInfo({
      id: [Principal.fromText(principal), 2n]
    });
    expect(result).toEqual([[[Principal.fromText(principal), 2n], { ft: 1n }]]);
  });

  it("should return feeRatio", async () => {
    const result = await wrapper.feeRatio();
    expect(result).toEqual(1n);
  });

  it("should return account error Unknown caller", async () => {
    mockMarketActor.nAccounts = jest.fn().mockRejectedValue({
      result: {
        reject_message: "Unknown caller"
      }
    });
    const result = await wrapper.getAccounts();
    expect(result).toEqual(0n);
  });

  it("should return account error", async () => {
    mockMarketActor.nAccounts = jest.fn().mockRejectedValue(new IngressActorError("get.all.accounts.info", "Error"));
    await expect(wrapper.getAccounts()).rejects.toThrow(new IngressActorError("get.all.accounts.info", "Error"));
  });

  it("should return account info error Unknown caller", async () => {
    mockMarketActor.accountInfo = jest.fn().mockRejectedValue({
      result: {
        reject_message: "Unknown caller"
      }
    });
    const result = await wrapper.getAccountInfo(BigInt(2));
    expect(result).toEqual([]);
  });

  it("should return account info error", async () => {
    mockMarketActor.accountInfo = jest.fn().mockRejectedValue(new IngressActorError("get.accountInfo", "Error"));
    await expect(wrapper.getAccountInfo(BigInt(2))).rejects.toThrow(new IngressActorError("get.accountInfo", "Error"));
  });

  it("should return all accounts info error Unknown caller", async () => {
    mockMarketActor.accountInfo = jest.fn().mockRejectedValue({
      result: {
        reject_message: "Unknown caller"
      }
    });
    const result = await wrapper.getAllAccountsInfo(BigInt(2));
    expect(result).toEqual([]);
  });

  it("should return all account error", async () => {
    mockMarketActor.accountInfo = jest.fn().mockRejectedValue(new IngressActorError("get.accounts", "nAccounts error"));
    await expect(wrapper.getAllAccountsInfo(BigInt(2))).rejects.toThrow(new IngressActorError("get.accounts", "nAccounts error"));
  });

  it("should return virtualAccount error Unknown caller", async () => {
    mockMarketActor.nVirtualAccounts = jest.fn().mockRejectedValue({
      result: {
        reject_message: "Unknown caller"
      }
    });
    const result = await wrapper.getVirtualAccounts();
    expect(result).toEqual(0n);
  });

  it("should return virtualAccount error", async () => {
    mockMarketActor.nVirtualAccounts = jest.fn().mockRejectedValue(new IngressActorError("get.virtual.accounts", "Error"));
    await expect(wrapper.getVirtualAccounts()).rejects.toThrow(new IngressActorError("get.virtual.accounts", "Error"));
  });

  it("should return virtualAccount info error", async () => {
    mockMarketActor.virtualAccountInfo = jest.fn().mockRejectedValue(new IngressActorError("get.virtualAccountInfo", "Error"));
    await expect(wrapper.getAllVirtualAccountInfo(BigInt(0))).rejects.toThrow(new IngressActorError("get.virtualAccountInfo", "Error"));
  });

  it("should return ftAssets error", async () => {
    mockMarketActor.nFtAssets = jest.fn().mockRejectedValue(new IngressActorError("get.virtual.accounts", "Error"));
    await expect(wrapper.getFtAssets()).rejects.toThrow(new IngressActorError("get.virtual.accounts", "Error"));
  });

  it("should return ftAsset info error", async () => {
    mockMarketActor.ftInfo = jest.fn().mockRejectedValue(new IngressActorError("get.ftInfo", "Error"));
    await expect(wrapper.getFtAssetInfo(BigInt(1n))).rejects.toThrow(new IngressActorError("get.ftInfo", "Error"));
  });

  it("should return state error", async () => {
    mockMarketActor.state = jest.fn().mockRejectedValue(new IngressActorError("get.state", "Error"));
    await expect(wrapper.getState(3n, 1n, 2n, [])).rejects.toThrow(new IngressActorError("get.state", "Error"));
  });

  it("should return virtual account state not found", async () => {
    mockMarketActor.state = jest.fn().mockResolvedValue(Promise.resolve(state));
    await expect(wrapper.getVirtualAccountState(4n)).rejects.toThrow(new IngressActorError("get.virtualAccountInfo.not.found", "VirtualAccount not found"));
  });

  it("should return virtual account state error", async () => {
    mockMarketActor.state = jest.fn().mockRejectedValue(new IngressActorError("get.virtualAccountState", "Error"));
    await expect(wrapper.getVirtualAccountState(3n)).rejects.toThrow(new IngressActorError("get.virtualAccountState", "Error"));
  });

  it("should return admin state error", async () => {
    mockMarketActor.adminState = jest.fn().mockRejectedValue(new IngressActorError("get.admin.state", "Error"));
    await expect(wrapper.getAdminState()).rejects.toThrow(new IngressActorError("get.admin.state", "Error"));
  });

  it("should return open account InvalidArguments", async () => {
    mockMarketActor.openAccounts = jest.fn().mockReturnValue({ err: { InvalidArguments: "InvalidArguments" } });
    await expect(wrapper.openAccount(1n)).rejects.toThrow(new IngressActorError("open.account.error.invalid.arguments", "InvalidArguments"));
  });

  it("should return open account NoSpaceForPrincipal", async () => {
    mockMarketActor.openAccounts = jest.fn().mockReturnValue({ err: { NoSpaceForPrincipal: "NoSpaceForPrincipal" } });
    await expect(wrapper.openAccount(1n)).rejects.toThrow(new IngressActorError("open.account.error.no.space.for.principal", "NoSpaceForPrincipal"));
  });

  it("should return open account NoSpaceForSubaccount", async () => {
    mockMarketActor.openAccounts = jest.fn().mockReturnValue({ err: { NoSpaceForSubaccount: "NoSpaceForSubaccount" } });
    await expect(wrapper.openAccount(1n)).rejects.toThrow(new IngressActorError("open.account.error.no.space.for.subaccount", "NoSpaceForSubaccount"));
  });

  it("should return open account actor error", async () => {
    mockMarketActor.openAccounts = jest.fn().mockReturnValue({});
    await expect(wrapper.openAccount(1n)).rejects.toThrow(new IngressActorError("open.account", "open account actor error"));
  });

  it("should return open account error", async () => {
    mockMarketActor.openAccounts = jest.fn().mockRejectedValue(new IngressActorError("open.account", "Error"));
    await expect(wrapper.openAccount(1n)).rejects.toThrow(new IngressActorError("open.account", "Error"));
  });

  it("should return open virtual account InvalidArguments", async () => {
    mockMarketActor.openVirtualAccounts = jest.fn().mockReturnValue({ err: { InvalidArguments: "InvalidArguments" } });
    await expect(wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n, 0n)).rejects.toThrow(new IngressActorError("open.virtual.account.error.invalid.arguments", "InvalidArguments"));
  });

  it("should return open virtual account NoSpaceForSubaccount", async () => {
    mockMarketActor.openVirtualAccounts = jest.fn().mockReturnValue({ err: { NoSpaceForAccount: "NoSpaceForAccount" } });
    await expect(wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n, 0n)).rejects.toThrow(new IngressActorError("open.virtual.account.error.no.space.for.account", "NoSpaceForAccount"));
  });

  it("should return open virtual account actor error", async () => {
    mockMarketActor.openVirtualAccounts = jest.fn().mockReturnValue({});
    await expect(wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n, 0n)).rejects.toThrow(new IngressActorError("open.virtual.account", "open virtualAccount actor error"));
  });

  it("should return open virtual account actor", async () => {
    logger.logError = jest.fn();
    mockMarketActor.openVirtualAccounts = jest.fn().mockRejectedValue(new IngressActorError("open.virtual.account", "Error"));
    await expect(wrapper.openVirtualAccount(1n, 2n, Principal.fromText(principal), 10n, 0n)).rejects.toThrow(new IngressActorError("open.virtual.account", "Error"));
    expect(logger.logError).toHaveBeenCalledWith(new IngressActorError("open.virtual.account", "Error"), "IngressActorWrapper openVirtualAccount");
  });

  it("should return update virtual account InvalidArguments", async () => {
    mockMarketActor.updateVirtualAccounts = jest.fn().mockReturnValue({ err: { InvalidArguments: "InvalidArguments" } });
    await expect(wrapper.updateVirtualAccount(1n, 2n, 10n, 0n)).rejects.toThrow(new IngressActorError("update.virtual.account.error.invalid.arguments", "InvalidArguments"));
  });

  it("should return update virtual account NoSpaceForSubaccount", async () => {
    mockMarketActor.updateVirtualAccounts = jest.fn().mockReturnValue({ err: { InsufficientFunds: "InsufficientFunds" } });
    await expect(wrapper.updateVirtualAccount(1n, 2n, 10n, 0n)).rejects.toThrow(new IngressActorError("update.virtual.account.error.insufficient.funds", "InsufficientFunds"));
  });

  it("should return update virtual account DeletedVirtualAccount", async () => {
    mockMarketActor.updateVirtualAccounts = jest.fn().mockReturnValue({ err: { DeletedVirtualAccount: "DeletedVirtualAccount" } });
    await expect(wrapper.updateVirtualAccount(1n, 2n, 10n, 0n)).rejects.toThrow(new IngressActorError("update.virtual.account.error.deleted", "DeletedVirtualAccount"));
  });

  it("should return update virtual account actor error", async () => {
    mockMarketActor.updateVirtualAccounts = jest.fn().mockReturnValue({});
    await expect(wrapper.updateVirtualAccount(1n, 2n, 10n, 0n)).rejects.toThrow(new IngressActorError("update.virtual.account", "update virtualAccount actor error"));
  });

  it("should return update virtual account actor error", async () => {
    mockMarketActor.updateVirtualAccounts = jest.fn().mockRejectedValue(new IngressActorError("update.virtual.account", "Error"));
    await expect(wrapper.updateVirtualAccount(1n, 2n, 10n, 0n)).rejects.toThrow(new IngressActorError("update.virtual.account", "Error"));
  });

  it("should return delete virtual account InvalidArguments", async () => {
    mockMarketActor.deleteVirtualAccounts = jest.fn().mockReturnValue({ err: { InvalidArguments: "InvalidArguments" } });
    await expect(wrapper.deleteVirtualAccounts(31n)).rejects.toThrow(new IngressActorError("delete.virtual.account.error.invalid.arguments", "InvalidArguments"));
  });

  it("should return delete virtual account DeletedVirtualAccount", async () => {
    mockMarketActor.deleteVirtualAccounts = jest.fn().mockReturnValue({ err: { DeletedVirtualAccount: "DeletedVirtualAccount" } });
    await expect(wrapper.deleteVirtualAccounts(31n)).rejects.toThrow(new IngressActorError("delete.virtual.account.error", "DeletedVirtualAccount"));
  });

  it("should return delete virtual account actor error", async () => {
    mockMarketActor.deleteVirtualAccounts = jest.fn().mockReturnValue({});
    await expect(wrapper.deleteVirtualAccounts(31n)).rejects.toThrow(new IngressActorError("delete.virtual.account", "Delete virtualAccount actor error"));
  });

  it("should return delete virtual account actor error", async () => {
    mockMarketActor.deleteVirtualAccounts = jest.fn().mockRejectedValue(new IngressActorError("delete.virtual.account", "Error"));
    await expect(wrapper.deleteVirtualAccounts(31n)).rejects.toThrow(new IngressActorError("delete.virtual.account", "Error"));
  });

  it("should return remote account info error", async () => {
    mockMarketActor.remoteAccountInfo = jest.fn().mockRejectedValue(new IngressActorError("get.remoteAccountInfo", "Error"));
    await expect(wrapper.remoteAccountInfo({ id: [Principal.fromText(principal), 2n] })).rejects.toThrow(new IngressActorError("get.remoteAccountInfo", "Error"));
  });

  it("should return feeRatio error", async () => {
    mockMarketActor.feeRatio = jest.fn().mockRejectedValue(new IngressActorError("get.fee.ratio", "Error"));
    await expect(wrapper.feeRatio()).rejects.toThrow(new IngressActorError("get.fee.ratio", "Error"));
  });

});
