import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface HplAccountDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface HplAssetDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface HplContactDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface HplVirtualAccountDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface WalletDatabase {
  'doesStorageExist' : ActorMethod<[], boolean>,
  'dump' : ActorMethod<
    [],
    Array<
      [
        Principal,
        [
          Array<[] | [HplAssetDocument]>,
          Array<[] | [HplAccountDocument]>,
          Array<[] | [HplVirtualAccountDocument]>,
          Array<[] | [HplContactDocument]>,
        ],
      ]
    >
  >,
  'pullHplAccounts' : ActorMethod<
    [number, [] | [string], bigint],
    Array<HplAccountDocument>
  >,
  'pullHplAssets' : ActorMethod<
    [number, [] | [string], bigint],
    Array<HplAssetDocument>
  >,
  'pullHplContacts' : ActorMethod<
    [number, [] | [string], bigint],
    Array<HplContactDocument>
  >,
  'pullHplVirtualAccounts' : ActorMethod<
    [number, [] | [string], bigint],
    Array<HplVirtualAccountDocument>
  >,
  'pushHplAccounts' : ActorMethod<
    [Array<HplAccountDocument>],
    Array<HplAccountDocument>
  >,
  'pushHplAssets' : ActorMethod<
    [Array<HplAssetDocument>],
    Array<HplAssetDocument>
  >,
  'pushHplContacts' : ActorMethod<
    [Array<HplContactDocument>],
    Array<HplContactDocument>
  >,
  'pushHplVirtualAccounts' : ActorMethod<
    [Array<HplVirtualAccountDocument>],
    Array<HplVirtualAccountDocument>
  >,
}
export interface _SERVICE extends WalletDatabase {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
