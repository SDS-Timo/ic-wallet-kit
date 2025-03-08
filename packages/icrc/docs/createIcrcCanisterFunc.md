# ICRC Canister Func

Actor creator for RxDB icrc data [canister](/examples/console.app/db-canister/icrc/).

### Example

```typescript
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../candid/icrc.did";
import { _SERVICE as IcrcActor } from "../candid/icrc.service.did";

const icrcActor = Actor.createActor<IcrcActor>(idlFactory, {
      agent: new HttpAgent(),
      canisterId: "icrc-canister-id",
    });

```
**icrc.did**

```javascript
export const idlFactory = ({ IDL }) => {
  const AssetDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const ContactDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const AllowanceDocument = IDL.Record({
    'id' : IDL.Text,
    'deleted' : IDL.Bool,
    'updatedAt' : IDL.Nat32,
    'payload' : IDL.Text,
  });
  const ServiceDocument = IDL.Record({
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
                IDL.Vec(IDL.Opt(AssetDocument)),
                IDL.Vec(IDL.Opt(ContactDocument)),
                IDL.Vec(IDL.Opt(AllowanceDocument)),
                IDL.Vec(IDL.Opt(ServiceDocument)),
              ),
            )
          ),
        ],
        ['query'],
      ),
    'pullAllowances' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(AllowanceDocument)],
        ['query'],
      ),
    'pullAssets' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(AssetDocument)],
        ['query'],
      ),
    'pullContacts' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(ContactDocument)],
        ['query'],
      ),
    'pullServices' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Text), IDL.Nat],
        [IDL.Vec(ServiceDocument)],
        ['query'],
      ),
    'pushAllowances' : IDL.Func(
        [IDL.Vec(AllowanceDocument)],
        [IDL.Vec(AllowanceDocument)],
        [],
      ),
    'pushAssets' : IDL.Func(
        [IDL.Vec(AssetDocument)],
        [IDL.Vec(AssetDocument)],
        [],
      ),
    'pushContacts' : IDL.Func(
        [IDL.Vec(ContactDocument)],
        [IDL.Vec(ContactDocument)],
        [],
      ),
    'pushServices' : IDL.Func(
        [IDL.Vec(ServiceDocument)],
        [IDL.Vec(ServiceDocument)],
        [],
      ),
  });
  return WalletDatabase;
};
export const init = ({ IDL }) => { return []; };


```

**icrc.service.did**

```typescript
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


```