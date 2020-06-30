import { smallestHashes } from "./smallestHash";

export class FragmentIdentifier {
  static set(item) {
    const hashes = smallestHashes(Object.values(item.possibleAnswers));
    window.location.hash =
      item.theseId +
      ":" +
      item.possibleParties.sort().join(",") +
      ":" +
      hashes[Object.keys(item.possibleAnswers).indexOf(item.answer)];
  }

  static get() {
    const [theseId, possibleParties, hash] = decodeURIComponent(
      window.location.hash,
    )
      .substr(1)
      .split(":");

    window.api.preload();

    return window.api
      .list(1, { id: theseId, parties: possibleParties.split(",") }) // fetch from REMOTE!
      .then(items => {
        return window.api.getItem(items, hash);
      });
  }
}
