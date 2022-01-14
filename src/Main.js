import { css } from "@emotion/react";
import React, { Component } from "react";
import { BarLoader } from "react-spinners";
import { API } from "./Api/API";
import "./assets/App.css";
import Option from "./Components/Option";
import Result from "./Components/Result";
import Settings from "./Components/Settings";
import Startscreen from "./Components/Startscreen";
import { findGetParameter } from "./Functions/findGetParameter";
import { FragmentIdentifier } from "./Functions/FragmentIdentifier";

const BarLoaderCSS = css`
  display: block;
  margin: 0 auto;
`;

const api = new API();

const fragmentIdentifier = new FragmentIdentifier(api);

class Main extends Component {
  constructor(props) {
    super(props);
    this.settings = React.createRef();

    this.state = {
      isLoaded: false,
      err: null,
      correct: null,
      selected: null,
      correctAnswered: null,
    };
    api.settings = this.settings;
  }

  componentDidMount() {
    // Specify keydown handler
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Load first question
    if (window.location.hash === "") {
      this.handleNext();
    } else {
      fragmentIdentifier.get().then((item) => {
        this.setState({ isLoaded: true, item });
      });
    }
  }

  // Is the selected party the right one?
  compare(partei) {
    return () => {
      this.setState({
        correct: partei === this.state.item.answer,
        selected: partei,
        correctAnswered: this.state.correctAnswered === null ? (partei === this.state.item.answer ? true : false) : this.state.correctAnswered,
      });
    };
  }

  // Handle keypresses for the joystick
  handleKeyDown(e) {
    if (this.state.selected === null || e.key === "a") {
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
  }

  handleNext() {
    this.setState({
      correct: null,
      isLoaded: false,
      selected: null,
      correctAnswered: null,
    });

    api.get().then((item) => {
      this.setState({ isLoaded: true, item });
    });
  }

  onSettingsClose() {
    this.setState({ items: [] }, () => {
      this.handleNext();
    });
  }

  render() {
    const { isLoaded, item, selected, correct, correctAnswered } = this.state;
    const joystick = findGetParameter("joystick") === "True";

    if (isLoaded) {
      const parties = Object.keys(item.possibleAnswers);

      fragmentIdentifier.set(item);

      return (
        <>
          <Startscreen />
          <Settings ref={this.settings} onClose={this.onSettingsClose.bind(this)} api={api} />
          <p className="these">{item.these}</p>
          <p className="statement quote" aria-label={item.statement.replace(/█████/g, "Partei")}>
            <span aria-hidden="true">{"„" + item.statement + "“"}</span>
          </p>
          <div className="source">
            {item.source} - {item.context}
          </div>
          <div id="options" className={[selected ? "selected" : "", joystick ? "joystick" : ""].join(" ")}>
            {parties.map((partei, index) => (
              <Option key={index} partei={partei} answer={item.answer} onSelect={this.compare(partei)} />
            ))}
          </div>
          <Result correctAnswered={correctAnswered} item={item} correct={correct} selected={selected} onNext={this.handleNext.bind(this)} />
        </>
      );
    } else {
      return (
        <>
          <Startscreen />
          <Settings ref={this.settings} onClose={this.onSettingsClose.bind(this)} />
          <BarLoader css={BarLoaderCSS} sizeUnit={"px"} size={4000} color={"#414242"} />
        </>
      );
    }
  }
}

export default Main;
