
import { consoleOutputFormJson } from "@app/utils/consoleOutput";
import { LoadType } from "@ic-wallet-kit/common";
import { GetHplFeeConstantHandler } from "@ic-wallet-kit/hpl";
import Container from "typedi";

export const getHplFeeConstant = async () => {
    const getHplFeeConstantHandler = Container.get(GetHplFeeConstantHandler);
    const result = await getHplFeeConstantHandler.handle({
        loadType: LoadType.Cache
    });
    consoleOutputFormJson(result);
}