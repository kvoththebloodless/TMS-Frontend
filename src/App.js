import React, { Component } from "react";
import Canvass from "./Canvass" 
import Story from "./Story"
import "./App.css";
import AnimationEditModule from "./AnimationEditModule"
import AccessoryEditor from "./AccessoryEditingModule"
export default class App extends Component {

  constructor(props)
  {super(props)
    this.state={animchardata:undefined}
  }
 
  render() {
    return (
    
   
      <AccessoryEditor></AccessoryEditor>
     
     
    )
  }
}

