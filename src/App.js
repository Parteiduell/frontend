import React, { Component } from 'react';

import Confetti from 'react-confetti';
import windowSize from 'react-window-size';

import mock from "./mock.json"
import "./App.css";


function importAll(r) {
  return r.keys().map(r);
}

/*
* extract parameter from url to toggle test mode and joystick mode
*/
function findGetParameter(parameterName) {
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


const url = "https://api.parteiduell.de/list";
const images = importAll(require.context("./pictures/", false, /\.(png|jpe?g|svg)$/));


class Fragen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      err: null,
      items: [],
      correct: null,
      parties: [],
      selected: null,
      score: 0, //not yet used, maybe in a later version ?
      mockItem: 0
    };
  }
  componentDidMount() {
    // Specify keydown handler
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Load first question
    this.handleNext();
  }

  // Is the selected party the right one?
  compare(partei) {
    return () => {
      this.setState({
        correct: partei === this.state.items[0].answer,
        selected: partei
      })
    }
  }

  // Get icon from party name
  getImage(partei) {
    for (var image of images) {
      // Small images are encoded as base64 in webpack. That breaks this.
      if (image.includes(partei.toLowerCase().replace("/", "-"))) {
        return image;
      }
    }
    console.error("Kein passendes Bild gefunden!", partei);
  }

  // Handle keypresses for the joystick
  handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      this.compare(this.state.items[0].possibleParties[0])();
    } else if (e.key === "ArrowLeft") {
      this.compare(this.state.items[0].possibleParties[1])();
    } else if (e.key === "ArrowDown") {
      this.compare(this.state.items[0].possibleParties[2])();
    } else if (e.key === "ArrowRight") {
      this.compare(this.state.items[0].possibleParties[3])();
    } else if (e.key === "a") {
      this.handleNext();
    }
  }

  handleNext() {
    this.setState({
      correct: null,
      isLoaded: false,
      selected: null
    });


    if (findGetParameter("mock") === "True") {
      // use mock data when GET arg mock is set to "True"
      this.setState({ isLoaded: true, items: [mock[this.state.mockItem]] });
      if (this.state.mockItem < mock.length) {
        this.setState({ mock_item: this.state.mockItem + 1 });
      }
    } else {
      // use data from backend
      fetch(url) // fetch from REMOTE!
        .then(result => result.json())
        .then((result) => {
          this.setState({
            isLoaded: true,
            items: result,
          });
        },
          (error) => {
            console.log("Error connecting to backend! (url: " + url + ")", error);
          })
    }

  }

  // return colours for confetti
  returnColours() {
    if (this.state.selected === "NPD" || this.state.selected === "AfD") {
      return ['#8B4513'];
    } else {
      return ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#795548'];
    }
  }

  renderResult() {
    const { items, correct, selected } = this.state;
    if (correct != null) {
      if (correct) {
        return (
          <div>
            <p autoFocus={true} id="answer">Richtig!</p>
            <Confetti
              width={this.props.windowWidth}
              height={this.props.windowHeight} //adjusts window size automatically
              recycle={false}
              gravity={0.2}
              numberOfPieces={400}
              colors={this.returnColours()}
            />
            <label class="next">
              <button onClick={this.handleNext.bind(this)}></button>
              Nächste Frage
            </label>
          </div>
        )
      } else {
        return (
          <div>
            <h2 autoFocus={true}>Falsch, diese Aussage war von {items[0].answer}</h2>
            <p>Die Partei "{selected}" hat folgendes Statement abgegeben:</p>
            <p class="quote">{items[0].possibleAnswers[selected]}</p>
            <label class="next">
              <button role={"button"} onClick={this.handleNext.bind(this)}></button>
              Nächste Frage
            </label>
          </div >
        )
      }
    }
  }

  render() {
    const { isLoaded, items, selected } = this.state;
    var joystick = findGetParameter("joystick") === "True";

    if (isLoaded) {
      var parties = Object.keys(items[0].possibleAnswers);
      return (
        <div>
          {items.map(
            item => (
              <div>
                <p class="these"> {item.these} </p>
                <p class="statement quote">{'"'+item.statement+'"'}</p>
                <div class="source">{item.source} - {item.context}</div>
                <div id="options" className={[selected ? "selected" : "", joystick ? "joystick" : ""].join(" ")}>
                  {parties.map(
                    partei => (
                      <label class="logos">
			                  <img role={"button"} src={this.getImage(partei)} aria-label={partei} alt={partei} className={(partei === this.state.items[0].answer) ? "right" : "wrong"} />
                        <button onClick={this.compare(partei)}></button>
                      </label>
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
        <p> Hmm, Daten werden noch geladen...</p>
      );
    }
  }

}

export default windowSize(Fragen);
