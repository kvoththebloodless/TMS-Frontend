import React, { Component } from "react";
import Canvass from "./Canvass" 
import Story from "./Story"
import ReactDOM from "react-dom";
import * as THREE from "three";
import "./App.css";
export default class App extends Component {

  
  render() {
    return (
    
    <div className="App">
      <Story></Story>
      <Canvass></Canvass>
      </div>
     
    )
  }
}

