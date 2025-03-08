import { Actor } from "@dfinity/agent";
import { mockPrincipal } from "@icrc/__tests_utils/mockConstrains";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { _SERVICE as IcrcLedgerService } from "@icrc/candid/icrcLedger/icrcLedgerCandid.service.did";
import { SupportedStandardEnum } from "@icrc/types/wallets/supportedStandardEnum";
import { IcrcLedgerServiceWrapper } from "@icrc/wrappers/icrc/icrcLedgerServiceWrapper/icrcLedgerServiceWrapper";

jest.mock("@dfinity/agent");

describe("IcrcLedgerServiceWrapper Tests", () => {
    let mockLogger: MockLogger;
    let mockAgent = mockAnonymousIdentifierService().getAgent();
    let mockActor: jest.Mocked<IcrcLedgerService>;
    let wrapper: IcrcLedgerServiceWrapper;

    beforeEach(() => {

        mockLogger = new MockLogger();

        mockActor = {

            get_blocks: jest.fn(),
            get_data_certificate: jest.fn(),
            get_transactions: jest.fn(),
            icrc1_balance_of: jest.fn(),
            icrc1_decimals: jest.fn(),
            icrc1_fee: jest.fn(),
            icrc1_metadata: jest.fn(),
            icrc1_minting_account: jest.fn(),
            icrc1_name: jest.fn(),
            icrc1_supported_standards: jest.fn(),
            icrc1_symbol: jest.fn(),
            icrc1_total_supply: jest.fn(),
            icrc1_transfer: jest.fn(),
            icrc2_allowance: jest.fn(),
            icrc2_approve: jest.fn(),
            icrc2_transfer_from: jest.fn()
        } as unknown as jest.Mocked<IcrcLedgerService>;



        jest.spyOn(Actor, "createActor").mockReturnValue(mockActor as any);

        wrapper = IcrcLedgerServiceWrapper.create({ agent: mockAgent, ledgerAddress: mockPrincipal }, mockLogger);
    });

    it("IcrcLedgerServiceWrapper: getICRCSupportedStandards returns supported standards", async () => {
        mockActor.icrc1_supported_standards.mockResolvedValue([
            { name: "ICRC-1", url: "xxx" },
            { name: "ICRC-2", url: "xxx" },
        ]);

        const result = await wrapper.getICRCSupportedStandards();

        expect(result).toEqual([SupportedStandardEnum.ICRC1, SupportedStandardEnum.ICRC2]);
        expect(mockActor.icrc1_supported_standards).toHaveBeenCalled();
    });

    it("IcrcLedgerServiceWrapper: getICRCSupportedStandards handles errors gracefully", async () => {
        mockActor.icrc1_supported_standards.mockRejectedValue(new Error("Fetch error"));

        mockLogger.logError = jest.fn();

        const result = await wrapper.getICRCSupportedStandards();
        IcrcLedgerServiceWrapper["pollingStrategy"]();

        expect(result).toEqual([]);
        expect(mockLogger.logError).toHaveBeenCalledWith(expect.any(Error), "IcrcLedgerServiceWrapper error");
    });

});
