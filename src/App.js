import React, { Component } from "react";
import { Settings } from "react-bytesize-icons";
import Main from "./Main";
import Footer from "./Footer";
class App extends Component {
  constructor() {
    super();
    this.main = React.createRef();
  }

  showSettings() {
    this.main.current.settings.current.show();
  }

  render() {
    return (
      <>
        <div className="content">
          <div className="header">
            <div className="container">
              <h1 className="title">
                <a href="/" target="_parent">
                  ParteiDuell
                </a>
              </h1>
            </div>
            <label>
              <button onClick={this.showSettings.bind(this)} />
              <Settings
                width="20"
                height="20"
                className="settings-icon"
                strokeWidth="4%"
              />
            </label>
          </div>
          <div className="container" role="main">
            <Main ref={this.main} />
          </div>
        </div>
        <Footer></Footer>
      </>
    );
  }
}

export default App;
