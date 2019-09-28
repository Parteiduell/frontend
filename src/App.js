import React, { Component } from 'react';
import "./App.css";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context("./pictures/", false, /\.(png|jpe?g|svg)$/));

class Fragen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      err: null,
      items: [],
      korrekt: null,
      parties: [],
      selected: null
    };
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    this.setState({
      items: this.fetchItem()
    });
    console.log(images);
  }
  compare(partei) {
    return () => {
      if (partei === this.state.items[0].answer) {
        this.setState({
          korrekt: true,
          selected: partei
        })
      } else {
        this.setState({
          korrekt: false,
          selected: partei
        })
      }
    }
  }
  getImage(partei) {
    for (var image of images) {
      if (image.includes(partei.toLowerCase().replace("/", "-"))) {
        return image;
      }
    }
    console.error("Kein passendes Bild gefunden!", partei);
  }
  handleKeyDown(e) {
    if (e.key === "ArrowUp") {
      this.compare(this.state.items[0].parteien[0])();
    } else if (e.key === "ArrowLeft") {
      this.compare(this.state.items[0].parteien[1])();
    } else if (e.key === "ArrowDown") {
      this.compare(this.state.items[0].parteien[2])();
    } else if (e.key === "ArrowRight") {
      this.compare(this.state.items[0].parteien[3])();
    }
  }
  handleNext() {
    this.setState({
      korrekt: null,
      items: this.fetchItem(),
      isLoaded: false
    })
  }

  fetchItem() {
    fetch("https://solver.cloud:440/list") // fetch from REMOTE!
      .then(result => result.json())
      .then((res) => {
        this.setState({
          isLoaded: true,
          items: res,
        });
        return res;
      },
        (error) => { //was passiert, wenn das ganze falsch läuft ???
          this.setState({
            isLoaded: false,
            error
          });
          console.log(this.state);
          console.log("AHHH");
        })
  }

  renderResult() {
    const { items, korrekt, selected } = this.state;
    console.log(items);
    if (korrekt != null) {
      if (korrekt) {
        return (
          <div>
            <p>RICHTIG </p>
            <button onClick={this.handleNext.bind(this)}> Nächste Frage </button>
          </div>
        )
      } else {
        return (
          <div>
            <p> Falsch, diese Aussage war von {items[0].answer} </p>
            <p> Die Partei "{selected}" hat folgendes Statement abgegeben:</p>
            <p><small>{items[0].possibleAnswers[selected]}</small></p>
            <button onClick={this.handleNext.bind(this)}> Nächste Frage </button>
          </div>
        )
      }
    }
  }

  render() {
    const { err, isLoaded, items, selected } = this.state;
    if (isLoaded) {
      var parties = Object.keys(items[0].possibleAnswers);
      return (
        <div>
          {items.map(
            item => (
              <div>
                <h3 class="these"> {item.these} </h3>
                <h2 class="statement"> {item.statement} </h2>
                <div id="optionen">
                  {parties.map(
                    partei => (
                      <div>
                        <label class="parteien" >
                          <img src={this.getImage(partei)} alt={partei} class={"selected" ? partei === selected : ""} />
                          <button onClick={this.compare(partei)}> {partei} </button>
                        </label>
                      </div>
                    )
                  )}
                </div>


              </div>
            ))}
          {this.renderResult()}
        </div>
      );
    } else {
      return (
        <p> WAITING </p>
      );
    }
  }


}

export default Fragen;
