import { IdentifierService, ILogger } from "@ic-wallet-kit/common";
import { mockOwnerPrincipal, mockSpenderPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { CkERC20Wrapper } from "@icrc/wrappers/ckERC20/ckERC20Wrapper";
import { LedgerWrapper } from "@icrc/wrappers/icrc";


describe("CkERC20Wrapper Tests", () => {
    let mockLogger: ILogger;
    let mockIdentifierService: IdentifierService;

    beforeEach(() => {
        mockLogger = new MockLogger();
        mockIdentifierService = mockAnonymousIdentifierService();

    });

    it("CkERC20Wrapper: getCkERC20Tokens returns token list successfully", async () => {
        const mockCanisters = [
            {
                ledger: mockOwnerPrincipal(),
                index: mockSpenderPrincipal(),
            },
        ];

        const wrapper = new CkERC20Wrapper(mockLogger, mockIdentifierService);

        const mockMetadata = {
            decimals: 8,
            logo: "mock-logo",
            name: "Mock Token",
            symbol: "MOCK",
        };

        wrapper["ckERC20Actor"] = jest.fn().mockReturnValue({
            get_orchestrator_info: jest.fn().mockResolvedValue({
                managed_canisters: [
                    {
                        ledger: [{ Installed: { canister_id: mockCanisters[0].ledger } }],
                        index: [{ Installed: { canister_id: mockCanisters[0].index } }],
                    },
                ],
            })
        });

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);
        ledgerWrapper.getIcrcMetadataInfo = jest.fn().mockResolvedValue(mockMetadata);

        const result = await wrapper.getCkERC20Tokens();

        expect(result).toEqual([
            {
                ledgerAddress: mockCanisters[0].ledger.toString(),
                decimal: mockMetadata.decimals,
                indexAddress: mockCanisters[0].index.toString(),
                logo: mockMetadata.logo,
                name: mockMetadata.name,
                symbol: mockMetadata.symbol,
            },
        ]);

    });

    it("CkERC20Wrapper: getCkERC20Tokens handles errors gracefully", async () => {


        const mockCanisters = [
            {
                ledger: mockOwnerPrincipal(),
                index: mockSpenderPrincipal(),
            },
        ];

        const wrapper = new CkERC20Wrapper(mockLogger, mockIdentifierService);

        wrapper["ckERC20Actor"] = jest.fn().mockReturnValue({
            get_orchestrator_info: jest.fn().mockResolvedValue({
                managed_canisters: [
                    {
                        ledger: [{ Installed: { canister_id: mockCanisters[0].ledger } }],
                        index: [{ Installed: { canister_id: mockCanisters[0].index } }],
                    },
                ],
            })
        });

        const ledgerWrapper = new (<new () => LedgerWrapper><unknown>LedgerWrapper)() as jest.Mocked<LedgerWrapper>;
        LedgerWrapper.create = jest.fn().mockReturnValue(ledgerWrapper);

        ledgerWrapper.getIcrcMetadataInfo = jest.fn().mockRejectedValue(new Error());

        mockLogger.logError = jest.fn();

        const result = await wrapper.getCkERC20Tokens();

        expect(result).toEqual([]);
        expect(mockLogger.logError).toHaveBeenCalledWith(expect.any(Error));
    });

    it("CkERC20Wrapper: ckERC20Actor returns object successfully", async () => {

        const wrapper = new CkERC20Wrapper(mockLogger, mockIdentifierService);
        const object = wrapper["ckERC20Actor"]("vxkom-oyaaa-aaaar-qafda-cai", mockIdentifierService.getAgent());
        expect.any(object);
    });
});
