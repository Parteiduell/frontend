import React, { Component } from 'react';

import { BarLoader } from "react-spinners";
import { css } from "@emotion/core";
import windowSize from 'react-window-size';

import mock from "./mock.json"
import "./App.css";
import Result from "./Result.js";
import Option from "./Option.js"
import Startscreen from "./Startscreen"
import Settings from "./Settings"


const BarLoader_CSS = css`    
  display: block;
  margin: 0 auto;
`;

/*
* extract parameter from url to toggle test mode and joystick mode
*/
function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  window.location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

const url = process.env.REACT_APP_BACKEND_URL ? process.env.REACT_APP_BACKEND_URL : "https://api.parteiduell.de/list";
window.url = url;
console.log(`Backend URL: ${url}`);

class Main extends Component {

  constructor(props) {
    super(props);
    this.settings = React.createRef();
    this.state = {
      isLoaded: false,
      err: null,
      items: [],
      item: null,
      correct: null,
      selected: null,
      score: 0, //not yet used, maybe in a later version ?
      selectedParties: [
        "SPD",
        "CDU/CSU",
        "GRÜNE",
        "FDP",
        "PIRATEN",
        "DIE LINKE",
        "NPD",
        "Die PARTEI",
        "AfD"
      ]
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
    if (this.state.items.length === 0) {
      // There aren't any loaded items

      this.setState({
        correct: null,
        isLoaded: false,
        selected: null,
      });

      if (findGetParameter("mock") === "True") {
        // use mock data when GET arg mock is set to "True"
        if (mock.length !== 0) {
          this.setState({
            isLoaded: true,
            item: mock.shift()
          });
        }

      } else {
        // Load items the first time (loading only 1 because preloading will extend it by 10 in the background)

        fetch(this.createFetchUrl(1)) // fetch from REMOTE!
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
              console.log("Error connecting to backend! (url: " + this.createFetchUrl(1) + ")", error);
            })
        // preload items cause we only have one
        this.preload();
      }
    } else {
      // There are enough items, take one from the list

      this.setState({
        correct: null,
        isLoaded: true,
        selected: null,
        item: this.state.items.shift()
      });

      // Preload items if there are less than 5 remaining
      this.preload();
    }
  }

  createFetchUrl(count) {
    return url + "?count=" + String(count) + "&parties=" + this.state.selectedParties.join(",");
  }

  preload() {
    if (this.state.items.length < 5) {
      // use data from backend
      fetch(this.createFetchUrl(10)) // fetch from REMOTE!
        .then(result => result.json())
        .then((result) => {
          this.setState({
            items: this.state.items.concat(result),
          });
        },
          (error) => {
            console.log("Error connecting to backend! (url: " + this.createFetchUrl(10) + ")", error);
          })
    }
  }


  onPartiesChange(selectedParties) {
    this.setState(({ "selectedParties": selectedParties, items: [] }));
  }

  render() {
    const { isLoaded, item, selected, correct, selectedParties } = this.state;
    var joystick = findGetParameter("joystick") === "True";

    if (isLoaded) {
      var parties = Object.keys(item.possibleAnswers);
      return (
        <>
          <Startscreen />
          <Settings ref={this.settings} selectedParties={selectedParties} onPartiesChange={this.onPartiesChange.bind(this)} />
          <p className="these">{item.these}</p>
          {
            // eslint-disable-next-line
          }<p className="statement quote" role="text" aria-label={item.statement.replace(/█████/g, "Partei")}>
            <span aria-hidden="true">{'„' + item.statement + '“'}</span>
          </p>
          <div className="source">{item.source} - {item.context}</div>

          <div id="options" className={[selected ? "selected" : "", joystick ? "joystick" : ""].join(" ")}>
            {parties.map(
              (partei, index) => (
                <Option key={index} partei={partei} answer={item.answer} onSelect={this.compare(partei)} />
              )
            )}
          </div>
          <Result item={item} correct={correct} selected={selected} onNext={this.handleNext.bind(this)} />
          <label >
            <button onClick={function () { this.settings.current.show() }.bind(this)}></button>
            Settings
          </label>
        </>
      );
    } else {
      return <BarLoader css={BarLoader_CSS} sizeUnit={"px"} size={4000} color={"#414242"} />;
    }
  }
}

export default windowSize(Main);
