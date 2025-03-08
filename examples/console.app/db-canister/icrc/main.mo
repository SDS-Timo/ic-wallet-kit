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

  type StableStorage<Asset, Contact, Allowance, Service> = AssocList.AssocList<Principal, (DB.DbInit<Asset, Text>, DB.DbInit<Contact, Text>, DB.DbInit<Allowance, Text>, DB.DbInit<Service, Text>)>;
  type AssetDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type ContactDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type AllowanceDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };
  type ServiceDocument_v0 = {
    id : Text;
    updatedAt : Nat32;
    deleted : Bool;
    payload : Text;
  };

  stable var storage_v0 : StableStorage<AssetDocument_v0, ContactDocument_v0, AllowanceDocument_v0, ServiceDocument_v0> = null;
  // example how to migrate schema to next version. Uncomment, implement cast functions, replace types below and use new stable var storage_vX everywhere instead of old storage_v0.
  // after initial upgrade v0 stable variable can be deleted
  // Note that it was written before refactoring primary keys, so should be updated accordingly
  // stable var storage_v1 : StableStorage<TokenDocument_v1, ContactDocument_v1> = (
  //   func migrateV1() : StableStorage<TokenDocument_v1, ContactDocument_v1> {
  //     let castToken = func(item : TokenDocument_v0) : TokenDocument_v1 = item;
  //     let castContact = func(item : ContactDocument_v0) : ContactDocument_v1 = item;
  //     let res = List.map<(Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<ContactDocument_v1>)), (Principal, (DB.DbInit<TokenDocument_v1>, DB.DbInit<ContactDocument_v1>))>(
  //       storage_v0,
  //       func((p, (x, y))) = (p, (DB.migrate(x, castToken), DB.migrate(y, castContact))),
  //     );
  //     storage_v0 := null;
  //     res;
  //   }
  // )();

  // update these when migrating database
  type AssetDocument = AssetDocument_v0;
  type ContactDocument = ContactDocument_v0;
  type AllowanceDocument = AllowanceDocument_v0;
  type ServiceDocument = ServiceDocument_v0;

  var databasesCache : AssocList.AssocList<Principal, (DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<ServiceDocument, Text>)> = null;

  private func getDatabase(owner : Principal, notFoundStrategy : { #create; #returnNull }) : ?(DB.DbUse<AssetDocument, Text>, DB.DbUse<ContactDocument, Text>, DB.DbUse<AllowanceDocument, Text>, DB.DbUse<ServiceDocument, Text>) {
    switch (AssocList.find(databasesCache, owner, Principal.equal)) {
      case (?db) ?db;
      case (null) {
        let (tInit, cInit, aInit, sInit) = switch (AssocList.find(storage_v0, owner, Principal.equal)) {
          case (?store) store;
          case (null) {
            switch (notFoundStrategy) {
              case (#returnNull) return null;
              case (#create) {
                let store = (DB.empty<AssetDocument, Text>(), DB.empty<ContactDocument, Text>(), DB.empty<AllowanceDocument, Text>(), DB.empty<ServiceDocument, Text>());
                let (upd, _) = AssocList.replace(storage_v0, owner, Principal.equal, ?store);
                storage_v0 := upd;
                store;
              };
            };
          };
        };
        let db = (
          DB.use<AssetDocument, Text>(tInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<ContactDocument, Text>(cInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<AllowanceDocument, Text>(aInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
          DB.use<ServiceDocument, Text>(sInit, func(x) = x.id, Text.compare, func(x) = x.updatedAt),
        );
        let (upd, _) = AssocList.replace(databasesCache, owner, Principal.equal, ?db);
        databasesCache := upd;
        ?db;
      };
    };
  };

  public shared ({ caller }) func pushAssets(docs : [AssetDocument]) : async [AssetDocument] {
    let ?(tdb, _, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(tdb, docs);
  };

  public shared ({ caller }) func pushContacts(docs : [ContactDocument]) : async [ContactDocument] {
    let ?(_, cdb, _, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(cdb, docs);
  };

  public shared ({ caller }) func pushAllowances(docs : [AllowanceDocument]) : async [AllowanceDocument] {
    let ?(_, _, adb, _) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(adb, docs);
  };

  public shared ({ caller }) func pushServices(docs : [ServiceDocument]) : async [ServiceDocument] {
    let ?(_, _, _, sdb) = getDatabase(caller, #create) else Debug.trap("Can never happen");
    DB.pushUpdates(sdb, docs);
  };

  public shared query ({ caller }) func pullAssets(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AssetDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(tdb, _, _, _)) DB.getLatest(tdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullContacts(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ContactDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, cdb, _, _)) DB.getLatest(cdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullAllowances(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [AllowanceDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, adb, _)) DB.getLatest(adb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func pullServices(updatedAt : Nat32, lastId : ?Text, limit : Nat) : async [ServiceDocument] {
    switch (getDatabase(caller, #returnNull)) {
      case (?(_, _, _, sdb)) DB.getLatest(sdb, updatedAt, lastId, limit);
      case (null) [];
    };
  };

  public shared query ({ caller }) func dump() : async [(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))] {
    Iter.toArray<(Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))>(
      Iter.map<(Principal, (DB.DbInit<AssetDocument, Text>, DB.DbInit<ContactDocument, Text>, DB.DbInit<AllowanceDocument, Text>, DB.DbInit<ServiceDocument, Text>)), (Principal, ([?AssetDocument], [?ContactDocument], [?AllowanceDocument], [?ServiceDocument]))>(
        List.toIter(storage_v0),
        func((p, (t, c, a, s))) = (p, (Vector.toArray<?AssetDocument>(t.db.vec), Vector.toArray<?ContactDocument>(c.db.vec), Vector.toArray<?AllowanceDocument>(a.db.vec), Vector.toArray<?ServiceDocument>(s.db.vec))),
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
