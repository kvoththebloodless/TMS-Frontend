import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import _ from "lodash"
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
    
  }
 
tempBlendAnimation(animations) {
    let finalanim = _.cloneDeep(animations[0]);
    for (let i = 1; i < animations.length; i++) {
      let anim = animations[i];
      let bone = anim["name"].split("_")[0];
      console.log(bone);
      for (let j = 0; j < anim["tracks"].length; j++) {
        let track = anim["tracks"][j];
        if (track["name"].startsWith(bone)) {
          finalanim["tracks"][j] = _.cloneDeep(track);
          finalanim["tracks"][j]["change"] = "True";
        }
      }
    }
    finalanim["name"] = "walkingHand";
    animations.push(finalanim);
    console.log(animations)
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
   
 
this.scene.add( gltf.scene );
let animations = this.tempBlendAnimation([gltf.animations[9],gltf.animations[2]]
);
let mesh = this.scene.getObjectByName("Sticky");
console.log(mesh)
this.mixer = this.startAnimation(mesh, animations, "walkingHand");



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
    var mixer = new THREE.AnimationMixer(skinnedMesh);
 
    var clip = THREE.AnimationClip.findByName(animations, animationName);
    
    if (clip) {
      var action = mixer.clipAction(clip);
      action.setLoop( THREE.LoopOnce)
      
  action.clampWhenFinished = true
  action.enable = true
      action.play();
    }
    mixer.addEventListener('finished',function(e) { 
   
      // var action = mixer.clipAction(clip);
      // action.paused = false;
      // action.setLoop(THREE.LoopOnce);      
      // action.timeScale = -1;
      // mixer.removeEventListener('finished')
      // action.play();
     
     });
    
    return mixer;
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
      <div ref={ref => (this.mount = ref) } className="canvas"/>
    )
  }
}

