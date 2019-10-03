import Select from 'react-select';
import React, { Component } from "react";

const parties = [];
const sources = [];

class Settings extends Component {

    constructor(props) {
        super(props);

        const { selectedParties } = this.props;
        const { selectedSources } = this.props;

        this.state = {
            selectedParties: selectedParties.map(party => { return { label: party, value: party } }),
            selectedSources: selectedSources.map(source => { return { label: source, value: source } }),
            closed: true
        };

        fetch(window.url.replace("/list", "/allParties"))
            .then(result => result.json())
            .then(result => {
                result.forEach(party => {
                    parties.push({ value: party, label: party })
                });
            });

        fetch(window.url.replace("/list", "/allSources"))
            .then(result => result.json())
            .then(result => {
                result.forEach(source => {
                    sources.push({ value: source, label: source })
                });
            });
    }


    handlePartiesChange(selectedParties) {
        if (selectedParties.length >= 2) {
            this.props.onPartiesChange(selectedParties.map(party => party.value));
        }
    }

    handleSourcesChange(selectedSources) {
        if (selectedSources !== null) {
            this.props.onSourcesChange(selectedSources.map(source => source.value));
        }
    }

    close() {
        this.setState({ closed: true })
        this.props.onClose();
    }

    show() {
        this.setState({ closed: false })
    }

    render() {
        const selectedParties = this.props.selectedParties.map(party => { return { label: party, value: party } });
        const selectedSources = this.props.selectedSources.map(source => { return { label: source, value: source } });

        if (!this.state.closed) {
            return (
                <div className="overlay">
                    <div className="settings">
                        <h2>Parteien</h2>
                        <Select
                            value={selectedParties}
                            onChange={this.handlePartiesChange.bind(this)}
                            options={parties}
                            isMulti={true}
                        />
                        <h2>Quellen</h2>
                        <Select
                            value={selectedSources}
                            onChange={this.handleSourcesChange.bind(this)}
                            options={sources}
                            isMulti={true}
                        />
                        <label className="next">
                            <button onClick={this.close.bind(this)}></button>
                            Schließen
                        </label>
                    </div >

                </div>
            );
        } else {
            return null;
        }
    }
}

export default Settings;
