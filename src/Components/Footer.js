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
          <div>
            Mit ❤&#xFE0E; bei{" "}
            <a href="https://jugendhackt.org/event-rueckblick/frankfurt-main-2019/" target="_blank" rel="noopener noreferrer">
              #JHFFM19
            </a>{" "}
            erstellt.
          </div>
          <a href="https://github.com/Parteiduell" target="_blank" rel="noopener noreferrer">
            <img className="github" role="link" aria-label="GitHub" src="/github.png" alt="GitHub" />
          </a>
          <img src="/logo.png" alt="Logo" aria-hidden="true" />
          <a href="https://status.parteiduell.de" target="_blank" rel="noopener noreferrer" aria-label="Statusseite">
            Status
          </a>
          <a href="mailto:hello@parteiduell.de" target="_blank" rel="noopener noreferrer" aria-label="Kontakt">
            Kontakt
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
