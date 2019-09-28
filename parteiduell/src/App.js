import React, { Component } from 'react';

class Fragen extends Component {

  constructor(props) {
  super(props);
  this.state = {
    isLoaded: false,
    err: null,
    items: [],
    korrekt : null,
    parties: []
  };
}
componentDidMount() {
  document.addEventListener("keydown", this.handleKeyDown.bind(this));
  this.setState({
    items: this.fetchItem()
  });
}
compare(partei){
  return () => {
    if(partei === this.state.items[0].answer){
      this.setState({
        korrekt: true
      })
    }else{
      this.setState({
        korrekt: false
      })
    }
  }
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
handleNext(){
  this.setState({
    korrekt: null,
    items: this.fetchItem(),
    isLoaded: false
  })
}

fetchItem(){
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

renderResult(){
  const { items, korrekt } = this.state;
  if(korrekt != null){
    if(korrekt){
      return(
        <div>
        <p>RICHTIG </p>
        <button onClick={this.handleNext.bind(this)}> Nächste Frage </button>
        </div>
      )
    }else{
      return(
        <div>
      <p> Falsch, diese Aussage war von {items[0].answer} </p>
      <button onClick={this.handleNext.bind(this)}> Nächste Frage </button>
      </div>
    )
  }
}
}

  render(){
    const { err, isLoaded, items } = this.state;
    console.log(parties);
    if(isLoaded){
      var parties = Object.keys(items[0].possibleAnswers);
      return(
        <div>
        <h2> ParteiDuell </h2>
            {items.map(
           item => (
           <div>
             <h2> {item.these} </h2>
              <h3> {item.statement} </h3>
              {parties.map(
                partei => (
                  <button onClick={this.compare(partei)}> {partei} </button>
                )
              )}


            </div>
          ))}
            {this.renderResult()}
          </div>
      );
  }else{
    return(
    <p> WAITING </p>
  );
  }
}


  }

export default Fragen;
