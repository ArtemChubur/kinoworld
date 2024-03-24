import './App.css';
import axios from "axios";
import React, {useState} from "react";
import { Helmet } from 'react-helmet';
import Player from "./components/player/Player";
import FilmsList from "./elements/FilmsList/FilmsList";
import RoutesComponent from "./routes/routes";
import Header from "./components/Header/Header";


function App() {
  return (
    <div className="App">
      <Header />
      <RoutesComponent />
    </div>
  );
}

export default App;
