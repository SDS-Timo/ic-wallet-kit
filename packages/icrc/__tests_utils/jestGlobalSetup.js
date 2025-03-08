module.exports = async () => {
  let stringify_original = JSON.stringify;

  const replacer = (key, value) => typeof value === "bigint" ? value.toString() : value;

  JSON.stringify = function (o, r) {
      return stringify_original(o, replacer);
  }

};