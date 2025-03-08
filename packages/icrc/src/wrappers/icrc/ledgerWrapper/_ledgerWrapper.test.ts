import { IcrcLedgerCanister, IcrcTokenMetadataResponse } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { mockSpenderPrincipal, mockSpenderPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcLegerError } from "@icrc/errors";
import { MetadataInfo, SubAccountId } from "@icrc/types";
import { AllowanceDataModel } from "@icrc/types/allowances/allowanceDataModel";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";


jest.mock("@dfinity/ledger-icrc");

describe("LedgerWrapper Private Methods Tests", () => {
    let mockAgent = mockAnonymousIdentifierService().getAgent();
    let mockLedger: jest.Mocked<IcrcLedgerCanister>;
    let wrapper: LedgerWrapper;

    beforeEach(() => {

        mockLedger = {
            balance: jest.fn(),
            transfer: jest.fn(),
            transferFrom: jest.fn(),
            metadata: jest.fn(),
            transactionFee: jest.fn(),
            allowance: jest.fn(),
            approve: jest.fn(),
        } as unknown as jest.Mocked<IcrcLedgerCanister>;

        (IcrcLedgerCanister.create as jest.Mock).mockReturnValue(mockLedger);
        wrapper = LedgerWrapper.create(mockAgent, "aaaaa-aa");
    });

    it("LedgerWrapper: getIcrcLedgerCanister returns valid canister instance", () => {
        const result = (LedgerWrapper as any).getIcrcLedgerCanister(mockAgent, "aaaaa-aa");
        expect(result).toBeDefined();
    });

    it("LedgerWrapper: getIcrcLedgerCanister throws error for invalid canister ID", () => {
        (IcrcLedgerCanister.create as jest.Mock).mockImplementation(() => {
            throw new Error("Canister ID is required");
        });

        expect(() => (LedgerWrapper as any).getIcrcLedgerCanister(mockAgent, "")).toThrow("Canister ID is required");
    });

    it("LedgerWrapper: getIcrcLedgerCanister throws error getIcrcLedgerCanister", () => {
        (IcrcLedgerCanister.create as jest.Mock).mockImplementation(() => {
            throw new Error("E1");
        });

        expect(() => LedgerWrapper["getIcrcLedgerCanister"](mockAgent, "")).toThrow(new IcrcLegerError("getIcrcLedgerCanister", "E1"));
    });

    it("LedgerWrapper: parseMetadataInfo extracts metadata correctly", () => {
        const metadata: IcrcTokenMetadataResponse = [
            ["icrc1:symbol", { Text: "TEST" }],
            ["icrc1:name", { Text: "Test Token" }],
            ["icrc1:decimals", { Nat: 8n }],
            ["icrc1:logo", { Text: "logo_url" }],
            ["icrc1:fee", { Nat: 10n }],
        ];

        const result: MetadataInfo = LedgerWrapper.parseMetadataInfo(metadata);

        expect(result).toEqual({
            symbol: "TEST",
            name: "Test Token",
            decimals: 8,
            logo: "logo_url",
            fee: BigInt(10),
        });
    });

    it("LedgerWrapper: parseMetadataInfo handles missing fields gracefully", () => {
        const metadata: IcrcTokenMetadataResponse = [
            ["icrc1:symbol", { Text: "TEST" }],
            ["icrc1:fee", { Nat: 20n }],
        ];

        const result: MetadataInfo = LedgerWrapper.parseMetadataInfo(metadata);

        expect(result).toEqual({
            symbol: "TEST",
            name: "symbol",
            decimals: 0,
            logo: "",
            fee: BigInt(20),
        });
    });

    it("LedgerWrapper: convertDate returns correct bigint value", () => {
        const wrapper = LedgerWrapper.create(mockAgent, "aaaaa-aa");
        const result = (wrapper as any).convertDate([BigInt(1000)]);
        expect(result).toEqual(BigInt(1000));
    });

    it("LedgerWrapper: convertDate returns undefined for empty input", () => {
        const wrapper = LedgerWrapper.create(mockAgent, "aaaaa-aa");
        const result = (wrapper as any).convertDate([]);
        expect(result).toBeUndefined();
    });

    it("LedgerWrapper: getBalance returns balance", async () => {
        const mockPrincipal = Principal.fromText("aaaaa-aa");
        const mockSubAccount = SubAccountId.Default();
        mockLedger.balance.mockResolvedValue(BigInt(100));

        const result = await wrapper.getBalance(mockSubAccount, mockPrincipal);

        expect(result).toBe(BigInt(100));
        expect(mockLedger.balance).toHaveBeenCalledWith({
            owner: mockPrincipal,
            subaccount: mockSubAccount.toUint8Array(),
            certified: false,
        });
    });

    it("LedgerWrapper: getBalance throws error on failure", async () => {
        mockLedger.balance.mockRejectedValue(new Error("Balance error"));

        await expect(wrapper.getBalance(SubAccountId.Default(), Principal.fromText("aaaaa-aa")))
            .rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: transfer returns block index", async () => {
        mockLedger.transfer.mockResolvedValue(BigInt(1));

        const transferInfo = {
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(100),
        };

        const result = await wrapper.transfer(transferInfo);

        expect(result).toBe(BigInt(1));
        expect(mockLedger.transfer).toHaveBeenCalled();
    });

    it("LedgerWrapper: transfer returns block index, toSubAccountId undefined", async () => {
        mockLedger.transfer.mockResolvedValue(BigInt(1));

        const transferInfo = {
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: undefined,
            amount: BigInt(100),
        };

        const result = await wrapper.transfer(transferInfo);

        expect(result).toBe(BigInt(1));
        expect(mockLedger.transfer).toHaveBeenCalled();
    });

    it("LedgerWrapper: transfer throws error on rejection", async () => {
        mockLedger.transfer.mockRejectedValue(new Error("Reject text: Transfer failed"));

        await expect(wrapper.transfer({
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(100),
        })).rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: transfer throws error on Transfer failed", async () => {
        mockLedger.transfer.mockRejectedValue(new Error("Transfer failed"));

        await expect(wrapper.transfer({
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(100),
        })).rejects.toThrow(new IcrcLegerError("transfer.generic", "Transfer failed"));
    });

    it("LedgerWrapper: transferFrom returns block index", async () => {
        mockLedger.transferFrom.mockResolvedValue(BigInt(1));

        const transferFromInfo = {
            fromAccountPrincipal: Principal.fromText("aaaaa-aa"),
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(50),
        };

        const result = await wrapper.transferFrom(transferFromInfo);

        expect(result).toBe(BigInt(1));
        expect(mockLedger.transferFrom).toHaveBeenCalled();
    });

    it("LedgerWrapper: transferFrom throws error on rejection", async () => {
        mockLedger.transferFrom.mockRejectedValue(new Error("Reject text: Transfer failed"));

        await expect(wrapper.transferFrom({
            fromAccountPrincipal: Principal.fromText("aaaaa-aa"),
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(50),
        })).rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: transferFrom throws error on Transfer failed", async () => {
        mockLedger.transferFrom.mockRejectedValue(new Error("Transfer failed"));

        await expect(wrapper.transferFrom({
            fromAccountPrincipal: Principal.fromText("aaaaa-aa"),
            fromSubAccountId: SubAccountId.Default(),
            toAccountPrincipal: mockSpenderPrincipal(),
            toSubAccountId: SubAccountId.Default(),
            amount: BigInt(50),
        })).rejects.toThrow(new IcrcLegerError("transfer.generic", "Transfer failed"));
    });

    it("LedgerWrapper: getIcrcMetadataInfo returns parsed metadata", async () => {
        const mockMetadata: IcrcTokenMetadataResponse = [
            ["icrc1:symbol", { Text: "TEST" }],
            ["icrc1:name", { Text: "Test Token" }],
            ["icrc1:decimals", { Nat: 8n }],
            ["icrc1:logo", { Text: "logo_url" }],
            ["icrc1:fee", { Nat: 10n }],
        ];

        mockLedger.metadata.mockResolvedValue(mockMetadata);

        const result = await wrapper.getIcrcMetadataInfo();

        expect(result).toEqual({
            symbol: "TEST",
            name: "Test Token",
            decimals: 8,
            logo: "logo_url",
            fee: BigInt(10),
        });
    });

    it("LedgerWrapper: getIcrcMetadataInfo throws error on failure", async () => {
        mockLedger.metadata.mockRejectedValue(new Error("Body: Metadata request failed"));

        await expect(wrapper.getIcrcMetadataInfo()).rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: getIcrcMetadataInfo throws error on Metadata request failed", async () => {
        mockLedger.metadata.mockRejectedValue(new Error("Metadata request failed"));

        await expect(wrapper.getIcrcMetadataInfo()).rejects.toThrow(new IcrcLegerError("get.metadata.generic", "Metadata request failed"));
    });

    it("LedgerWrapper: getTransactionFee returns fee", async () => {
        mockLedger.transactionFee.mockResolvedValue(BigInt(10));

        const result = await wrapper.getTransactionFee();

        expect(result).toBe(BigInt(10));
    });

    it("LedgerWrapper: getTransactionFee throws error on failure", async () => {
        mockLedger.transactionFee.mockRejectedValue(new Error("Fee error"));

        await expect(wrapper.getTransactionFee()).rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: getAllowance returns allowance data", async () => {

        mockLedger.allowance.mockResolvedValue({
            allowance: BigInt(100),
            expires_at: [BigInt(1000)]
        });

        const result = await wrapper.getAllowance(
            Principal.fromText("aaaaa-aa"),
            mockSpenderPrincipal(),
            SubAccountId.Default()
        );

        expect(result).toEqual({
            allowance: BigInt(100),
            expiration: BigInt(1000),
        });
    });

    it("LedgerWrapper: getAllowance, spenderSubaccount exists returns allowance data", async () => {

        mockLedger.allowance.mockResolvedValue({
            allowance: BigInt(100),
            expires_at: [BigInt(1000)]
        });

        const result = await wrapper.getAllowance(
            Principal.fromText("aaaaa-aa"),
            mockSpenderPrincipal(),
            SubAccountId.Default(),
            SubAccountId.parseFromNumber(1)
        );

        expect(result).toEqual({
            allowance: BigInt(100),
            expiration: BigInt(1000),
        });
    });

    it("LedgerWrapper: getAllowance throws error on failure", async () => {
        mockLedger.allowance.mockRejectedValue(new Error("Allowance error"));

        await expect(wrapper.getAllowance(
            Principal.fromText("aaaaa-aa"),
            mockSpenderPrincipal(),
            SubAccountId.Default()
        )).rejects.toThrow(IcrcLegerError);
    });

    it("LedgerWrapper: convertDate returns correct bigint value", () => {
        const result = (wrapper as any).convertDate([BigInt(1000)]);
        expect(result).toEqual(BigInt(1000));
    });

    it("LedgerWrapper: convertDate returns undefined for empty input", () => {
        const result = (wrapper as any).convertDate([]);
        expect(result).toBeUndefined();
    });

    it("LedgerWrapper: approveAllowance calls approve static", async () => {
        const mockAllowanceInfo: AllowanceDataModel = {
            ledgerAddress: "aaaaa-aa",
            amount: BigInt(100),
            spenderPrincipal: mockSpenderPrincipalString(),
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.Default(),
            expiration: 2000n,
        };

        wrapper.approveAllowance = jest.fn().mockResolvedValue(1n);

        expect(LedgerWrapper.approveAllowance(mockAllowanceInfo, mockAgent)).resolves;
    });

    it("LedgerWrapper: approveAllowance calls approve", async () => {
        const mockAllowanceInfo: AllowanceDataModel = {
            ledgerAddress: "aaaaa-aa",
            amount: BigInt(100),
            spenderPrincipal: mockSpenderPrincipalString(),
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.Default(),
            expiration: 2000n,
        };

        mockLedger.approve.mockResolvedValue(BigInt(1));

        const result = await wrapper.approveAllowance(mockAllowanceInfo);

        expect(result).toBe(BigInt(1));
        expect(mockLedger.approve).toHaveBeenCalled();
    });

    it("LedgerWrapper: approveAllowance calls approve, expiration undefined", async () => {
        const mockAllowanceInfo: AllowanceDataModel = {
            ledgerAddress: "aaaaa-aa",
            amount: BigInt(100),
            spenderPrincipal: mockSpenderPrincipalString(),
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.Default(),
            expiration: undefined
        };

        mockLedger.approve.mockResolvedValue(BigInt(1));

        const result = await wrapper.approveAllowance(mockAllowanceInfo);

        expect(result).toBe(BigInt(1));
        expect(mockLedger.approve).toHaveBeenCalled();
    });

    it("LedgerWrapper: approveAllowance throws error on failure", async () => {
        mockLedger.approve.mockRejectedValue(new Error("Approval error"));

        await expect(wrapper.approveAllowance({
            ledgerAddress: "aaaaa-aa",
            amount: BigInt(100),
            spenderPrincipal: mockSpenderPrincipalString(),
            spenderSubId: SubAccountId.Default(),
            subAccountId: SubAccountId.Default(),
            expiration: 2000n,
        })).rejects.toThrow(IcrcLegerError);
    });


});
