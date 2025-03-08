import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export interface CreatePayload {
  'assetId' : bigint,
  'logo' : string,
  'name' : string,
  'symbol' : string,
}
export interface FungibleToken {
  'assetId' : bigint,
  'modifiedAt' : bigint,
  'logo' : string,
  'name' : string,
  'createdAt' : bigint,
  'symbol' : string,
}
export interface Request {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
}
export interface Response {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export interface UpdatePayload {
  'logo' : [] | [string],
  'name' : [] | [string],
  'symbol' : [] | [string],
}
export interface _SERVICE {
  'addOwner' : ActorMethod<[Principal], undefined>,
  'addToken' : ActorMethod<[CreatePayload], undefined>,
  'allTokens' : ActorMethod<[], Array<FungibleToken>>,
  'correctAssetId' : ActorMethod<[string, bigint], undefined>,
  'correctSymbol' : ActorMethod<[bigint, string], undefined>,
  'freezingPeriod' : ActorMethod<[], bigint>,
  'http_request' : ActorMethod<[Request], Response>,
  'nTokens' : ActorMethod<[], bigint>,
  'owners' : ActorMethod<[], Array<Principal>>,
  'removeOwner' : ActorMethod<[Principal], undefined>,
  'tokenByAssetId' : ActorMethod<[bigint], [] | [FungibleToken]>,
  'tokenBySymbol' : ActorMethod<[string], [] | [FungibleToken]>,
  'updateToken' : ActorMethod<[bigint, UpdatePayload], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];