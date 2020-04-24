import React, { Component } from "react";
import * as THREE from "three";
import "./App.css";
import Input from '@material-ui/core/Input';
export default class Story extends Component {
constructor(props){
    super(props)
    this.keyPress = this.keyPress.bind(this);
    this.state={sentence:[]}
}
keyPress(e){
    console.log(this.state.sentence)
    if(e.keyCode == 13){
    
     
      this.setState({sentence:[...this.state.sentence,e.target.value]})  
     
    }
 }

  
  render() {

    let listofprev=this.state.sentence.map((element,index) => {
         return <Input value={element} key={index} inputProps={{ 'aria-label': 'description' }} style={{width:"75%",fontFamily:"TMSFont",fontSize:"2em",marginLeft:"5%",color:"white"} }onKeyDown={this.keyPress} disabled={true}/>
     })
      
    return (
    
    <div className="story">
     
        {listofprev}
      
       <Input defaultValue="Write your story here..." inputProps={{ 'aria-label': 'description' }} style={{width:"75%",fontFamily:"TMSFont",fontSize:"2em",marginLeft:"5%",color:"white"} }onKeyDown={this.keyPress}/>

      </div>
     
    )
  }
}

