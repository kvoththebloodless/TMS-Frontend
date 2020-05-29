import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import _ from "lodash"
import Story from "./Story"
var context = typeof window === "undefined" ? global : window;
export default class Canvass extends Component {
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
    ,clip:[]}
  }
  
  onParsedChange=(data)=>{
    console.log(data)
    this.setState({"animchardata":data})

    fetch('http://localhost:5000/action', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      "Content-Length":JSON.stringify(data).length.toString()
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(result=>
    {console.log(result)
      let clipjson=result["animations"][0]["anim_"+result["animations"][0]["roles"]["Agent"]]
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
     this.setState({clip:[...this.state.clip,clip]},(data)=>{
      this.startAnimation(this.mesh,this.state.clip,clipjson["name"])
     
     })
     
    }
    )

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
    finalanim["name"] = name;
    animations.push(finalanim);
 
    return animations;
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
   
console.log(gltf.scene) 
this.scene.add( gltf.scene );
let tempanimations=gltf.animations
this.mesh=gltf.scene.getObjectByName("Sticky")
////


// let sendanim=[]
// for(let i=0;i<tempanimations.length;i++)
// { let animationClip={}
// animationClip["name"]=tempanimations[i]["name"]
// animationClip["duration"]=tempanimations[i]["duration"]
// animationClip["tracks"]=[]
// animationClip["bio"]="Person"
// animationClip["type"]="simple"
// for(let j=0;j<tempanimations[i]["tracks"].length;j++)
// {
// let track={}
// track["interpolant"]="linear"
// track["name"]=tempanimations[i]["tracks"][j]["name"]
// track["times"]=JSON.stringify(tempanimations[i]["tracks"][j]["times"],function( key, value ){
//  // the replacer function is looking for some typed arrays.
//  // If found, it replaces it by a trio
//  if ( 
//       value instanceof Float32Array         )
//  {
//    var replacement = {
//      constructor: value.constructor.name,
//      data: Array.apply([], value),
//      flag: "FLAG_TYPED_ARRAY"
//    }
//    return replacement;
//  }
//  return value;
// })

// track["values"]=JSON.stringify(tempanimations[i]["tracks"][j]["values"],function( key, value ){
//  // the replacer function is looking for some typed arrays.
//  // If found, it replaces it by a trio
//  if ( 
//       value instanceof Float32Array           )
//  {
//    var replacement = {
//      constructor: value.constructor.name,
//      data: Array.apply([], value),
//      flag: "FLAG_TYPED_ARRAY"
//    }
//    return replacement;
//  }
//  return value;
// })

// animationClip["tracks"].push(track)
// }
// sendanim.push(animationClip)
// }

// for(let i=0;i<sendanim.length;i++)
// { let options={}
// fetch('http://localhost:5000/dump', {
// method: 'POST', // or 'PUT'
// headers: {
//  'Content-Type': 'application/json',
//  "Content-Length":JSON.stringify(sendanim[i]).length.toString()
// },
// body: JSON.stringify(sendanim[i]),
// })
// .then(response => response.json())
// .then(result=>console.log(result))
// }


//fetch simple animations
  // fetch('http://localhost:5000/sampleanim?bio=Person')
  // .then(response => response.json())
  // .then(sendanim=>{
  //   console.log(sendanim)
  //   let  newanim=[]
  //   for (let k=0;k<sendanim.length;k++)
  //   {
  //    let clipjson=sendanim[k]
  //    let trackarr=[]
  //    for(let i=0;i<clipjson["tracks"].length;i++)
  //    {let temp=clipjson["tracks"][i]
  //     let values=JSON.parse(temp["values"],function( key, value ){
  //       // the reviver function looks for the typed array flag
  //       try{
  //         if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
  //           // if found, we convert it back to a typed array
  //           return new context[ value.constructor ]( value.data );
  //         }
  //       }catch(e){}
        
  //       // if flag not found no conversion is done
  //       return value;
  //     })
  //     let times=JSON.parse(temp["times"],function( key, value ){
  //       // the reviver function looks for the typed array flag
  //       try{
  //         if( "flag" in value && value.flag === "FLAG_TYPED_ARRAY"){
  //           // if found, we convert it back to a typed array
  //           return new context[ value.constructor ]( value.data );
  //         }
  //       }catch(e){}
        
  //       // if flag not found no conversion is done
  //       return value;
  //     })
  //      let track=new THREE.KeyframeTrack(temp["name"],times,values,THREE.InterpolateLinear)
  //       trackarr.push(track)
  //    }
  //    let  clip=new THREE.AnimationClip(clipjson["name"],clipjson["duration"],trackarr)
  //    newanim.push(clip)
  //   }
    
    // console.log(newanim)
    
    ////
//     console.log(tempanimations)
//     let pose = this.tempBlendAnimation([tempanimations[10],tempanimations[0],tempanimations[11],tempanimations[3]],"pose")[4];
    
//     let bow=this.tempBlendAnimation([tempanimations[2],tempanimations[9]],"bow")[2];

//     let shrug=this.tempBlendAnimation([tempanimations[6],tempanimations[11],tempanimations[3]],"shrug")[3];

//     let wave=this.tempBlendAnimation([tempanimations[6]],"wave")[1];

  

//      tempanimations=[pose,bow,shrug,wave]
//      let sendanim=[]
// for(let i=0;i<tempanimations.length;i++)
// { let animationClip={}
//   animationClip["name"]=tempanimations[i]["name"]
//   animationClip["duration"]=tempanimations[i]["duration"]
//   animationClip["tracks"]=[]
//   animationClip["bio"]="Person"
//   animationClip["type"]="simple"
//   for(let j=0;j<tempanimations[i]["tracks"].length;j++)
//   {
//     let track={}
//     track["interpolant"]="linear"
//     track["name"]=tempanimations[i]["tracks"][j]["name"]
//     track["times"]=JSON.stringify(tempanimations[i]["tracks"][j]["times"],function( key, value ){
//       // the replacer function is looking for some typed arrays.
//       // If found, it replaces it by a trio
//       if ( 
//            value instanceof Float32Array         )
//       {
//         var replacement = {
//           constructor: value.constructor.name,
//           data: Array.apply([], value),
//           flag: "FLAG_TYPED_ARRAY"
//         }
//         return replacement;
//       }
//       return value;
//     })
  
//     track["values"]=JSON.stringify(tempanimations[i]["tracks"][j]["values"],function( key, value ){
//       // the replacer function is looking for some typed arrays.
//       // If found, it replaces it by a trio
//       if ( 
//            value instanceof Float32Array           )
//       {
//         var replacement = {
//           constructor: value.constructor.name,
//           data: Array.apply([], value),
//           flag: "FLAG_TYPED_ARRAY"
//         }
//         return replacement;
//       }
//       return value;
//     })
  
//     animationClip["tracks"].push(track)
//   }
//   sendanim.push(animationClip)
// }

// for(let i=0;i<sendanim.length;i++)
// { let options={}
//   fetch('http://localhost:5000/dump', {
//     method: 'POST', // or 'PUT'
//     headers: {
//       'Content-Type': 'application/json',
//       "Content-Length":JSON.stringify(sendanim[i]).length.toString()
//     },
//     body: JSON.stringify(sendanim[i]),
//   })
//   .then(response => response.json())
//   .then(result=>console.log(result))
// }
    // })
  // }
  // )




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
    this.mixer = new THREE.AnimationMixer(skinnedMesh);
 
    var clip = THREE.AnimationClip.findByName(animations, animationName);
    
    if (clip) {
      var action = this.mixer.clipAction(clip);
      action.setLoop( THREE.LoopOnce)
      
  action.clampWhenFinished = true
  action.enable = true
      action.play();
    }
    // context=this
    // this.mixer.addEventListener('finished',function(e) { 
   
    //   // var action = context.mixer.clipAction(clip);
    //   // action.paused = false;
    //   // action.setLoop(THREE.LoopOnce);      
    //   // action.timeScale = -1;
    //   // context.mixer.removeEventListener('finished')
    //   // action.play();
     
    //  });
    
   
  }
  
  componentDidMount() {
    this.camera=new THREE.PerspectiveCamera( 45, this.mount.clientWidth/this.mount.clientHeight, 0.01, 100 );
    this.scene.background = new THREE.Color("#fdfdfd");
    this.renderer.setSize( this.mount.clientWidth, this.mount.clientHeight );
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
  }
  render() {
    return (
        <div>
        <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - webgl - canvas as a texture
        <div>click and draw in the white box</div>
    </div>
    <canvas id="drawing-canvas" height="128" width="128"></canvas>

      <div ref={ref => (this.mount = ref) } className="canvas"/>
     
      </div>
    )
  }
}

