import { itForeach } from "@hpl/__tests_utils/itForeach";
import { MockLogger } from "@hpl/__tests_utils/mockLogger";
import { GetHplFeeConstantHandler } from "@hpl/handlers/transfer/getHplFeeConstantHandler/getHplFeeConstantHandler";
import { HplFeeConstantCacheDataHandler } from "@hpl/internalHandlers/cacheDataHandlers/hplFeeConstantCacheDataHandler/hplFeeConstantCacheDataHandler";
import { LoadType } from "@ic-wallet-middleware/common";

describe("Unit TransferHandler tests", () => {
    const testData = [
        {
            name: "transfer error: Asset Not Found",
            input: {
                loadType: LoadType.Cache
            },
            data: BigInt(10000),
            result: {
                feeConstant: BigInt(10000)
            }
        },
        {
            name: "transfer error: Asset Not Found",
            input: {
                loadType: LoadType.Cache
            },
            data: null,
            result: {
                feeConstant: BigInt(0)
            }
        }
    ]

    itForeach(testData, async (test) => {
        const logger = new MockLogger();
        const hplFeeConstantCacheDataHandler = new (<new () => HplFeeConstantCacheDataHandler><unknown>HplFeeConstantCacheDataHandler)() as jest.Mocked<HplFeeConstantCacheDataHandler>;
        hplFeeConstantCacheDataHandler.process = jest.fn().mockReturnValue(Promise.resolve(test.data));
        const getHplFeeConstantHandler = new GetHplFeeConstantHandler(logger, hplFeeConstantCacheDataHandler);
        await getHplFeeConstantHandler.validate(test.input);
        const result = await getHplFeeConstantHandler.process(test.input);
        expect(result).toEqual(test.result);

        expect(hplFeeConstantCacheDataHandler.process).toHaveBeenCalledWith({
            loadType: test.input.loadType
        });
    });
})
