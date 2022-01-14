import React, { Component } from "react";

class Startscreen extends Component {
  constructor() {
    super();
    let completedStartscreen = false;
    if (typeof Storage !== "undefined") {
      completedStartscreen = localStorage.getItem("completedStartscreen") === "true" ? true : false;
    }

    this.state = {
      completedStartscreen: completedStartscreen ? completedStartscreen : false,
    };
  }
  start() {
    if (typeof Storage !== "undefined") {
      localStorage.setItem("completedStartscreen", "true");
    }
    this.setState({ completedStartscreen: true });
  }
  render() {
    const { completedStartscreen } = this.state;
    if (completedStartscreen !== true) {
      return (
        <div className="overlay">
          <div className="startscreen">
            <h2>Willkommen bei Parteiduell!</h2>
            <p>
              Als Teil des „Jugend hackt“-Workshops in Frankfurt am Main haben wir ein Quiz erstellt, welches Spielenden die Möglichkeit gibt politische Aussage
              einer Partei zuzuordnen.
            </p>
            <p>Wir wollen Menschen unterhaltsam über Politik informieren und die Position der Parteien aufzeigen.</p>
            <p>
              Sie werden immer zuerst eine Frage oder These des Wahl-o-Mats sehen. Darunter sehen Sie die Stellungnahme einer Partei. Doch welcher? Das können
              Sie nun erraten.
            </p>
            <p>Viel Spaß!</p>
            <label className="next">
              <button onClick={this.start.bind(this)}></button>
              Starten
            </label>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Startscreen;
