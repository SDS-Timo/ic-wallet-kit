export const idlFactory = ({ IDL }) => {
    const HttpRequest = IDL.Record({
      'url' : IDL.Text,
      'method' : IDL.Text,
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    });
    const HttpResponse = IDL.Record({
      'body' : IDL.Vec(IDL.Nat8),
      'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
      'status_code' : IDL.Nat16,
    });
    return IDL.Service({
      'get' : IDL.Func([IDL.Nat], [IDL.Principal], ['query']),
      'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
      'lookup' : IDL.Func([IDL.Principal], [IDL.Opt(IDL.Nat)], ['query']),
      'slice' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(IDL.Principal)], ['query']),
    });
  };
  export const init = ({ IDL }) => { return []; };