import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import _ from "lodash"
import DragControls from 'three-dragcontrols';
import { SkinnedMesh, BoxHelper, Box3Helper } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
    this.dragmeshes=[]
    this.raycaster=null;
    this.mouse=null;
    this.boxes=[];
    this.children=null;
  }
  
  animate() {
    
    requestAnimationFrame(this.animate);
    console.log(this.boxes)

    this.raycaster.setFromCamera( this.mouse, this.camera );
 
    let intersects = this.raycaster.intersectObjects( [this.scene],true);
    // console.log(this.mouse)
    if(intersects.length>1)
      console.log(intersects)
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


console.log(this.scene.children)
// let tempanimations=gltf.animations
this.stickymesh=gltf.scene.getObjectByName("Armature001")


// this.dragmeshes.push(this.stickymesh)
const dragControls=new DragControls(this.dragmeshes, this.camera,this.renderer.domElement);
// dragControls.addEventListener('hoveron',function(event){
//   console.log(event)
// })
// this.stickymesh.scale=200

this.children=this.stickymesh.children
for(let k=0;k<this.children.length;k++)
{if(this.children[k] instanceof SkinnedMesh)
 {

  const pos = this.children[k].geometry.boundingBox.getCenter(new THREE.Vector3());

  const dimen=this.children[k].geometry.boundingBox.max-this.children[k].geometry.boundingBox.min
  console.log("dimen",""+dimen)
  const material = new THREE.MeshBasicMaterial( {  
    color: 0xf,wireframe   : true ,
    opacity:0.2

    });
  const b= new THREE.Mesh(new THREE.PlaneGeometry(dimen.x,dimen.y),material );
 
  b.position.copy(pos);
  this.scene.add(b);
  this.boxes.push(b)
 }
}
console.log("scene",this.scene)
this.scene.add( gltf.scene );
this.animate(this.mixer);

  }
  onMouseMove=( event )=> {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
 

  
    
    this.mouse.x = ( event.offsetX / this.mount.clientWidth ) * 2 - 1;
    this.mouse.y = - ( event.offsetY / this.mount.clientHeight) * 2 + 1;
  
  }
  componentDidMount() {
    this.camera=new THREE.PerspectiveCamera( 50, this.mount.clientWidth/this.mount.clientHeight, 1, 1000 );
    this.camera.position.z = 10;
    // var controls = new OrbitControls( this.camera, this.mount );
    this.scene.background = new THREE.Color("#D00000");
    this.renderer.setSize( this.mount.clientWidth, this.mount.clientHeight );
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    this.scene.add(light);
    this.mount.appendChild( this.renderer.domElement );
    this.material = new THREE.MeshBasicMaterial( {  
     transparent:true,
 
     });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry( 2, 1), this.material );

    this.scene.add(this.mesh)
    this.dragmeshes.push(this.mesh)
   
   this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2()

    
    this.renderer.gammaOutput = true;
    this.renderer.gammaFactor = 2.2;
  
    this.setupDrawingCanvas()
    const loader = new GLTFLoader();
    window.addEventListener( 'mousemove', this.onMouseMove, false );
    loader.load(filePath,this.gltfLoader );
    
   
  }
   draw =(drawingContext,  x, y )=> {
    
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

