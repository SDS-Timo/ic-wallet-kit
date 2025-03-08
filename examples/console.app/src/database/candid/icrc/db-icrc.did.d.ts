import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AllowanceDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface AssetDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface ContactDocument {
  'id' : string,
  'deleted' : boolean,
  'updatedAt' : number,
  'payload' : string,
}
export interface ServiceDocument {
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
          Array<[] | [AssetDocument]>,
          Array<[] | [ContactDocument]>,
          Array<[] | [AllowanceDocument]>,
          Array<[] | [ServiceDocument]>,
        ],
      ]
    >
  >,
  'pullAllowances' : ActorMethod<
    [number, [] | [string], bigint],
    Array<AllowanceDocument>
  >,
  'pullAssets' : ActorMethod<
    [number, [] | [string], bigint],
    Array<AssetDocument>
  >,
  'pullContacts' : ActorMethod<
    [number, [] | [string], bigint],
    Array<ContactDocument>
  >,
  'pullServices' : ActorMethod<
    [number, [] | [string], bigint],
    Array<ServiceDocument>
  >,
  'pushAllowances' : ActorMethod<
    [Array<AllowanceDocument>],
    Array<AllowanceDocument>
  >,
  'pushAssets' : ActorMethod<[Array<AssetDocument>], Array<AssetDocument>>,
  'pushContacts' : ActorMethod<
    [Array<ContactDocument>],
    Array<ContactDocument>
  >,
  'pushServices' : ActorMethod<
    [Array<ServiceDocument>],
    Array<ServiceDocument>
  >,
}
export interface _SERVICE extends WalletDatabase {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
