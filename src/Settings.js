import Select from 'react-select';
import React, { Component } from "react";


const options = [];


class Settings extends Component {
    constructor(props) {
        super(props);
        fetch(window.url.replace("/list", "/allParties"))
            .then(result => result.json())
            .then(result => {
                result.forEach(party => {
                    options.push({ value: party, label: party })
                });
            });
        this.state = {
            selectedOptions: [
                {
                    label: "SPD", value: "SPD"
                },
                {
                    label: "CDU/CSU", value: "CDU/CSU"
                },
                {
                    label: "GRÜNE", value: "GRÜNE"
                },
                {
                    label: "FDP", value: "FDP"
                },
                {
                    label: "PIRATEN", value: "PIRATEN"
                },
                {
                    label: "DIE LINKE", value: "DIE LINKE"
                },
                {
                    label: "NPD", value: "NPD"
                },
                {
                    label: "Die PARTEI", value: "Die PARTEI"
                },
                {
                    label: "AfD", value: "AfD"
                }
            ]
        };
    }


    handleChange(selectedOptions) {
        console.log(selectedOptions)
        this.setState(
            { selectedOption: selectedOptions },
            () => console.log(`Option selected:`, this.state.selectedOptions)
        );

    };

    render() {
        const { selectedOptions } = this.state;
        return (
            <Select
                value={selectedOptions}
                onChange={this.handleChange.bind(this)}
                options={options}
                isMulti={true}
            />
        );
    }
}

export default Settings;
