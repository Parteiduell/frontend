import React, { Component } from "react";
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class Startscreen extends Component {
    start() {
        cookies.set("completed-startscreen", "true", { path: '/', maxAge: 60 * 60 * 24 * 30 * 3 });
        this.forceUpdate();
    }
    render() {
        var alreadUsed = cookies.get("completed-startscreen");

        if (alreadUsed !== "true") {
            return (
                <div className="overlay">
                    <div className="startscreen">
                        <h2>Willkommen bei Parteiduell!</h2>
                        <p>
                            Als Teil des "Jugend hackt"-Workshops in Frankfurt am Main haben wir ein Quiz erstellt, welches Spielenden die Möglichkeit gibt politische Aussage einer Partei zuzuordnen.
                        </p>
                        <p>Wir wollen Menschen unterhaltsam über Politik informieren und die Position der Parteien aufzeigen.</p>
                        <p>Sie werden immer zuerst eine Frage oder These des Wahl-o-Mats sehen. Darunter sehen Sie die Stellungnahme einer Partei. Doch welcher? Das können Sie nun erraten.</p>
                        <p>Viel Spaß!</p>
                        <label className="next">
                            <button onClick={this.start.bind(this)}></button>
                            Starten
                        </label>
                    </div>
                </div>
            )
        }
        return null
    }

}

export default Startscreen;
