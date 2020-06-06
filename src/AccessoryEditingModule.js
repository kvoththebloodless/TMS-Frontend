import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import _ from "lodash"
import DragControls from 'three-dragcontrols';
var context = typeof window === "undefined" ? global : window;
export default class AccessoryEditor extends Component {
  constructor(props){
    super(props)
    this.animate=this.animate.bind(this)
    this.camera= null
    this.renderer=new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.clock= new THREE.Clock();
    this.mixer=null
    this.mesh=null
    this.material=null
    this.paint=false
    this.drawStartPos=null
    this.drawingContext=null
    this.stickymesh=null
    this.state={animchardata:undefined
    ,clip:[]}
  }
  
  animate() {
    
    requestAnimationFrame(this.animate);
  
    
    this.renderer.render(this.scene, this.camera);
  }
   
  setupDrawingCanvas=()=>{

    this.drawStartPos=new THREE.Vector2()
      // get canvas and context
    
      var drawingCanvas = this.drawingmount;
   
      var drawingContext = drawingCanvas.getContext( '2d' );
  
      // draw white background

      
      
      this.drawingContext=drawingContext
      // set canvas as material.map (this could be done to any map, bump, displacement etc.)

      this.material.map = new THREE.CanvasTexture( drawingCanvas );
      
      // set the variable to keep track of when to draw

  }
  gltfLoader=(gltf)=>
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
// let tempanimations=gltf.animations
this.stickymesh=gltf.scene.getObjectByName("Sticky")

this.stickymesh.scale=200

  }
  componentDidMount() {
    this.camera=new THREE.PerspectiveCamera( 50, this.mount.clientWidth/this.mount.clientHeight, 1, 1000 );
    this.camera.position.z = 10;
    this.scene.background = new THREE.Color("#ffffff");
    this.renderer.setSize( this.mount.clientWidth, this.mount.clientHeight );
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    this.scene.add(light);
    this.mount.appendChild( this.renderer.domElement );
    this.material = new THREE.MeshBasicMaterial( {  
     transparent:true,
      side: THREE.DoubleSide
     });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2), this.material );
    this.mesh.position.z=2
    this.scene.add(this.mesh)
    const dragControls = new DragControls([this.mesh], this.camera,this.renderer.domElement);
    // dragControls.addEventListener( 'dragstart', function ( event ) {

    //  console.log("hehe")
    
    // } );
    
    // dragControls.addEventListener( 'dragend', function ( event ) {
    
    //  console.log("heheh")
    
    // } );
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
    console.log(this.scene)
    this.setupDrawingCanvas()
    const loader = new GLTFLoader();
    loader.load(filePath,this.gltfLoader );
    this.animate(this.mixer);
   
  }
   draw =(drawingContext,  x, y )=> {
    console.log("came",x,y)
    this.drawingContext.moveTo( this.drawStartPos.x, this.drawStartPos.y );
    this.drawingContext.lineWidth = 10;
    this.drawingContext.strokeStyle = '#FFFF00';
    this.drawingContext.lineTo( x, y );
    this.drawingContext.stroke();
    // reset drawing start position to current position.
    this.drawStartPos.set( x, y );
    // need to flag the map as needing updating.
    this.material.map.needsUpdate = true;

  }

  mouseDownEvent =(e)=>{
    
    this.paint=true
    console.log(e.offsetX,"huh")
    var xoffset = this.drawingContext.offsetX
    var yoffset=this.drawingContext.offsetY
    this.drawStartPos.set(e.nativeEvent.offsetX,e.nativeEvent.offsetY)

  }
  mouseMoveEvent =(e)=>{
    var xoffset = this.drawingContext.offsetX
    var yoffset=this.drawingContext.offsetY
    if ( this.paint ) this.draw( this.drawingContext,  e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  }
  mouseUpEvent =(e)=>{	this.paint = false;}
  mouseLeaveEvent =(e)=>{this.paint=false;}
  render() {
    return (
        <>
          <canvas ref={ref=>(this.drawingmount=ref)}  onMouseDown={this.mouseDownEvent} onMouseMove={this.mouseMoveEvent} onMouseUp={this.mouseUpEvent} onMouseLeave={this.mouseLeaveEvent} className="drawingcanvasbackground"></canvas>
            <div ref={ref => (this.mount = ref) } className="canvas"/>
    


     
      </>
    )
  }
}

