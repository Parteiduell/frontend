import React, { Component } from "react";

class Footer extends Component {
  constructor() {
    super();
    this.main = React.createRef();
  }
  render() {
    return (
      <>
        <div className="footer">
          <div>Mit ❤&#xFE0E; beim JHFFM19 erstellt.</div>
          <a href="https://github.com/Parteiduell" target="_blank" rel="noopener noreferrer">
            <img className="github" role="link" aria-label="GitHub" src="/github.png" alt="GitHub" />
          </a>
          <img src="/logo.png" alt="Logo" aria-hidden="true" />
          <a href="https://status.parteiduell.de" target="_blank" rel="noopener noreferrer" aria-label="Statusseite">
            Status
          </a>
          <a href="/Impressum.html" aria-label="Impressum">
            Impressum
          </a>
          <a href="/Datenschutzerklärung.html" aria-label="Datenschutzerklärung">
            Datenschutzerklärung
          </a>
        </div>
      </>
    );
  }
}

export default Footer;
