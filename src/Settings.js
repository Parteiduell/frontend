import Select from "react-select";
import React, { Component } from "react";

const parties = [];
const sources = [];
var fetched = false;

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
class Settings extends Component {
  constructor(props) {
    super(props);

    var selectedParties = []
    var selectedSources = []
    if (typeof (Storage) !== "undefined") {
      selectedParties = localStorage.getItem("selectedParties");
      if (selectedParties) {
        selectedParties = JSON.parse(selectedParties);
      }
      selectedSources = localStorage.getItem("selectedSources");
      if (selectedSources) {
        selectedSources = JSON.parse(selectedSources);
      }
    } 

    this.state = {
      closed: true,
      selectedParties: selectedParties
        ? selectedParties
        : ["SPD", "CDU/CSU", "GRÜNE", "FDP", "PIRATEN", "DIE LINKE", "NPD", "Die PARTEI", "AfD"],
      selectedSources: selectedSources
        ? selectedSources
        : ["Bundestagswahl 2005", "Bundestagswahl 2009", "Bundestagswahl 2013", "Bundestagswahl 2017"]
    };
  }

  handlePartiesChange(selectedParties) {
    if (selectedParties.length >= 2) {
      this.setState({ selectedParties: selectedParties.map(party => party.value) });
    }
  }

  handleSourcesChange(selectedSources) {
    this.setState({ selectedSources: selectedSources.map(source => source.value) });
  }

  close() {
    this.setState({ closed: true });
    this.props.onClose();
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem("selectedSources", JSON.stringify(this.state.selectedSources));
      localStorage.setItem("selectedParties", JSON.stringify(this.state.selectedParties));
    } 
  }

  reset() {
    if (typeof (Storage) !== "undefined") {
      localStorage.removeItem('selectedSources');
      localStorage.removeItem('selectedParties');
    }
  
    this.setState({ closed: true });
    this.props.onClose();
  }

  show() {
    this.setState({ closed: false });
    if (!fetched) {
      fetch(window.url.replace("/list", "/allParties"))
        .then(result => result.json())
        .then(result => result.sort(sortAlphabetically))
        .then(result => {
          result.forEach(party => {
            parties.push({ value: party, label: party });
          });
        });

      fetch(window.url.replace("/list", "/allSources"))
        .then(result => result.json())
        .then(result => result.sort(sortAlphabetically))
        .then(result => {
          result.forEach(source => {
            sources.push({ value: source, label: source });
          });
        });
      fetched = true;
    }
  }

  getSettings() {
    return this.state;
  }

  render() {
    const selectedParties = this.state.selectedParties.map(party => {
      return { label: party, value: party };
    });
    const selectedSources = this.state.selectedSources.map(source => {
      return { label: source, value: source };
    });

    if (!this.state.closed) {
      return (
        <div className="overlay">
          <div className="settings">
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
