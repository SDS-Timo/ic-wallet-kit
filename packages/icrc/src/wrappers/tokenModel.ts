import { SupportedStandardEnum } from "@icrc/types";
import { TokenApiResult } from "@icrc/wrappers/tokenApiResult";

export interface TokenModel extends TokenApiResult {
  supportedStandard: SupportedStandardEnum[];
}
