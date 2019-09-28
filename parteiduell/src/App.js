import React, { Component } from 'react';

class Fragen extends Component {

  constructor(props) {
  super(props);
  this.state = {
    isLoaded: false,
    err: null,
    items: [],
    korrekt : null,

  };
}
componentDidMount() {
  this.setState({
    items: this.fetchItem()
  })
}
compare(partei){
  return () => {
    if(partei === this.state.items[0].antwort){
      this.setState({
        korrekt: true
      })
    }else{
      this.setState({
        korrekt: false
      })
    }
  };
}

handleNext(){
  this.setState({
    korrekt: null,
    items: this.fetchItem(),
    isLoaded: false
  })
}

fetchItem(){
  this.setState({
    isLoaded: true,
  });
  return ([{thema: "Umwelt", frage: "Sollte Deutschland mehr CO2 einsparen?", parteien: ["CDU", "SPD", "AfD", "LINKE"], antwort: "LINKE", kontext: null }]);
  //
  // fetch("https://pa-clubs.herokuapp.com/database"). // fetch from REMOTE!
  // then(result => result.json())
  //   .then((res) => {
  //     this.setState({
  //       isLoaded: true,
  //     });
  //     return res;
  //   },
  //   (error) => { //was passiert, wenn das ganze falsch läuft ???
  //     this.setState({
  //       isLoaded: false,
  //       error
  //     });
  //     console.log(this.state)
  //   })
}

renderResult(){
  const {items, korrekt } = this.state;
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
      <p> Falsch, diese Aussage war von {items[0].antwort} </p>
      <button onClick={this.handleNext.bind(this)}> Nächste Frage </button>
      </div>
    )
    }
  }
}
  render() {
    const { err, isLoaded, items } = this.state;
    console.log(items);
    return (
      <div>
      <h2> ParteiDuell </h2>
          {items.map(
         item =>
         <div>
           <h2> {item.thema} </h2>
            <h3> {item.frage} </h3>
            {item.parteien.map(
              partei =>
                <button onClick={this.compare(partei)}> {partei} </button>
            )}
          </div>
        )}
          {this.renderResult()}
        </div>
    );
  }
}

export default Fragen;
