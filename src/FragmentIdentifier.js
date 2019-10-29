import { smallestHashes } from "./smallestHash";
import { getItem } from "./API"

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

    static get(api) {
        const [theseId, possibleParties, hash] = decodeURIComponent(window.location.hash)
            .substr(1)
            .split(":");

        api.preload();

        return api.list(1, { id: theseId, parties: possibleParties.split(",") }) // fetch from REMOTE!
            .then(items => {
                return getItem(items, hash);
            });
    }
}