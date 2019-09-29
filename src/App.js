import React, { Component } from 'react';
import "./App.css";
import Confetti from 'react-confetti';
import windowSize from 'react-window-size';

import mock from "./mock.json"
function importAll(r) {
  return r.keys().map(r);
}

function findGetParameter(parameterName) { //extract parameter from url to toggle test mode and joystick mode
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

const images = importAll(require.context("./pictures/", false, /\.(png|jpe?g|svg)$/));

class Fragen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      err: null,
      items: [],
      korrekt: null,
      parties: [],
      selected: null,
      score: 0, //not yet used, maybe in a later version ?
      mock_item: 0
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.handleNext();
  }

  compare(partei) { //do the selected party and the right party match?
    return () => {
      if (partei === this.state.items[0].answer) {
        this.setState({
          korrekt: true,
          selected: partei
        })
      } else {
        this.setState({
          korrekt: false,
          selected: partei
        })
      }
    }
  }
  getImage(partei) {
    for (var image of images) {
      if (image.includes(partei.toLowerCase().replace("/", "-"))) { //hier könnte mit zu kleinen fotos ein fehler aufgrund base64
        return image;                                               // konvertierung geben.
      }
    }
    console.error("Kein passendes Bild gefunden!", partei);
  }
  handleKeyDown(e) { //für den joystick
    console.log(this.state.items[0])
    if (e.key === "ArrowUp") {
      this.compare(this.state.items[0].possibleParties[0])();
    } else if (e.key === "ArrowLeft") {
      this.compare(this.state.items[0].possibleParties[1])();
    } else if (e.key === "ArrowDown") {
      this.compare(this.state.items[0].possibleParties[2])();
    } else if (e.key === "ArrowRight") {
      this.compare(this.state.items[0].possibleParties[3])();
    }
  }
  handleNext() {
    this.setState({
      korrekt: null,
      isLoaded: false,
      selected: null
    });
    if (findGetParameter("mock") === "True") {
      this.setState({ isLoaded: true, items: [mock[this.state.mock_item]] });
      if (this.state.mock_item < mock.length) {
        this.setState({ mock_item: this.state.mock_item + 1 });
      }
    } else {
      fetch("https://api.parteiduell.de/list") // fetch from REMOTE!
        .then(result => result.json())
        .then((res) => {

          this.setState({
            isLoaded: true,
            items: res,
          });
        },
          (error) => { 
            this.setState({
              isLoaded: false,
              error
            });
            console.log(this.state);
            console.log(process.env.REACT_APP_BACKEND_URL + "/list")
            console.log("Error connecting to backend!");
          })
    }

  }
  returnColours() {
    if (this.state.selected === "NPD" || this.state.selected === "AfD") {
      return ['#8B4513'];
    } else {
      return ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548'];
    }
  }

  renderResult() {
    const { items, korrekt, selected } = this.state;
    if (korrekt != null) {
      if (korrekt) {
        return (
          <div>
            <p id="antwort">Richtig!</p>
            <Confetti
              width={this.props.windowWidth}
              height={this.props.windowHeight} //adjusts window size automatically
              recycle={false}
              gravity={0.2}
              numberOfPieces={400}
              colors={this.returnColours()}
            />
            <label class="weiter">
              <button onClick={this.handleNext.bind(this)} >  </button>
              Nächste Frage
            </label>
          </div>
        )
      } else {
        return (
          <div>
            <h2> Falsch, diese Aussage war von {items[0].answer} </h2>
            <h3>Die Partei "{selected}" hat folgendes Statement abgegeben:</h3>
            <p class="quote">{items[0].possibleAnswers[selected]}</p>
            <label class="weiter">
              <button onClick={this.handleNext.bind(this)} >  </button>
              Nächste Frage
            </label>
          </div >
        )
      }
    }
  }

  render() {
    const { isLoaded, items, selected } = this.state;
    if (isLoaded) {
      var parties = Object.keys(items[0].possibleAnswers);
      return (
        <div id="allthings">
          {items.map(
            item => (
              <div>
                <h3 class="these"> {item.these} </h3>
                <h2 class="statement quote">{item.statement}</h2>
                <div class="source">{item.source} - {item.context}</div>
                <div id="optionen" className={selected ? "selected" : ""}>
                  {parties.map(
                    partei => (
                      <div class="logos">
                        <label class="parteien" >
                          <img src={this.getImage(partei)} alt={partei} className={(partei === this.state.items[0].answer) ? "right" : "wrong"} />
                          <button onClick={this.compare(partei)}> {partei} </button>
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          {this.renderResult()}
        </div>
      );
    } else {
      return (
        <p class=""> Hmm, Daten werden noch geladen...</p>
      );
    }
  }

}

export default windowSize(Fragen);
