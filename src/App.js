import React, { Component } from "react";
import { Settings as SettingsIcon } from "react-bytesize-icons";
import Footer from "./Components/Footer";
import Main from "./Main";

class App extends Component {
  constructor(props) {
    super(props);
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
              <SettingsIcon width="20" height="20" className="settings-icon" strokeWidth="4%" />
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
