"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplicationProcessor = void 0;
const rxSyncStateBaseService_1 = require("@common/replications/rxSyncStateBaseService");
const services_1 = require("@common/services");
const storage_1 = require("@common/storage");
const types_1 = require("@common/types");
const agent_1 = require("@dfinity/agent");
require("reflect-metadata");
const rxdb_1 = require("rxdb");
const replication_1 = require("rxdb/plugins/replication");
const typedi_1 = require("typedi");
let ReplicationProcessor = class ReplicationProcessor {
    identifierService;
    rxSyncStateService;
    rxDbContext;
    createCanisterFunc;
    collectionDetailList = [];
    replicationStateList = [];
    replicaCanister;
    logger;
    configuration;
    constructor(logger, configuration, identifierService, rxSyncStateService, rxDbContext, createCanisterFunc) {
        this.identifierService = identifierService;
        this.rxSyncStateService = rxSyncStateService;
        this.rxDbContext = rxDbContext;
        this.createCanisterFunc = createCanisterFunc;
        this.logger = logger;
        this.configuration = configuration;
    }
    async initReplication(collectionDetailList) {
        const identity = this.identifierService.getIdentity();
        if (identity instanceof types_1.WatchOnlyIdentity) {
            this.logger.logDebug("replication unavailable for WatchOnlyIdentity");
            return;
        }
        this.collectionDetailList = collectionDetailList;
        await this.initAllReplication();
    }
    async initAllReplication() {
        while (this.replicationStateList.length > 0) {
            const replication = this.replicationStateList.pop();
            replication?.cancel();
        }
        for (let collectionDetail of this.collectionDetailList) {
            await this.initReplicationInternal(collectionDetail);
        }
    }
    async initReplicationInternal(collectionDetail) {
        const identity = this.identifierService.getIdentity();
        if (identity instanceof types_1.WatchOnlyIdentity) {
            this.logger.logDebug("replication unavailable for WatchOnlyIdentity");
            return;
        }
        const principal = this.identifierService.getPrincipalStr();
        const agent = await agent_1.HttpAgent.create({
            identity: identity,
            host: this.configuration.host
        });
        this.replicaCanister = this.createCanisterFunc(this.configuration.replicaCanister, {
            agent: agent,
        });
        const collection = this.rxDbContext.db.collections[collectionDetail.collectionName];
        const replicationState = (0, replication_1.replicateRxCollection)({
            collection: collection,
            replicationIdentifier: `${collectionDetail.collectionName}-${principal}`,
            deletedField: "deleted",
            autoStart: false,
            push: {
                handler: async (docs) => {
                    try {
                        const store = docs.map((x) => x.newDocumentState);
                        const documentsPushed = await collectionDetail.replicationPush(this.replicaCanister, store);
                        this.rxSyncStateService.ChangeState(rxSyncStateBaseService_1.RxSyncState.Connected);
                        return documentsPushed;
                    }
                    catch (error) {
                        this.rxSyncStateService.ChangeState(rxSyncStateBaseService_1.RxSyncState.Disconnected);
                        this.processConnectionError(error);
                        this.logger.logError(error);
                        throw error;
                    }
                },
                batchSize: 10,
                modifier: (d) => d
            },
            pull: {
                handler: async (lastCheckpoint, batchSize) => {
                    try {
                        const id = (lastCheckpoint?.id) ? [lastCheckpoint.id] : [];
                        const updatedAt = lastCheckpoint?.updatedAt || 0;
                        let documentsFromRemote = await await collectionDetail.replicationPull(this.replicaCanister, updatedAt, id, batchSize);
                        if (!documentsFromRemote) {
                            documentsFromRemote = [];
                        }
                        const result = {
                            documents: documentsFromRemote,
                            checkpoint: documentsFromRemote.length === 0
                                ? lastCheckpoint
                                : {
                                    id: (0, rxdb_1.lastOfArray)(documentsFromRemote).id,
                                    updatedAt: (0, rxdb_1.lastOfArray)(documentsFromRemote).updatedAt,
                                }
                        };
                        this.rxSyncStateService.ChangeState(rxSyncStateBaseService_1.RxSyncState.Connected);
                        return result;
                    }
                    catch (error) {
                        this.rxSyncStateService.ChangeState(rxSyncStateBaseService_1.RxSyncState.Disconnected);
                        this.processConnectionError(error);
                        this.logger.logError(error);
                        throw error;
                    }
                },
                batchSize: 10
            }
        });
        try {
            await replicationState.start();
        }
        catch (e) {
            this.logger.logError(e);
        }
        this.replicationStateList.push(replicationState);
    }
    processConnectionError(error) {
        let e = error;
        if (e && e.message == "Invalid certificate: Signature verification failed") {
            this.initAllReplication();
        }
    }
};
exports.ReplicationProcessor = ReplicationProcessor;
exports.ReplicationProcessor = ReplicationProcessor = __decorate([
    __param(0, (0, typedi_1.Inject)("Logger")),
    __metadata("design:paramtypes", [Object, Object, services_1.IdentifierService,
        rxSyncStateBaseService_1.RxSyncStateBaseService,
        storage_1.BaseRxDbContext, Function])
], ReplicationProcessor);
