import Select from "react-select";
import React, { Component } from "react";
import { API } from "./API";


function optionsToElements(options) {
  return options.map(option => option.value);
}

function elementsToOptions(elements) {
  return elements.map(element => {
    return { value: element, label: element };
  });
}
class Settings extends Component {
  constructor(props) {
    super(props);

    let selectedParties = [];
    let selectedSources = [];

    if (typeof Storage !== "undefined") {
      selectedParties = localStorage.getItem("selectedParties");
      if (selectedParties) {
        selectedParties = JSON.parse(selectedParties);
      }
      selectedSources = localStorage.getItem("selectedSources");
      if (selectedSources) {
        selectedSources = JSON.parse(selectedSources);
      }
    }

    this.api = new API(this);

    this.state = {
      fetched: false,
      closed: true,
      selectedParties: selectedParties
        ? selectedParties
        : [
            "SPD",
            "CDU/CSU",
            "GRÜNE",
            "FDP",
            "PIRATEN",
            "DIE LINKE",
            "NPD",
            "Die PARTEI",
            "AfD",
          ],
      selectedSources: selectedSources
        ? selectedSources
        : [
            "Bundestagswahl 2005",
            "Bundestagswahl 2009",
            "Bundestagswahl 2013",
            "Bundestagswahl 2017",
          ],
    };
  }

  handleSourcesChange(selectedSources) {
    if (selectedSources !== null && selectedSources.length >= 1) {
      this.setState(
        { selectedSources: optionsToElements(selectedSources) },
        () => {
          this.api.getSelectableParties().then(parties => {
            this.setState({
              selectedParties: this.state.selectedParties.filter(x => {
                return parties.includes(x);
              }),
            });
            this.setState({ parties });
          });
        }
      );
    }
  }

  handlePartiesChange(selectedParties) {
    if (selectedParties.length >= 2) {
      this.setState({ selectedParties: optionsToElements(selectedParties) });
    }
  }


  close() {
    if (typeof Storage !== "undefined") {
      localStorage.setItem(
        "selectedSources",
        JSON.stringify(this.state.selectedSources)
      );
      localStorage.setItem(
        "selectedParties",
        JSON.stringify(this.state.selectedParties)
      );
    }
    this.setState({ closed: true });
    this.props.onClose();
  }

  reset() {
    if (typeof Storage !== "undefined") {
      localStorage.removeItem("selectedSources");
      localStorage.removeItem("selectedParties");
    }

    this.setState({ closed: true });
    this.props.onClose();
  }

  show() {
    this.setState({ closed: false });
    if (!this.state.fetched) {
      this.api.getSelectableParties().then(parties => this.setState({ parties }));
      this.api.getSelectableSources().then(sources => this.setState({ sources }));
      this.setState({ fetched: true });
    }
  }

  getSettings() {
    return this.state;
  }

  render() {
    if (
      !this.state.closed &&
      this.state.parties !== undefined &&
      this.state.sources !== undefined
    ) {
      const selectedParties = elementsToOptions(this.state.selectedParties);
      const selectedSources = elementsToOptions(this.state.selectedSources);
      const parties = elementsToOptions(this.state.parties);
      const sources = elementsToOptions(this.state.sources);
      return (
        <div className="overlay">
          <div className="settings">
            <h2>Quellen</h2>
            <Select
              className="select"
              classNamePrefix="select"
              value={selectedSources}
              onChange={this.handleSourcesChange.bind(this)}
              options={sources}
              isMulti={true}
              closeMenuOnSelect={false}
            />
            <h2>Parteien</h2>
            <Select
              className="select"
              classNamePrefix="select"
              value={selectedParties}
              onChange={this.handlePartiesChange.bind(this)}
              options={parties}
              isMulti={true}
              closeMenuOnSelect={false}
            />
            <label className="next">
              <button onClick={this.reset.bind(this)}></button>
              Reset
            </label>
            <label className="next">
              <button onClick={this.close.bind(this)}></button>
              Schließen
            </label>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Settings;
