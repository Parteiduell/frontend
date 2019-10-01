import React, { Component } from 'react';

import Confetti from 'react-confetti';
import { BarLoader } from "react-spinners";
import { css } from "@emotion/core";
import windowSize from 'react-window-size';

import mock from "./mock.json"
import "./App.css";


const BarLoader_CSS = css`    
  display: block;
  margin: 0 auto;
`;
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
      item: null,
      correct: null,
      parties: [],
      selected: null,
      score: 0, //not yet used, maybe in a later version ?
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
        correct: partei === this.state.item.answer,
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
      this.compare(this.state.item.possibleParties[0])();
    } else if (e.key === "ArrowLeft") {
      this.compare(this.state.item.possibleParties[1])();
    } else if (e.key === "ArrowDown") {
      this.compare(this.state.item.possibleParties[2])();
    } else if (e.key === "ArrowRight") {
      this.compare(this.state.item.possibleParties[3])();
    } else if (e.key === "a") {
      this.handleNext();
    }
  }

  handleNext() {
    if (this.state.items.length > 0) {
      // There are enough items, take one from the list
      this.setState({
        correct: null,
        isLoaded: true,
        selected: null,
        item: this.state.items.shift()
      });

      // Preload items if there are less than 5 remaining
      if (this.state.items.length < 5) {
        // use data from backend
        fetch(url + "?count=10") // fetch from REMOTE!
          .then(result => result.json())
          .then((result) => {
            this.setState({
              items: this.state.items.concat(result),
            });
          },
            (error) => {
              console.log("Error connecting to backend! (url: " + url + ")", error);
            })
      }

    } else {
      // Load items the first time (loading only 3 because preloading will extend it by 10 in the background)
      this.setState({
        correct: null,
        isLoaded: false,
        selected: null,
      });

      if (findGetParameter("mock") === "True") {
        // use mock data when GET arg mock is set to "True"
        if (mock.length !== 0) {
          this.setState({
            correct: null,
            isLoaded: true,
            selected: null,
            item: mock.shift()
          });
        } else {
          this.setState({
            correct: null,
            isLoaded: false,
            selected: null,
            item: mock.shift()
          });
        }


      } else {
        // use data from backend
        fetch(url + "?count=3") // fetch from REMOTE!
          .then(result => result.json())
          .then((result) => {
            var item = result.shift()
            this.setState({
              isLoaded: true,
              items: result,
              item: item
            });
          },
            (error) => {
              console.log("Error connecting to backend! (url: " + url + ")", error);
            })
      }
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
    const { item, correct, selected } = this.state;
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
            <label className="next">
              <button onClick={this.handleNext.bind(this)}></button>
              Nächste Frage
            </label>
          </div>
        )
      } else {
        return (
          <div>
            <h2 autoFocus={true}>Falsch, diese Aussage war von {item.answer}</h2>
            <h3>Die Partei "{selected}" hat folgendes Statement abgegeben:</h3>
            <p className="quote">{item.possibleAnswers[selected]}</p>
            <label className="next">
              <button role={"button"} onClick={this.handleNext.bind(this)}></button>
              Nächste Frage
            </label>
          </div >
        )
      }
    }
  }

  render() {
    const { isLoaded, item, selected } = this.state;
    var joystick = findGetParameter("joystick") === "True";

    if (isLoaded) {
      var parties = Object.keys(item.possibleAnswers);
      return (
        <div>
          <div>
            <p className="these"> {item.these} </p>
            <p className="statement quote">{'"' + item.statement + '"'}</p>
            <div className="source">{item.source} - {item.context}</div>
            <div id="options" className={[selected ? "selected" : "", joystick ? "joystick" : ""].join(" ")}>
              {parties.map(
                (partei, index) => (
                  <label key={index} className="logos">
                    <img role={"button"} src={this.getImage(partei)} aria-label={partei} alt={partei} className={(partei === this.state.item.answer) ? "right" : "wrong"} />
                    <button onClick={this.compare(partei)}></button>
                  </label>
                )
              )}
            </div>
          </div>
          {this.renderResult()}
        </div>
      );
    } else {
      return <BarLoader css={BarLoader_CSS} sizeUnit={"px"} size={4000} color={"#414242"} />;
    }
  }

}

export default windowSize(Fragen);
