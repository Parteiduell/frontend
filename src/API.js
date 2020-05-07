import { getFromHash } from "./smallestHash";
import Settings from "./Settings";
import escapeRegex from "escape-string-regexp";

function sortAlphabetically(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

const toReplace = ["CDU / CSU", "CDU/CSU", /(?:<!(Europäischen|Europäische) )Union/gi, "CDU und CSU", "CDU", "CSU", "Freie Demokraten", "Liberalen", "Liberale", "FDP", "BÜNDNIS 90 / DIE GRÜNEN", "BÜNDNIS 90/DIE GRÜNEN", "Grünen", "PIRATENpartei", "alternative für deutschland", "Die Linken", "Die Linke", "Linken", "Linke", "Die Linkspartei.PDS"];

const url = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : "https://api.parteiduell.de";
export class API {
  constructor() {
    this.items = [];
  }

  fetchApi(path, params) {
    const fetchUrl = new URL(path, url);

    if (params !== undefined) {
      if (params.id !== undefined) {
        fetchUrl.searchParams.set("id", params.id);
      }
      if (params.parties !== undefined) {
        fetchUrl.searchParams.set("parties", params.parties);
      }
      if (params.sources !== undefined) {
        fetchUrl.searchParams.set("sources", params.sources);
      }
      if (params.count !== undefined) {
        fetchUrl.searchParams.set("count", params.count);
      }
    }
    return fetch(fetchUrl).then(
      (result) => result.json(),
      (error) => {
        throw new Error("Error connecting to backend! (url: " + fetchUrl + ") " + error);
      },
    );
  }

  getSettings() {
    if (this.settings.current !== null) {
      if (this.settings.current !== undefined) {
        return this.settings.current.getSettings();
      } else {
        return this.settings.getSettings();
      }
    } else {
      return new Settings().getSettings();
    }
  }

  list(count, params) {
    const settings = this.getSettings();

    return this.fetchApi("/list", {
      count: count,
      parties: settings.selectedParties.join(","),
      sources: settings.selectedSources.join(","),
      ...params,
    });
  }

  get() {
    // Start preloading
    this.preload();

    if (this.items.length === 0) {
      // There is no item. Load one.
      return this.list(1, {}).then((items) => {
        this.items = items;
        return this.getItem(this.items);
      });
    } else {
      // There are enough items, take one from the list

      return this.getItem(this.items);
    }
  }

  getItem(items, hash) {
    const item = items.shift();

    item.statement = "";

    if (hash === undefined) {
      item.answer = Object.keys(item.possibleAnswers)[Math.floor(Math.random() * 4)];
      item.statement = item.possibleAnswers[item.answer];
    } else {
      item.statement = getFromHash(Object.values(item.possibleAnswers), hash);
      item.answer = Object.keys(item.possibleAnswers).find((key) => item.possibleAnswers[key] === item.statement);
    }
    for (let replaceString of toReplace.concat(this.getSettings().selectedParties.map(escapeRegex))) {
      if (typeof replaceString === "string") {
        replaceString = RegExp(escapeRegex(replaceString), "gi");
      }
      item.statement = item.statement.replace(replaceString, "█████");
    }
    return item;
  }

  async preload() {
    if (this.items.length < 5) {
      // use data from backend
      this.list(10, {}).then((items) => {
        this.items.concat(items);
      });
    }
  }

  getSelectableParties() {
    const settings = this.getSettings();
    return this.fetchApi("/allParties", {
      sources: settings.selectedSources.join(","),
    }).then((result) => result.sort(sortAlphabetically));
  }

  getSelectableSources() {
    return this.fetchApi("/allSources").then((result) => result.sort(sortAlphabetically));
  }
}
