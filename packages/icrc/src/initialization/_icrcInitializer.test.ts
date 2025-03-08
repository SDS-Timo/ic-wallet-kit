import { IdentifierService, IStorage, RefreshServiceConfiguration, ReplicationConfiguration } from "@ic-wallet-middleware/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { IcrcInitializer } from "@icrc/initialization/icrcInitializer";
import { IcrcReplicationManager } from "@icrc/replications";
import { IcrcDbContext } from "@icrc/storage";
import { IcrcRefreshService } from "@icrc/sync";
import { AssetManagerConfiguration, TransactionManagerConfiguration } from "@icrc/types";
import { RxStorage } from "rxdb";
import Container from "typedi";

describe("IcrcInitializer Tests", () => {
    const mockIdentifierService = {} as jest.Mocked<IdentifierService>;
    const mockRxStorage = {} as jest.Mocked<RxStorage<any, any>>;
    const mockDataStorage = {} as jest.Mocked<IStorage>;
    const mockLogger = new MockLogger();
    const mockAssetManagerConfig = {} as AssetManagerConfiguration;
    const mockTransactionManagerConfig = {} as TransactionManagerConfiguration;
    const mockRefreshServiceConfig = {} as RefreshServiceConfiguration;
    const mockReplicationConfig = {} as ReplicationConfiguration;
    const mockCreateIcrcCanisterFunc = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        Container.reset();
    });

    describe("build", () => {
        it("should set up all required dependencies in the container", () => {
            IcrcInitializer.build(
                mockIdentifierService,
                mockRxStorage,
                mockDataStorage,
                mockLogger,
                mockAssetManagerConfig,
                mockTransactionManagerConfig,
                mockRefreshServiceConfig,
                mockReplicationConfig,
                mockCreateIcrcCanisterFunc
            );

            // Verify that dependencies are set in the container
            expect(Container.get(IcrcDbContext)).toBeDefined();
            expect(Container.get("IContactDataStorage")).toBeDefined();
            expect(Container.get("IAssetDataStorage")).toBeDefined();
            expect(Container.get("IServiceDataStorage")).toBeDefined();
            expect(Container.get("IAllowanceDataStorage")).toBeDefined();
            expect(Container.get("AssetManagerConfiguration")).toEqual(mockAssetManagerConfig);
            expect(Container.get("TransactionConfiguration")).toEqual(mockTransactionManagerConfig);
            expect(Container.get("IStorage")).toEqual(mockDataStorage);
        });
    });

    describe("init", () => {
        it("should initialize all required services", async () => {

            const mockDbContext = new (<new () => IcrcDbContext><unknown>IcrcDbContext)() as jest.Mocked<IcrcDbContext>;
            const mockReplicationManager = new (<new () => IcrcReplicationManager><unknown>IcrcReplicationManager)() as jest.Mocked<IcrcReplicationManager>;
            const mockRefreshService = new (<new () => IcrcRefreshService><unknown>IcrcRefreshService)() as jest.Mocked<IcrcRefreshService>;

            mockDbContext.init = jest.fn();
            mockReplicationManager.init = jest.fn();
            mockRefreshService.init = jest.fn();

            Container.set(IcrcDbContext, mockDbContext);
            Container.set(IcrcReplicationManager, mockReplicationManager);
            Container.set(IcrcRefreshService, mockRefreshService);

            await IcrcInitializer.init();

            expect(mockDbContext.init).toHaveBeenCalled();
            expect(mockReplicationManager.init).toHaveBeenCalled();
            expect(mockRefreshService.init).toHaveBeenCalled();
        });
    });

    describe("logout", () => {
        it("should reset the container and remove dependencies", () => {

            Container.set(IdentifierService, mockIdentifierService);
            Container.set("ILogger", new MockLogger());
            Container.set("IStorage", mockDataStorage);
            Container.set("RefreshServiceConfiguration", mockRefreshServiceConfig);

            IcrcInitializer.logout();

        });
    });
});
