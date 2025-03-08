import { ILogger, ReplicationConfiguration, ReplicationProcessor } from "@ic-wallet-kit/common";
import { MockLogger } from "@icrc/__tests_utils/mockLogger";
import { IcrcReplicationManager } from "@icrc/replications/icrcReplicationManager";
import { IAllowanceDataStorage, IAssetDataStorage, IContactDataStorage, IServiceDataStorage, IcrcDbContext } from "@icrc/storage";
import { IcrcRxSyncStateService } from "./IcrcRxSyncStateService";


describe("IcrcReplicationManager Tests", () => {
    let logger: ILogger;
    let replicationConfiguration: jest.Mocked<ReplicationConfiguration>;
    let identifierService: jest.Mocked<any>;
    let icrcRxSyncStateService: jest.Mocked<IcrcRxSyncStateService>;
    let icrcDbContext: jest.Mocked<IcrcDbContext>;
    let createCanisterFunc: jest.Mocked<any>;
    let allowanceDataStorage: jest.Mocked<IAllowanceDataStorage>;
    let assetDataStorage: jest.Mocked<IAssetDataStorage>;
    let contactDataStorage: jest.Mocked<IContactDataStorage>;
    let serviceDataStorage: jest.Mocked<IServiceDataStorage>;
    let replicationProcessorMock: jest.Mocked<ReplicationProcessor>;

    beforeEach(() => {
        logger = new MockLogger();
        replicationConfiguration = { someConfig: "value" } as unknown as jest.Mocked<ReplicationConfiguration>;
        identifierService = { someIdentifierServiceMethod: jest.fn() } as jest.Mocked<any>;
        icrcRxSyncStateService = { someSyncMethod: jest.fn() } as unknown as jest.Mocked<IcrcRxSyncStateService>;
        icrcDbContext = { someDbContextMethod: jest.fn() } as unknown as jest.Mocked<IcrcDbContext>;
        createCanisterFunc = jest.fn();

        allowanceDataStorage = { collectionName: "Allowances" } as unknown as jest.Mocked<IAllowanceDataStorage>;
        assetDataStorage = { collectionName: "Assets" } as unknown as jest.Mocked<IAssetDataStorage>;
        contactDataStorage = { collectionName: "Contacts" } as unknown as jest.Mocked<IContactDataStorage>;
        serviceDataStorage = { collectionName: "Services" } as unknown as jest.Mocked<IServiceDataStorage>;

        replicationProcessorMock = {
            initReplication: jest.fn(),
        } as unknown as jest.Mocked<ReplicationProcessor>;

        jest.spyOn(ReplicationProcessor.prototype, "initReplication").mockImplementation(replicationProcessorMock.initReplication);
    });

    it("IcrcReplicationManager: should initialize replication collections correctly", async () => {
        const manager = new IcrcReplicationManager(
            logger,
            replicationConfiguration,
            identifierService,
            icrcRxSyncStateService,
            icrcDbContext,
            createCanisterFunc,
            allowanceDataStorage,
            assetDataStorage,
            contactDataStorage,
            serviceDataStorage
        );

        await manager.init();

        expect(replicationProcessorMock.initReplication).toHaveBeenCalledWith([
            expect.objectContaining({ collectionName: "Allowances" }),
            expect.objectContaining({ collectionName: "Assets" }),
            expect.objectContaining({ collectionName: "Contacts" }),
            expect.objectContaining({ collectionName: "Services" }),
        ]);

        const replicationCollectionList = replicationProcessorMock.initReplication.mock.calls[0][0];
        expect(replicationCollectionList).toHaveLength(4);

        for (let item of replicationCollectionList) {
            const pullName = `pull${item.collectionName}`;
            const pushName = `push${item.collectionName}`;

            const mockReplicaCanister = {} as any;

            mockReplicaCanister[pullName] = jest.fn();
            mockReplicaCanister[pushName] = jest.fn();

            const mockItems = [{}];

            await item.replicationPull(mockReplicaCanister, "mock-updatedAt", ["mock-id"], 10);
            expect(mockReplicaCanister[pullName]).toHaveBeenCalledWith("mock-updatedAt", ["mock-id"], 10);

            await item.replicationPush(mockReplicaCanister, mockItems);
            expect(mockReplicaCanister[pushName]).toHaveBeenCalledWith(mockItems);
        }

    });


});
