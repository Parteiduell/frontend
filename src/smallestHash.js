import {encode} from "./base66"

function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}


export function smallestHashes(strings) {
  let longHashes = [];
  let longestHash = 0;

  for (const string of strings) {
    const hash = encode(cyrb53(string));
    if (hash.length > longestHash) {
      longestHash = hash.length;
    }
    longHashes.push(hash);
  }

  let hashes = [];

  for (var length = 1; length < longestHash; length++) {
    var worked = true;
    for (const hash of longHashes) {
      const shortHash = hash.substr(0, length);
      if (!(shortHash in hashes)) {
        hashes.push(shortHash);
      } else {
        worked = false;
        break;
      }
    }
    if (worked) {
      break;
    }
  }
  return hashes;
}

export function getFromHash(strings, hash) {
  for (const string of strings) {
    if (hash === encode(cyrb53(string)).substr(0, hash.length)) {
      return string;
    }
  }
  throw new Error(`No matching statement for hash '${hash}' found!`)
}
