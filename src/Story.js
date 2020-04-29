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
    if(e.keyCode == 13 && !(e.target.value.trim()==="")){
    
     
      this.setState({sentence:[...this.state.sentence,e.target.value.trim()]})  
     
    }
 }

  
  render() {

    let listofprev=this.state.sentence.map((element,index) => {
         return <Input value={element} key={index} inputProps={{ 'aria-label': 'description' }} style={{width:"75%",fontFamily:"TMSFont",fontSize:"2em",marginLeft:"5%",color:"black"} }onKeyDown={this.keyPress} disabled={true} multiline={true}/>
     })
      
    return (
    
    <div className="story">
     
        {listofprev}
      
       <Input key = {this.state.sentence.length} placeholder="Enter text here" inputProps={{ 'aria-label': 'description',autoFocus:true }} style={{width:"75%",fontFamily:"TMSFont",fontSize:"2em",marginLeft:"5%",color:"black", fontWeight:600} }onKeyDown={this.keyPress} multiline={true}/>

      </div>
     
    )
  }
}

