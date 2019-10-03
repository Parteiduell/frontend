import Select from 'react-select';
import React, { Component } from "react";

const options = [];

class Settings extends Component {

    constructor(props) {
        super(props);

        const { selectedParties } = this.props;

        this.state = {
            selectedOptions: selectedParties.map(party => { return { label: party, value: party } }),
            closed: true
        };

        fetch(window.url.replace("/list", "/allParties"))
            .then(result => result.json())
            .then(result => {
                result.forEach(party => {
                    options.push({ value: party, label: party })
                });
            });
    }


    handleChange(selectedOptions) {
        this.props.onPartiesChange(selectedOptions.map(option => option.value));
    };
    close() {
        this.setState({ closed: true })
    }
    show() {
        this.setState({ closed: false })
    }
    render() {
        const selectedOptions = this.props.selectedParties.map(party => { return { label: party, value: party } });
        if (!this.state.closed) {
            return (
                <div className="overlay">
                    <div className="settings">
                        <h2>Parteien</h2>
                        <Select
                            value={selectedOptions}
                            onChange={this.handleChange.bind(this)}
                            options={options}
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
