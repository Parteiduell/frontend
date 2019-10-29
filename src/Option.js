import React, { Component } from "react";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context("./pictures/", false, /\.(svg)$/));

// Get icon from party name
function getImage(partei) {
  for (const image of images) {
    if (image.includes(partei.toLowerCase().replace("/", "-"))) {
      return image;
    }
  }
  console.error("Kein passendes Bild gefunden!", partei);
}

class Option extends Component {
  render() {
    const { partei, answer } = this.props;
    return (
      <label className="logos">
        <img
          role={"button"}
          src={getImage(partei)}
          aria-label={partei}
          alt={partei}
          className={partei === answer ? "right" : "wrong"}
        />
        <button onClick={this.props.onSelect}></button>
      </label>
    );
  }
}

export default Option;
