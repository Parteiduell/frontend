import { smallestHashes } from "./smallestHash";

export class FragmentIdentifier {
  constructor(api) {
    this.api = api;
  }

  set(item) {
    const hashes = smallestHashes(Object.values(item.possibleAnswers));
    window.location.hash = item.theseId + ":" + item.possibleParties.sort().join(",") + ":" + hashes[Object.keys(item.possibleAnswers).indexOf(item.answer)];
  }

  get() {
    const [theseId, possibleParties, hash] = decodeURIComponent(window.location.hash).substr(1).split(":");

    this.api.preload();

    return this.api
      .list(1, { id: theseId, parties: possibleParties.split(",") }) // fetch from REMOTE!
      .then((items) => {
        return this.api.getItem(items, hash);
      });
  }
}
