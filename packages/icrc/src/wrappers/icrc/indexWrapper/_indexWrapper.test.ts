import { IcrcIndexCanister, IcrcTransactionWithId } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { PageInfo } from "@ic-wallet-kit/common";
import { IcrcIndexError } from "@icrc/errors/icrcIndexError";
import { SubAccountId } from "@icrc/types";
import { IndexWrapper } from "@icrc/wrappers/icrc/indexWrapper/indexWrapper";


jest.mock("@dfinity/ledger-icrc");

describe("IndexWrapper Tests", () => {
    let mockCanister: jest.Mocked<IcrcIndexCanister>;
    let wrapper: IndexWrapper;

    beforeEach(() => {
        mockCanister = {
            getTransactions: jest.fn(),
        } as unknown as jest.Mocked<IcrcIndexCanister>;

        (IcrcIndexCanister.create as jest.Mock).mockReturnValue(mockCanister);

        wrapper = IndexWrapper.create("aaaaa-aa");
    });

    it("IndexWrapper: getTransactions returns transactions", async () => {
        const mockPrincipal = Principal.fromText("aaaaa-aa");
        const mockSubAccount = SubAccountId.Default();
        const mockPageInfo: PageInfo = { take: 10, nextPageKey: "" };
        const mockTransactions: IcrcTransactionWithId[] = [{
            id: BigInt(1), transaction: {
                approve: [],
                burn: [],
                kind: "",
                mint: [],
                timestamp: 234234n,
                transfer: []
            }
        }];

        mockCanister.getTransactions.mockResolvedValue({ transactions: mockTransactions, oldest_tx_id: [] });

        const result = await wrapper.getTransactions(mockPrincipal, mockSubAccount, mockPageInfo);

        expect(result).toEqual(mockTransactions);
        expect(mockCanister.getTransactions).toHaveBeenCalledWith({
            max_results: BigInt(10),
            start: undefined,
            account: {
                owner: mockPrincipal,
                subaccount: mockSubAccount.toUint8Array(),
            },
        });
    });

    it("IndexWrapper: getTransactions handles errors gracefully", async () => {
        mockCanister.getTransactions.mockRejectedValue(new Error("Fetch error"));

        await expect(wrapper.getTransactions(Principal.fromText("aaaaa-aa"), SubAccountId.Default(), { take: 10, nextPageKey: "" }))
            .rejects.toThrow(IcrcIndexError);
    });

    it("IndexWrapper: create throws error for invalid canister ID", () => {
        (IcrcIndexCanister.create as jest.Mock).mockImplementation(() => {
            throw new Error("Canister ID is required");
        });

        expect(() => IndexWrapper.create("")).toThrow("Canister ID is required");
    });

    it("IndexWrapper: getStartItem should return BigInt value when nextPageKey is provided", () => {
        const result = wrapper["getStartItem"]("50");
        expect(result).toEqual(BigInt(50));
    });

    it("IndexWrapper: getStartItem should return undefined when nextPageKey is not provided", () => {
        const result = wrapper["getStartItem"]("");
        expect(result).toBeUndefined();
    });

    it("IndexWrapper: getIcrcIndexCanister returns valid canister instance", () => {
        const result = IndexWrapper["getIcrcIndexCanister"]("aaaaa-aa");
        expect(result).toBeDefined();
    });

    it("IndexWrapper: getIcrcIndexCanister throws error for invalid canister ID", () => {
        IcrcIndexCanister["create"] = jest.fn().mockImplementation(() => {
            throw new Error("Canister ID is required");
        });

        expect(() => IndexWrapper["getIcrcIndexCanister"]("")).toThrow("Canister ID is required");
    });

    it("IndexWrapper: getIcrcIndexCanister throws error for invalid canister ID", () => {
        IcrcIndexCanister["create"] = jest.fn().mockImplementation(() => {
            throw new Error("Mock error");
        });

        expect(() => IndexWrapper["getIcrcIndexCanister"]("")).toThrow("Mock error");
    });
});
