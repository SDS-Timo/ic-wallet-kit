import AssocList "mo:base/AssocList";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Vector "mo:vector";

import DB "db";

actor class WalletDatabase() {

  type StableStorage<HplAsset, HplAccount, HplVirtualAccount, HplContact> = AssocList.AssocList<Principal, (DB.DbInit<HplAsset, Text>, DB.DbInit<HplAccount, Text>, DB.DbInit<HplVirtualAccount, Text>, DB.DbInit<HplContact, Text>)>;
  type HplAssetDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type HplAccountDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type HplVirtualAccountDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type HplContactDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };

  stable var storage_v0 : StableStorage<HplAssetDocument_v0, HplAccountDocument_v0, HplVirtualAccountDocument_v0, HplContactDocument_v0> = null;
  // example how to migrate schema to next version. Uncomment, implement cast functions, replace types below and use new stable var storage_vX everywhere instead of old storage_v0.
  // after initial upgrade v0 stable variable can be deleted
  // Note that it was written before refactoring primary keys, so should be updated accordingly
  // stable var storage_v1 : StableStorage<TokenDocument_v1, HplAccountDocument_v1> = (
  //   func migrateV1() : StableStorage<TokenDocument_v1, HplAccountDocument_v1> {
  //     let castToken = func(item : TokenDocument_v0) : TokenDocument_v1 = item;
  //     let castHplAccount = func(item : HplAccountDocument_v0) : HplAccountDocument_v1 = item;
  //     let res = List.map<(Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<HplAccountDocument_v1>)), (Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<HplAccountDocument_v1>))>(
  //       storage_v0,
  //       func((p, (x, y))) = (p, (DB.migrate(x, castToken), DB.migrate(y, castHplAccount))),
  //     );
  //     storage_v0 := null;
  //     res;
  //   }
  // )();

  // update these when migrating database
  type HplAssetDocument = HplAssetDocument_v0;
  type HplAccountDocument = HplAccountDocument_v0;
  type HplVirtualAccountDocument = HplVirtualAccountDocument_v0;
  type HplContactDocument = HplContactDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<HplAssetDocument, Text>, DB.DbUse<HplAccountDocument, Text>, DB.DbUse<HplVirtualAccountDocument, Text>, DB.DbUse<HplContactDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<HplAssetDocument, Text>, DB.DbUse<HplAccountDocument, Text>, DB.DbUse<HplVirtualAccountDocument, Text>, DB.DbUse<HplContactDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (aInit, acInit, vaInit, cInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
          case (?store) store;
          case (null) {
            switch (notFoundStrategy) {
              case (#returnNull) return null;
              case (#create) {
                let store = (DB.empty<HplAssetDocument, Text>(), DB.empty<HplAccountDocument, Text>(), DB.empty<HplVirtualAccountDocument, Text>(), DB.empty<HplContactDocument, Text>());
                let (upd, _) = AssocList.replace(storage_v0, owner, Principal.equal, ?store);
                storage_v0 := upd;
                store;
              };
            };
          };
        };
        let db = (
          DB.use<HplAssetDocument, Text>(aInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplAccountDocument, Text>(acInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplVirtualAccountDocument, Text>(vaInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<HplContactDocument, Text>(cInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
        );
        let (upd, _) = AssocList.replace(databasesCache, owner, Principal.equal, ?db);
        databasesCache := upd;
        ?db;
      };
    };
  };

  public shared ({ caller }) func pushHplAssets(docs : [HplAssetDocument]) : async [HplAssetDocument] {
    let ?(adb, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(adb, docs);
  };

  public shared ({ caller }) func pushHplAccounts(docs : [HplAccountDocument]) : async [HplAccountDocument] {
    let ?(_, acdb, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(acdb, docs);
  };

  public shared ({ caller }) func pushHplVirtualAccounts(docs : [HplVirtualAccountDocument]) : async [HplVirtualAccountDocument] {
    let ?(_, _, vadb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(vadb, docs);
  };

  public shared ({ caller }) func pushHplContacts(docs : [HplContactDocument]) : async [HplContactDocument] {
    let ?(_, _, _, cdb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(cdb, docs);
  };

  public shared query ({ caller }) func pullHplAssets(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplAssetDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(adb, _, _, _)) DB.getLatest(adb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullHplAccounts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplAccountDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, acdb, _, _)) DB.getLatest(acdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullHplVirtualAccounts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplVirtualAccountDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, vadb, _)) DB.getLatest(vadb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullHplContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [HplContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, cdb)) DB.getLatest(cdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func dump() : async [(Principal, ([?HplAssetDocument], [?HplAccountDocument], [?HplVirtualAccountDocument], [?HplContactDocument]))] {
    Iter.toArray<(Principal, ([?HplAssetDocument], [?HplAccountDocument], [?HplVirtualAccountDocument], [?HplContactDocument]))>(
      Iter.map<(Principal, (DB.DbInit<HplAssetDocument, Text>, DB.DbInit<HplAccountDocument, Text>, DB.DbInit<HplVirtualAccountDocument, Text>, DB.DbInit<HplContactDocument, Text>)), (Principal, ([?HplAssetDocument], [?HplAccountDocument], [?HplVirtualAccountDocument], [?HplContactDocument]))>(
        List.toIter(storage_v0),
        func((p, (a, ac, va, c))) = (p, (Vector.toArray<?HplAssetDocument>(a.db.vec), Vector.toArray<?HplAccountDocument>(ac.db.vec), Vector.toArray<?HplVirtualAccountDocument>(va.db.vec), Vector.toArray<?HplVirtualAccountDocument>(c.db.vec))),
      )
    );
  };

  public shared query ({ caller }) func doesStorageExist() : async Bool {
    switch (AssocList.find(databasesCache, caller, Principal.equal)) {
      case (?db) true;
      case (null) false;
    };
  };

};
