import './App.css';
import axios from "axios";
import React, {useState} from "react";
import { Helmet } from 'react-helmet';
import Player from "./components/player/Player";
import FilmsList from "./elements/FilmsList/FilmsList";
import RoutesComponent from "./routes/routes";


function App() {
  return (
    <div className="App">
      <RoutesComponent />
    </div>
  );
}

export default App;
