import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import _ from "lodash"
import Story from "./Story"
import EditorModule from "./EditorModule";
var context = typeof window === "undefined" ? global : window;
export default class AnimationEditModule extends Component {
  constructor(props){
    super(props)
    this.startAnimation=this.startAnimation.bind(this)
    this.tempBlendAnimation=this.tempBlendAnimation.bind(this)
    this.animate=this.animate.bind(this)
    this.gltfLoader=this.gltfLoader.bind(this)
    this.camera= null
    this.renderer=new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.clock= new THREE.Clock();
    this.mixer=null
    this.mesh=null
    this.state={animchardata:undefined
    ,clip:[],
  sampleclips:[]}
  }
  
  findByName=(name)=>{
   let anims=this.state.sampleclips
    for(let i=0;i<anims.length;i++)
    {
      if(anims[i].name===name)
      {return anims[i]}
    }
  }
  onChange=(sequences)=>{
if(sequences&&sequences.length!=0)
{
    this.mixer.stopAllAction()
    let animlist=[]
    for(let i=0;i<sequences.length;i++)
    {
      let blendlist=[]
      for(let j=0;j<sequences[i].cards.length;j++)
      {
       let clip=this.findByName(sequences[i].cards[j].title)
       blendlist.push(clip)
      }
      animlist.push(this.tempBlendAnimation(blendlist,"anim_"+new Date().getTime()))
    }
    console.log(animlist.length)
    animlist.forEach(element => {
    if (element)  
     
      setTimeout(()=>{ this.startAnimation(this.mesh,animlist,element.name)},1000)
    });
    // console.log(data)
    //   let clipjson=result["animations"][0]["anim_"+result["animations"][0]["roles"]["Agent"]]
    //  let trackarr=[]
    //  for(let i=0;i<clipjson["tracks"].length;i++)
    //  {let temp=clipjson["tracks"][i]
    //   let values=JSON.parse(temp["values"],function( key, value ){
    //     // the reviver function looks for the typed array flag
    //     try{
    //       if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
    //         // if found, we convert it back to a typed array
    //         return new context[ value.constructor ]( value.data );
    //       }
    //     }catch(e){}
        
    //     // if flag not found no conversion is done
    //     return value;
    //   })
    //   let times=JSON.parse(temp["times"],function( key, value ){
    //     // the reviver function looks for the typed array flag
    //     try{
    //       if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
    //         // if found, we convert it back to a typed array
    //         return new context[ value.constructor ]( value.data );
    //       }
    //     }catch(e){}
        
    //     // if flag not found no conversion is done
    //     return value;
    //   })
    //    let track=new THREE.KeyframeTrack(temp["name"],times,values,THREE.InterpolateLinear)
    //     trackarr.push(track)
    //  }
    //  let  clip=new THREE.AnimationClip(clipjson["name"],clipjson["duration"],trackarr)
    //  this.setState({clip:[...this.state.clip,clip]},(data)=>{
    //   this.startAnimation(this.mesh,this.state.clip,clipjson["name"])
     
    //  })
     
  }

  }
 
tempBlendAnimation(animations,name) {
    let finalanim = _.cloneDeep(animations[0]);
    for (let i = 1; i < animations.length; i++) {
      let anim = animations[i];
      let bone = anim["name"].split("_")[0];
   
      for (let j = 0; j < anim["tracks"].length; j++) {
        let track = anim["tracks"][j];
        if (track["name"].startsWith(bone)) {
          finalanim["tracks"][j] = _.cloneDeep(track);
          finalanim["tracks"][j]["change"] = "True";
        }
      }
    }

  
    
    if (finalanim){
      finalanim=new THREE.AnimationClip(name,0.5,finalanim["tracks"])
      animations.push(finalanim);}
 
    return finalanim;
  }
    
  gltfLoader(gltf)
  {
    
 gltf.scene.traverse(child => {
  if (child.material) {
  child.material=new THREE.MeshStandardMaterial( {
color: 0x000000, // red
flatShading: true,
 } );
 child.material.skinning = true;
}})

this.scene.add( gltf.scene );
let tempanimations=gltf.animations
this.mesh=gltf.scene.getObjectByName("Sticky")
this.mixer = new THREE.AnimationMixer(this.mesh);
  }

  animate() {
    
    requestAnimationFrame(this.animate);
    
    if (this.mixer) {
      var mixerUpdateDelta = this.clock.getDelta();
      // Update all the animation frames
      this.mixer.update(mixerUpdateDelta);
      
    }
    this.renderer.render(this.scene, this.camera);
  }

 startAnimation(skinnedMesh, animations, animationName) {
   
 
    var clip = THREE.AnimationClip.findByName(animations, animationName);
    
    if (clip) {
      var action = this.mixer.clipAction(clip);
      action.setLoop( THREE.LoopPingPong)
      action.repetitions=2
  action.clampWhenFinished = false
  action.enable = true
      action.play();
    }
   
    
   
  }
  
  componentDidMount() {
    this.camera=new THREE.PerspectiveCamera( 45, this.mount.clientWidth/this.mount.clientHeight, 0.01, 100 );
    this.scene.background = new THREE.Color("#fdfdfd");
    this.renderer.setSize( this.mount.clientWidth/2, this.mount.clientHeight/2 );
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    this.scene.add(light);
    const loader = new GLTFLoader();
    

loader.load(filePath,this.gltfLoader );

// const controls = new OrbitControls(this.camera,this.mount);

    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild( this.renderer.domElement );
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
   
    this.camera.position.set(0, 1, 15);
    // var animate = function () {
    //   requestAnimationFrame( animate );
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
  
    
    // };
    this.animate(this.mixer);

   //fetch simple animations
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
    this.setState({sampleclips:newanim})
  })
  }
  render() {
    return (
      <div className="App">
         <EditorModule className="bigger" onChange={this.onChange} sampleanim={this.state.sampleclips
        }></EditorModule>
      <div ref={ref => (this.mount = ref) } className="canvas"/>
     
      </div>
    )
  }
}

