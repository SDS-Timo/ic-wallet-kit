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
