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
          <a href="https://github.com/Parteiduell">
            <img
              className="github"
              role="link"
              aria-label="GitHub"
              src="/github.png"
              alt="GitHub"
            />
          </a>
          <img src="/logo.png" alt="Logo" aria-hidden="true" />
          <a href="/Impressum.html">Impressum</a>
          <a href="/Datenschutzerklärung.html">Datenschutzerklärung</a>
        </div>
      </>
    );
  }
}

export default Footer;
