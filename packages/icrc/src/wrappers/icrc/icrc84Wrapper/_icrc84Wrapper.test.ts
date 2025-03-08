import { Actor, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { itForeach } from "@icrc/__tests_utils/itForeach";
import { mockOwnerPrincipalString } from "@icrc/__tests_utils/mockConstrains";
import { mockAnonymousIdentifierService } from "@icrc/__tests_utils/seedToIdentity";
import { testDefinition } from "@icrc/__tests_utils/testDefinition";

import { _SERVICE as Icrc84Actor, TokenInfo } from "@icrc/candid/icrc84/icrc84.service.did";
import { Icrc84Error } from "@icrc/errors";
import { SubAccountId } from "@icrc/types/assets/subAccountId";

import { Icrc84ActorWrapper } from "@icrc/wrappers/icrc/icrc84Wrapper/icrc84Wrapper";


jest.mock("@dfinity/agent");

describe("Icrc84ActorWrapper Tests", () => {

    let mockActor: jest.Mocked<ActorSubclass<Icrc84Actor>>;
    let wrapper: Icrc84ActorWrapper;

    beforeEach(() => {


        mockActor = {
            icrc84_supported_tokens: jest.fn(),
            icrc84_token_info: jest.fn(),
            icrc84_all_credits: jest.fn(),
            icrc84_credit: jest.fn(),
            icrc84_trackedDeposit: jest.fn(),
            icrc84_notify: jest.fn(),
            icrc84_withdraw: jest.fn(),
            principalToSubaccount: jest.fn(),
        } as unknown as jest.Mocked<ActorSubclass<Icrc84Actor>>;

        jest.spyOn(Actor, "createActor").mockReturnValue(mockActor);

        wrapper = Icrc84ActorWrapper.create(mockAnonymousIdentifierService().getAgent(), "aaaaa-aa");
    });

    it("Icrc84ActorWrapper: getSupportedAssets returns supported assets", async () => {
        const mockAssets = [Principal.fromHex("0x3"), Principal.fromHex("0x4")];
        mockActor.icrc84_supported_tokens.mockResolvedValue(mockAssets);

        const result = await wrapper.getSupportedAssets();

        expect(result).toEqual(mockAssets);
        expect(mockActor.icrc84_supported_tokens).toHaveBeenCalled();
    });

    it("Icrc84ActorWrapper: getAssetInfo returns asset info", async () => {
        const mockInfo: TokenInfo = {
            allowance_fee: 10n,
            withdrawal_fee: 11n,
            deposit_fee: 12n
        };
        mockActor.icrc84_token_info.mockResolvedValue(mockInfo);

        const result = await wrapper.getAssetInfo("aaaaa-aa");

        expect(result).toEqual(mockInfo);
        expect(mockActor.icrc84_token_info).toHaveBeenCalledWith(Principal.fromText("aaaaa-aa"));
    });

    it("Icrc84ActorWrapper: getAssetInfo failed", async () => {

        mockActor.icrc84_token_info.mockRejectedValue(new Error("mock message"));

        expect(wrapper.getAssetInfo("aaaaa-aa")).rejects.toEqual(new Icrc84Error("getAssetInfo", "mock message"));

    });

    it("Icrc84ActorWrapper: getAllCredits returns credit list", async () => {
        mockActor.icrc84_all_credits.mockResolvedValue([
            [Principal.fromText("aaaaa-aa"), BigInt(100)],
        ]);

        const result = await wrapper.getAllCredits();

        expect(result).toEqual([{ ledgerAddress: "aaaaa-aa", credit: BigInt(100) }]);
        expect(mockActor.icrc84_all_credits).toHaveBeenCalled();
    });

    it("Icrc84ActorWrapper: getAllCredits failed", async () => {

        mockActor.icrc84_all_credits.mockRejectedValue(new Error("mock message getAllCredits"));

        await expect(wrapper.getAllCredits()).rejects.toThrow(new Icrc84Error("getAllCredits", "mock message getAllCredits"));

    });

    it("Icrc84ActorWrapper: getCredit returns credit amount", async () => {
        mockActor.icrc84_credit.mockResolvedValue(BigInt(200));

        const result = await wrapper.getCredit("aaaaa-aa");

        expect(result).toEqual(BigInt(200));
        expect(mockActor.icrc84_credit).toHaveBeenCalledWith(Principal.fromText("aaaaa-aa"));
    });

    it("Icrc84ActorWrapper: getCredit failed", async () => {

        mockActor.icrc84_credit.mockRejectedValue(new Error("mock message getCredit"));

        await expect(wrapper.getCredit("aaaaa-aa")).rejects.toThrow(new Icrc84Error("getCredit", "mock message getCredit"));

    });

    it("Icrc84ActorWrapper: notify returns NotifyModel", async () => {
        const mockResponse = { Ok: { credit: BigInt(100), credit_inc: BigInt(50), deposit_inc: BigInt(25) } };
        mockActor.icrc84_notify.mockResolvedValue(mockResponse);

        const result = await wrapper.notify("aaaaa-aa");

        expect(result).toEqual({
            Credit: BigInt(100),
            CreditInc: BigInt(50),
            DepositInc: BigInt(25),
        });
    });

    it("Icrc84ActorWrapper: notify not available error", async () => {
        const mockResponse = {
            Err: {
                NotAvailable: {
                    message: "Error message notify"
                }
            }
        };

        mockActor.icrc84_notify.mockResolvedValue(mockResponse);

        const error = new Icrc84Error("notify.error.not.available", "Error message notify");

        await expect(wrapper.notify(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    it("Icrc84ActorWrapper: notify not CallLedgerError error", async () => {
        const mockResponse = {
            Err: {
                CallLedgerError: {
                    message: "Error message notify"
                }
            }
        };

        mockActor.icrc84_notify.mockResolvedValue(mockResponse);

        const error = new Icrc84Error("notify.error.call.ledger.error", "Error message notify");

        await expect(wrapper.notify(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    it("Icrc84ActorWrapper: notify actor error", async () => {
        const mockResponse = {
            Err: undefined
        } as any;

        mockActor.icrc84_notify.mockResolvedValue(mockResponse);

        const error = new Icrc84Error("notify", "notify actor error");

        await expect(wrapper.notify(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    it("Icrc84ActorWrapper: notify failed", async () => {

        mockActor.icrc84_notify.mockRejectedValue(new Error("Error notify"));

        const error = new Icrc84Error("notify", "Error notify");

        await expect(wrapper.notify(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    const withdrawInput = {
        owner: mockOwnerPrincipalString(),
        ledgerAddress: Principal.fromHex("0x3").toString(),
        subAccount: [new Uint8Array(32)],
        amount: 500n,
        expectedFee: []
    };

    const withdrawTests: testDefinition[] = [{
        name: "Icrc84ActorWrapper: withdraw returns WithdrawResult",
        input: withdrawInput,
        data: { Ok: { txid: 10n, amount: 500n } },
        result: { txId: 10n, amount: 500n }
    },
    {
        name: "Icrc84ActorWrapper: withdraw Amount Below Minimum",
        input: withdrawInput,
        data: {
            Err: {
                AmountBelowMinimum: {
                    message: "Error message withdraw"
                }
            }
        },
        error: new Icrc84Error("withdraw.amount.below.minimum", "Amount Below Minimum")
    },
    {
        name: "Icrc84ActorWrapper: withdraw Insufficient Credit",
        input: withdrawInput,
        data: {
            Err: {
                InsufficientCredit: {
                    message: "Error message withdraw"
                }
            }
        },
        error: new Icrc84Error("withdraw.insufficient.credit", "Insufficient Credit")
    },
    {
        name: "Icrc84ActorWrapper: withdraw Insufficient Credit",
        input: withdrawInput,
        data: {
            Err: {
                CallLedgerError: {
                    message: "Error message CallLedgerError"
                }
            }
        },
        error: new Icrc84Error("withdraw.call.ledger.error", "Error message CallLedgerError")
    },
    {
        name: "Icrc84ActorWrapper: withdraw Bad Expected Fee",
        input: withdrawInput,
        data: {
            Err: {
                BadFee: {
                    expected_fee: 10n
                }
            }
        },
        error: new Icrc84Error("withdraw.bad.fee", `Bad Expected Fee: 10`)
    },
    {
        name: "Icrc84ActorWrapper: withdraw actor error",
        input: withdrawInput,
        data: {
            Err: {
                Xxxxx: {
                }
            }
        },
        error: new Icrc84Error("withdraw", "withdraw actor error")
    },
    {
        name: "Icrc84ActorWrapper: withdraw error message",
        input: withdrawInput,
        data: new Error("withdraw: custom message"),
        error: new Icrc84Error("custom message", "withdraw: custom message")
    }
    ]

    itForeach(withdrawTests, async (test) => {


        if (test.name == "Icrc84ActorWrapper: withdraw error message") {
            mockActor.icrc84_withdraw.mockRejectedValue(test.data);
        }
        else {
            mockActor.icrc84_withdraw.mockResolvedValue(test.data);
        }

        const result = await wrapper.withdraw(test.input.owner, test.input.ledgerAddress, test.input.subAccount, test.input.amount, test.input.expectedFee);

        expect(result).toEqual(test.result);
    })
    /*
        it("Icrc84ActorWrapper: withdraw returns WithdrawResult", async () => {
            const mockResponse = { Ok: { txid: 10n, amount: 500n } };

            mockActor.icrc84_withdraw.mockResolvedValue(mockResponse);

            const result = await wrapper.withdraw(mockOwnerPrincipalString(), Principal.fromHex("0x3").toString(), [new Uint8Array(32)], BigInt(500), []);

            expect(result).toEqual({ txId: 10n, amount: 500n });
        });*/

    it("Icrc84ActorWrapper: principalToSubaccount returns SubAccountId", async () => {
        const mockSubAccount = new Uint8Array(32);
        mockActor.principalToSubaccount.mockResolvedValue([mockSubAccount]);

        const result = await wrapper.principalToSubaccount(Principal.fromText("aaaaa-aa"));

        expect(result).toEqual(SubAccountId.parseFromString("0x0"));
    });

    it("Icrc84ActorWrapper: principalToSubaccount returns undefined", async () => {

        mockActor.principalToSubaccount.mockResolvedValue([]);

        const result = await wrapper.principalToSubaccount(Principal.fromText("aaaaa-aa"));

        expect(result).toEqual(undefined);
    });

    it("Icrc84ActorWrapper: principalToSubaccount returns undefined", async () => {

        mockActor.principalToSubaccount.mockRejectedValue(new Error("Error principalToSubaccount"));

        await expect(wrapper.principalToSubaccount(Principal.fromText("aaaaa-aa"))).rejects.toThrow(new Icrc84Error("principalToSubaccount", "Error principalToSubaccount"));
    });

    it("Icrc84ActorWrapper: handles errors gracefully", async () => {
        mockActor.icrc84_supported_tokens.mockRejectedValue(new Error("Error fetching assets"));

        await expect(wrapper.getSupportedAssets()).rejects.toThrow(Icrc84Error);
    });

    it("Icrc84ActorWrapper: trackedDeposit returns success", async () => {
        const mockResponse = { Ok: 500n };

        mockActor.icrc84_trackedDeposit.mockResolvedValue(mockResponse);

        const result = await wrapper.trackedDeposit(Principal.fromHex("0x3").toString());

        expect(result).toEqual(500n);
    });

    it("Icrc84ActorWrapper: trackedDeposit not available error", async () => {
        const mockResponse = {
            Err: {
                NotAvailable: {
                    message: "Error message trackedDeposit"
                }
            }
        };

        mockActor.icrc84_trackedDeposit.mockResolvedValue(mockResponse);

        const error = new Icrc84Error("tracked.deposit.error.not.available", "Error message trackedDeposit");

        await expect(wrapper.trackedDeposit(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    it("Icrc84ActorWrapper: trackedDeposit tracked deposit actor error", async () => {
        const mockResponse = {
            Err: undefined
        } as any;

        mockActor.icrc84_trackedDeposit.mockResolvedValue(mockResponse);

        const error = new Icrc84Error("tracked.deposit", "tracked deposit actor error");

        await expect(wrapper.trackedDeposit(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });

    it("Icrc84ActorWrapper: trackedDeposit failed", async () => {

        mockActor.icrc84_trackedDeposit.mockRejectedValue(new Error("Error trackedDeposit"));

        const error = new Icrc84Error("trackedDeposit", "Error trackedDeposit");

        await expect(wrapper.trackedDeposit(Principal.fromHex("0x3").toString())).rejects.toThrow(error);
    });
});
