# Hpl Canister Func

Actor creator for RxDB hpl data [canister](/examples/console.app/db-canister/hpl/).

### Example

```typescript
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../candid/hpl.did";
import { _SERVICE as HplActor } from "../candid/hpl.service.did";

const hplActor = Actor.createActor<HplActor>(idlFactory, {
      agent: new HttpAgent(),
      canisterId: "hpl-canister-id",
    });

```
**hpl.did**

```javascript
export const idlFactory = ({ IDL }) => {
  const HplAssetDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const HplAccountDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const HplVirtualAccountDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const HplContactDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const WalletDatabase = IDL.Service({
    'doesStorageExist' : IDL.Func([], [IDL.Bool], ['query']),
    'dump' : IDL.Func(
        [],
        [
          IDL.Vec(
            IDL.Tuple(
              IDL.Principal,
              IDL.Tuple(
                IDL.Vec(IDL.Opt(HplAssetDocument)),
                IDL.Vec(IDL.Opt(HplAccountDocument)),
                IDL.Vec(IDL.Opt(HplVirtualAccountDocument)),
                IDL.Vec(IDL.Opt(HplContactDocument)),
              ),
            )
          ),
        ],
        ['query'],
      ),
    'pullHplAccounts' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(HplAccountDocument)],
        ['query'],
      ),
    'pullHplAssets' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(HplAssetDocument)],
        ['query'],
      ),
    'pullHplContacts' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(HplContactDocument)],
        ['query'],
      ),
    'pullHplVirtualAccounts' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(HplVirtualAccountDocument)],
        ['query'],
      ),
    'pushHplAccounts' : IDL.Func(
        [IDL.Vec(HplAccountDocument)],
        [IDL.Vec(HplAccountDocument)],
        [],
      ),
    'pushHplAssets' : IDL.Func(
        [IDL.Vec(HplAssetDocument)],
        [IDL.Vec(HplAssetDocument)],
        [],
      ),
    'pushHplContacts' : IDL.Func(
        [IDL.Vec(HplContactDocument)],
        [IDL.Vec(HplContactDocument)],
        [],
      ),
    'pushHplVirtualAccounts' : IDL.Func(
        [IDL.Vec(HplVirtualAccountDocument)],
        [IDL.Vec(HplVirtualAccountDocument)],
        [],
      ),
  });
  return WalletDatabase;
};
export const init = ({ IDL }) => { return []; };

```

**hpl.service.did**

```typescript
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

```