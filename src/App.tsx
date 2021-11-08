import React from "react";
import "./App.css";
import GameComponent from "./game/GameComponent";

function App() {
    return (
        <div className="App">
            {<GameComponent/>}
            {/*<TestComp />*/}
            {/* <MainMenu />*/}
        </div>
    );
}

export default App;
