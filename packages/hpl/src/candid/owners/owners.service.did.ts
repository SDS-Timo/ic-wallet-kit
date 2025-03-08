import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'status_code' : number,
}
export interface _SERVICE {
  'get' : ActorMethod<[bigint], Principal>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'lookup' : ActorMethod<[Principal], [] | [bigint]>,
  'slice' : ActorMethod<[bigint, bigint], Array<Principal>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];