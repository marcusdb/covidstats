import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import CovidCountryComponent from "./covid/components/covidCountryComponent";

function App() {
    return (
        <Router>
            <div className="App">
                <CovidCountryComponent />
            </div>
        </Router>
    );
}

export default App;
