import { Icrc84Error } from "@icrc/errors/icrc84Error";
import { IcrcIndexError } from "@icrc/errors/icrcIndexError";
import { IcrcLegerError } from "@icrc/errors/icrcLedgerError";
import { SubAccountIdError } from "@icrc/errors/subAccountError";
import { TransactionsRepositoryError } from "@icrc/errors/transactionsRepositoryError";


describe("Unit errors tests", () => {


    it("Icrc84Error test", async () => {

        const icrc84Error = new Icrc84Error("Icrc84Error-testErrorType", "Icrc84Error-testMessage");

        expect(icrc84Error.errorType).toEqual("Icrc84Error-testErrorType");
        expect(icrc84Error.message).toEqual("Icrc84Error-testMessage");

    });

    it("IcrcIndexError test", async () => {

        const icrcIndexError = new IcrcIndexError("IcrcIndexError-testErrorType", "IcrcIndexError-testMessage");

        expect(icrcIndexError.errorType).toEqual("IcrcIndexError-testErrorType");
        expect(icrcIndexError.message).toEqual("IcrcIndexError-testMessage");

    });

    it("IcrcLegerError test", async () => {

        const icrcLegerError = new IcrcLegerError("IcrcLegerError-testErrorType", "IcrcLegerError-testMessage");

        expect(icrcLegerError.errorType).toEqual("IcrcLegerError-testErrorType");
        expect(icrcLegerError.message).toEqual("IcrcLegerError-testMessage");

    });

    it("SubAccountIdError test", async () => {

        const subAccountIdError = new SubAccountIdError("SubAccountIdError-testMessage");
        expect(subAccountIdError.message).toEqual("SubAccountIdError-testMessage");

    });

    it("TransactionsRepositoryError test", async () => {

        const transactionsRepositoryError = new TransactionsRepositoryError("TransactionsRepositoryError-testErrorType", "TransactionsRepositoryError-testMessage");

        expect(transactionsRepositoryError.errorType).toEqual("TransactionsRepositoryError-testErrorType");
        expect(transactionsRepositoryError.message).toEqual("TransactionsRepositoryError-testMessage");

    });
}

);
