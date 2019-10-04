import React, { Component } from 'react';
import { Settings } from 'react-bytesize-icons';
import Main from "./Main"
class App extends Component {
  constructor() {
    super()
    this.main = React.createRef();
  }

  showSettings() {
    this.main.current.wrappedInstance.settings.current.show()
  }

  render() {
    return (
      <>
        <div className="content">
          <div className="header">
            <div className="container">
              <h1 className="title">ParteiDuell</h1>
            </div>
            <label >
              <button onClick={this.showSettings.bind(this)}></button>
              <Settings width="20" height="20" className="settings-icon" strokeWidth="4%" />
            </label>
          </div>
          <div className="container" role="main">
            <Main ref={this.main} />
          </div>
        </div>
        <div className="footer">
          <div>
            Mit ❤&#xFE0E; beim JHFFM19 erstellt.
          </div>
          <a href="https://www.github.com/jugendhackt/parteiduell-frontend">
            <img className="github" role="link" aria-label="GitHub" src="/github.png" alt="GitHub" />
          </a>
          <img src="/logo.png" alt="Logo" aria-hidden="true" />
        </div>
      </>
    )

  }
}

export default App;
