import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { MetadataInfo } from "@icrc/types";
import { SnsToken, SnsWrapper } from "@icrc/wrappers";
import { LedgerWrapper } from "@icrc/wrappers/icrc/ledgerWrapper/ledgerWrapper";


describe("SnsWrapper Tests", () => {
    let mockLogger = new MockLogger();

    beforeEach(() => {

    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("SnsWrapper: getSNSTokens returns token list successfully, Metadata exists", async () => {
        const mockMetadata: MetadataInfo = {
            decimals: 8,
            logo: "mock-logo-metadata",
            name: "Mock Token",
            symbol: "MOCK",
            fee: 10n
        };

        const mockTokens: SnsToken[] = [
            {
                index: "1",
                canister_ids: {
                    root_canister_id: "aaaaa-aa",
                    governance_canister_id: "bbbbb-bb",
                    index_canister_id: "ccccc-cc",
                    swap_canister_id: "ddddd-dd",
                    ledger_canister_id: "eeeee-ee",
                },
                list_sns_canisters: {},
                meta: { url: "", name: "Mock Token", description: "", logo: "/mock-logo.png" },
                parameters: {},
                nervous_system_parameters: {},
                swap_state: {},
                icrc1_metadata: [],
                icrc1_fee: [],
                icrc1_total_supply: "",
                swap_params: {},
                init: {},
                derived_state: {},
                lifecycle: {},
            },
        ];

        LedgerWrapper.parseMetadataInfo = jest.fn().mockReturnValue(mockMetadata);

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(mockTokens),
        });

        const wrapper = new SnsWrapper(mockLogger);
        const result = await wrapper.getSNSTokens();

        expect(result).toEqual([
            {
                ledgerAddress: "eeeee-ee",
                logo: "mock-logo-metadata",
                name: "Mock Token",
                symbol: "MOCK",
                decimal: 8,
                indexAddress: "ccccc-cc",
            },
        ]);

        expect(global.fetch).toHaveBeenCalledWith("https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/0/slow.json");
    });

    it("SnsWrapper: getSNSTokens returns token list successfully, Metadata not exists", async () => {
        const mockMetadata: MetadataInfo = {
            decimals: 8,
            logo: "",
            name: "Mock Token",
            symbol: "MOCK",
            fee: 10n
        };

        const mockTokens: SnsToken[] = [
            {
                index: "1",
                canister_ids: {
                    root_canister_id: "aaaaa-aa",
                    governance_canister_id: "bbbbb-bb",
                    index_canister_id: "",
                    swap_canister_id: "ddddd-dd",
                    ledger_canister_id: "eeeee-ee",
                },
                list_sns_canisters: {},
                meta: { url: "", name: "Mock Token", description: "", logo: "/mock-logo.png" },
                parameters: {},
                nervous_system_parameters: {},
                swap_state: {},
                icrc1_metadata: [],
                icrc1_fee: [],
                icrc1_total_supply: "",
                swap_params: {},
                init: {},
                derived_state: {},
                lifecycle: {},
            },
            {
                index: "1",
                canister_ids: {
                    root_canister_id: "aaaaa-aa",
                    governance_canister_id: "bbbbb-bb",
                    index_canister_id: "",
                    swap_canister_id: "ddddd-dd",
                    ledger_canister_id: "eeeee-ee",
                },
                list_sns_canisters: {},
                meta: { url: "", name: "Mock Token", description: "", logo: "/mock-logo.png" },
                parameters: {},
                nervous_system_parameters: {},
                swap_state: {},
                icrc1_metadata: [],
                icrc1_fee: [],
                icrc1_total_supply: "",
                swap_params: {},
                init: {},
                derived_state: {},
                lifecycle: {},
            },
        ];

        LedgerWrapper.parseMetadataInfo = jest.fn().mockReturnValue(mockMetadata);

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(mockTokens),
        });

        const wrapper = new SnsWrapper(mockLogger);
        const result = await wrapper.getSNSTokens();

        expect(result).toEqual([
            {
                ledgerAddress: "eeeee-ee",
                logo: "https://3r4gx-wqaaa-aaaaq-aaaia-cai.ic0.app/mock-logo.png",
                name: "Mock Token",
                symbol: "MOCK",
                decimal: 8,
                indexAddress: "",
            },
        ]);

        expect(global.fetch).toHaveBeenCalledWith("https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io/v1/sns/list/page/0/slow.json");
    });

    it("SnsWrapper: getSNSTokens handles fetch error gracefully", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Fetch error"));

        mockLogger.logError = jest.fn();

        const wrapper = new SnsWrapper(mockLogger);
        const result = await wrapper.getSNSTokens();

        expect(result).toEqual([]);
        expect(mockLogger.logError).toHaveBeenCalledWith(expect.any(Error), "Get sns list error.");
    });

    it("SnsWrapper: getSNSTokens stops fetching if response is not ok", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, status: 500 });

        const wrapper = new SnsWrapper(mockLogger);
        const result = await wrapper.getSNSTokens();

        expect(result).toEqual([]);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});
