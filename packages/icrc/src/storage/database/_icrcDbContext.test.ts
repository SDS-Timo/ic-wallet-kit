
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { IcrcDbContext } from "@icrc/storage";
import { RxStorage } from "rxdb";
import DBSchemas from "./schema.json";

describe("IcrcDbContext", () => {
    let icrcDbContext: IcrcDbContext;
    const identifierService = mockAnonymousIdentifierService();
    beforeEach(() => {

        icrcDbContext = new IcrcDbContext(identifierService, {} as RxStorage<string, string>);

    });

    it("IcrcDbContext:getDbName should return 'name'", () => {
        expect(icrcDbContext.getDbName()).toBe(`rx_db_icrc_${identifierService.getPrincipalStr()}`);
    });

    it("IcrcDbContext:getSchema should return the Schema", () => {
        expect(icrcDbContext.getSchema()).toBe(DBSchemas);
    });
});