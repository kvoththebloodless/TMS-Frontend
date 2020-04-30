import React, { Component } from "react";
import * as THREE from "three";
import "./App.css";
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
export default class AnimationEditModule extends Component {
constructor(props){
    super(props)
    this.state={
        actionselection:10,
        characterselection:20,
        sampleanim:[],
        actionselectdata:[],
        characterselectdata:[],
    }
}

componentDidMount()
{
    let animCharData=this.props.animCharDict
    var context = typeof window === "undefined" ? global : window;
    fetch('http://localhost:5000/sampleanim?bio=Person')
    .then(response => response.json())
    .then(sendanim=>{
      let  newanim=[]
      for (let k=0;k<sendanim.length;k++)
      {
       let clipjson=sendanim[k]
       let trackarr=[]
       for(let i=0;i<clipjson["tracks"].length;i++)
       {let temp=clipjson["tracks"][i]
        let values=JSON.parse(temp["values"],function( key, value ){
          // the reviver function looks for the typed array flag
          try{
            if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
              // if found, we convert it back to a typed array
              return new context[ value.constructor ]( value.data );
            }
          }catch(e){}
          
          // if flag not found no conversion is done
          return value;
        })
        let times=JSON.parse(temp["times"],function( key, value ){
          // the reviver function looks for the typed array flag
          try{
            if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
              // if found, we convert it back to a typed array
              return new context[ value.constructor ]( value.data );
            }
          }catch(e){}
          
          // if flag not found no conversion is done
          return value;
        })
         let track=new THREE.KeyframeTrack(temp["name"],times,values,THREE.InterpolateLinear)
          trackarr.push(track)
       }
       let  clip=new THREE.AnimationClip(clipjson["name"],clipjson["duration"],trackarr)
       newanim.push(clip)
      }
      this.setState({sampleanim:newanim})
    }
      

      ////
      
    //   let animations = this.tempBlendAnimation([newanim[9],newanim[3]]
    //   );
    //   let mesh = this.scene.getObjectByName("Sticky");
    //   console.log(mesh)
    //   this.mixer = this.startAnimation(mesh, animations, "walkingHand");
    //   })
  
    )
 
}

handleChangeToAction = (event) => {

    let animations=this.props.animCharData["animations"]
    let listofoptions=[]
    for(let i=0;i<animations.length;i++)
    {
        for (let j=0;j<animations[i]["roles"].length;j++)
        {
            listofoptions.push(animations[i]["roles"][j][0])
        }
    }
    this.setState({characterselectdata:listofoptions});
  };
  handleChangeToCharacter = (event) => {
    console.log({characterselection:event.target.value});
  };
   
  render() {

    return (
        <div>
            <div className="toolbar">
            <p >Teach me how to move</p>
            </div>
            
            <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          className="selectaction"
          value={this.state.actionselection}
          onChange={this.handleChangeToAction}
      
        >
          <MenuItem value={10}>Tencffffffffff</MenuItem>
          <MenuItem value={20}>Twentyffffffff</MenuItem>
          <MenuItem value={30}>Thirtffffffffffy</MenuItem>
        </Select>
      

        <Select
         className="selectcharacter"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={this.state.characterselection}
          onChange={this.handleChangeToCharacter}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        </div>


    )
  }
}

