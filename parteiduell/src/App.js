import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Fragen extends Component {

  constructor(props) {
  super(props);
  this.state = {
    isLoaded: false,
    err: null,
    items: []
  };
}
componentDidMount() {
  this.setState({
    isLoaded: true,
    items: [{thema: "Umwelt", frage: "Sollte Deutschland mehr CO2 einsparen?", parteien: ["CDU", "SPD", "AfD", "LINKE"], antwort: "LINKE", kontext: null }]
  });

  // fetch("https://pa-clubs.herokuapp.com/database"). // fetch from REMOTE!
  // then(result => result.json())
  //   .then((res) => {
  //     console.log(res); //wahrscheinlich nicht
  //     this.setState({
  //       isLoaded: true,
  //       items: res
  //     });
  //   },
  //   (error) => { //was passiert, wenn das ganze falsch läuft ???
  //     this.setState({
  //       isLoaded: false,
  //       error
  //     });
  //     console.log(this.state)
  //   })
}

  render() {
    const { err, isLoaded, items } = this.state;
    console.log(items);
    return (
      <div>
      <h2> ParteiDuell </h2>
          {items.map(
         item =>
         <div>
           <h2> {item.thema} </h2>
            <h3> {item.frage} </h3>
            {item.parteien.map(
              partei =>
                  <ul> <li> {partei} </li> </ul>
            )}
          </div>
          )}
        </div>
    );
  }
}

export default Fragen;
