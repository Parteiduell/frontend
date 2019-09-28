import React, { Component } from 'react';
import "./App.css";
import Confetti from 'react-confetti';

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
      selected: null,
      score: 0
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
    console.log(this.state.items[0])
    if (e.key === "ArrowUp") {
      this.compare(this.state.items[0].possibleParties[0])();
    } else if (e.key === "ArrowLeft") {
      this.compare(this.state.items[0].possibleParties[1])();
    } else if (e.key === "ArrowDown") {
      this.compare(this.state.items[0].possibleParties[2])();
    } else if (e.key === "ArrowRight") {
      this.compare(this.state.items[0].possibleParties[3])();
    }
  }
  handleNext() {
    this.setState({
      korrekt: null,
      items: this.fetchItem(),
      isLoaded: false,
      selected: null
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
  returnColours(){
    if(this.state.selected === "NPD" || this.state.selected === "AfD"){
      return ['#8B4513'];
    }else{
      return ['#f44336','#e91e63','#9c27b0','#673ab7','#3f51b5','#2196f3','#03a9f4','#00bcd4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFEB3B','#FFC107','#FF9800','#FF5722','#795548'];
    }
  }

  renderResult() {
    const { items, korrekt, selected } = this.state;
    console.log(items);
    if (korrekt != null) {
      if (korrekt) {
        return (
          <div>
            <p id="antwort">Richtig!</p>
            <Confetti
            recycle = {false}
            gravity  = {0.2}
            numberOfPieces = {400}
            colors = {this.returnColours()}
            />
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
    const { isLoaded, items, selected } = this.state;
    if (isLoaded) {
      var parties = Object.keys(items[0].possibleAnswers);
      return (
        <div>
          {items.map(
            item => (
              <div>
                <h3 class="these"> {item.these} </h3>
                <h2 class="statement"> {item.statement} </h2>
                <div class="source">{item.source} - {item.context}</div>
                <div id="optionen">
                  {parties.map(
                    partei => (
                      <div>
                        <label class="parteien" >
                          <img src={this.getImage(partei)} alt={partei} className={partei === selected ? "selected" : ""} />
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
        <p class="error"> Hmm, scheint, als hättest du keine gute Internetverbindung...</p>
      );
    }
  }


}

export default Fragen;
