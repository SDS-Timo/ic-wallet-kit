import { ILogger, LoadType } from "@ic-wallet-middleware/common";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";
import { IcrcCacheMetadataErrorKey } from "@icrc/errors";
import { BaseInternalHandler } from "@icrc/internalHandlers/baseInternalHandler/baseInternalHandler";
import { SubAccountBalanceHandler } from "@icrc/internalHandlers/icrcCacheDataHandlers/assets/subAccountBalanceHandler/subAccountBalanceHandler";
import { AccountDefaultEnum, SubAccountId, TokenMarketInfo } from "@icrc/types";
import { InternalHandlerForm } from "@icrc/types/forms";
import { Inject } from "typedi";

class MockInternalHandler extends BaseInternalHandler<InternalHandlerForm, any> {

    constructor(
        @Inject("ILogger")
        logger: ILogger,
        subAccountBalanceHandler: SubAccountBalanceHandler,
    ) {
        super(logger, subAccountBalanceHandler);
    }

    async validate(form: any): Promise<void> { }
    async process(form: any): Promise<any> { }
}

describe("BaseInternalHandler Tests", () => {
    const mockLedgerAddress = "mock-ledger-address";
    const mockSubAccountId = SubAccountId.Default();
    const validForm = {
        ledgerAddress: mockLedgerAddress,
        loadType: LoadType.Quick,
    };

    const tests: testDefinition[] = [
        {
            name: "BaseInternalHandler: Successfully retrieves sub-account data default",
            input: {
                subAccountId: mockSubAccountId,
                form: validForm,
                assetMarket: { symbol: "ICP", price: 100 } as TokenMarketInfo,
                decimal: 8,
            },
            data: {
                subAccountBalance: { balance: BigInt(100000000) },
            },
            result: {
                subAccountId: mockSubAccountId,
                ledgerAddress: mockLedgerAddress,
                balance: BigInt(100000000),
                decimal: 8,
                currencyAmount: "100.00",
                name: AccountDefaultEnum[AccountDefaultEnum.Default],
                isSync: true,
            },
        },
        {
            name: "BaseInternalHandler: Successfully retrieves sub-account other",
            input: {
                subAccountId: SubAccountId.parseFromNumber(1),
                form: validForm,
                assetMarket: { symbol: "ICP", price: 100 } as TokenMarketInfo,
                decimal: 8,
            },
            data: {
                subAccountBalance: { balance: BigInt(100000000) },
            },
            result: {
                subAccountId: SubAccountId.parseFromNumber(1),
                ledgerAddress: mockLedgerAddress,
                balance: BigInt(100000000),
                decimal: 8,
                currencyAmount: "100.00",
                name: "-",
                isSync: true,
            },
        }
    ];

    itForeach(tests, async (test) => {
        const logger = new MockLogger();
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        const handler = new MockInternalHandler(logger, subAccountBalanceHandler);
        subAccountBalanceHandler.handle = jest.fn().mockResolvedValue(test.data?.subAccountBalance);

        const result = await handler["getSubAccountById"](
            test.input.subAccountId,
            test.input.form,
            test.input.assetMarket,
            test.input.decimal
        );

        expect(result).toEqual(test.result);
        expect(subAccountBalanceHandler.handle).toHaveBeenCalledWith({
            ledgerAddress: mockLedgerAddress,
            subAccountId: test.input.subAccountId,
            loadType: LoadType.Quick,
        });

    });


    const testErrors: testDefinition[] = [
        {
            name: "BaseInternalHandler: Parses error correctly for cache error",
            input: {
                errors: [
                    { localizationKey: IcrcCacheMetadataErrorKey },
                ],
            },
            result: undefined,
        },
        {
            name: "BaseInternalHandler: Throws error for non-cache error",
            input: {
                errors: [
                    { localizationKey: "some-other-error", message: "Some error occurred" },
                ],
            },
            error: [{ localizationKey: "some-other-error", message: "Some error occurred" }],
        },
    ];

    itForeach(testErrors, async (test) => {
        const logger = new MockLogger();
        const subAccountBalanceHandler = new (<new () => SubAccountBalanceHandler><unknown>SubAccountBalanceHandler)() as jest.Mocked<SubAccountBalanceHandler>;

        const handler = new MockInternalHandler(logger, subAccountBalanceHandler);

        const result = handler.parseError(test.input.errors);
        expect(result).toEqual(test.result);
    });


});
