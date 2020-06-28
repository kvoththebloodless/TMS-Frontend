import React, { Component } from "react";
import * as THREE from "three";
import  GLTFLoader from 'three-gltf-loader'
import "./App.css";
import filePath from "../src/testfinal.glb"
import _ from "lodash"
import DragControls from 'three-dragcontrols';
import { SkinnedMesh, BoxHelper, Box3Helper, Vector3 } from "three";
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
    this.boolbeingdragged=false;
    this.parenthighlight=null;
    
  }
  
  animate() {
    
    requestAnimationFrame(this.animate);
    // console.log(this.boxes)


    this.raycaster.setFromCamera( this.mouse, this.camera );
 
    let intersects = this.raycaster.intersectObjects(this.boxes);
    
    if(intersects.length>0 && this.boolbeingdragged)
      { 
        intersects[0].object.material.color.set(0x00ff00);
        // console.log(intersects[0])
        // console.log(this.mesh)
        
        this.parenthighlight=intersects[0].object
      }
      else{
        this.parenthighlight=this.scene
        this.boxes.forEach(element => {
          element.material.color.set(0xff0000)
        });
      }
  
    if (this.mixer) {
      var mixerUpdateDelta = this.clock.getDelta();
      // Update all the animation frames
      this.mixer.update(mixerUpdateDelta);
      
    }
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

    if(child.name==="HeadBox")
    {  
      const textureLoader = new THREE.TextureLoader();

  // Load a texture. See the note in chapter 4 on working locally, or the page
  // https://threejs.org/docs/#manual/introduction/How-to-run-things-locally
  // if you run into problems here
  const texture = textureLoader.load( 'https://cors-anywhere.herokuapp.com/https://thumbs.dreamstime.com/z/cartoon-face-retro-texture-isolated-white-38009723.jpg');
  texture.flipY = false;
  // set the "color space" of the texture
  texture.encoding = THREE.sRGBEncoding;

  // reduce blurring at glancing angles
  texture.anisotropy = 16;

  // create a Standard material using the texture we just loaded as a color map
  child.material = new THREE.MeshStandardMaterial( {
map:texture
  } );
  // material.color.convertSRGBToLinear();
// child.material.map=texture;
// child.material.needsUpdate = true 
 console.log("childdddd",child)
}
else{
  child.material=new THREE.MeshStandardMaterial( {
color: 0x00000,
flatShading: true,
 } );
}
 child.material.skinning = true;

}})

let tempanimations=gltf.animations

// console.log("gltf",gltf)
// let tempanimations=gltf.animations
this.stickymesh=gltf.scene.getObjectByName("Armature001")


// this.dragmeshes.push(this.stickymesh)
const dragControls=new DragControls(this.dragmeshes, this.camera,this.renderer.domElement);

context=this
//drag starts, boolean beingfragged is set to true. the sketched mesh is to be removed from it's current parent
//hierarchy hence detach.
dragControls.addEventListener( 'drag', function ( event ) {

// context.mesh.parent.remove(context.mesh)
// context.scene.attach(context.mesh)
console.log("mesh",context.mesh)
context.boolbeingdragged=true;

} );

//drag ends, boolenbeing dragged is set to false. the sketched mesh is to be added to the this.highlighted parent

dragControls.addEventListener( 'dragend', function ( event ) {
  console.log("parenthighlgight",context.parenthighlight)
  context.parenthighlight.attach(context.mesh)
	context.boolbeingdragged=false;

} );
// dragControls.addEventListener('hoveron',function(event){
//   console.log(event)
// })
// this.stickymesh.scale=200

this.children=this.stickymesh.children
for(let k=0;k<this.children.length;k++)
{if(this.children[k] instanceof SkinnedMesh)
 {
 
 let dimen=new THREE.Vector3().subVectors(this.children[k].geometry.boundingBox.max,this.children[k].geometry.boundingBox.min);

  let pos = this.children[k].geometry.boundingBox.getCenter(new THREE.Vector3());
        let b = new THREE.Mesh(
          new THREE.PlaneGeometry(dimen.x,dimen.y),
          new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity:0.2,
            transparent:true,
          })
        );
        b.name=this.children[k].name+"Prop"
        b.position.copy(pos);
        let bonetoattachto= this.stickymesh.getObjectByName(this.children[k].name.split("Box")[0]+"Bone")
        bonetoattachto.attach(b)
        // gltf.scene.children[0].children[k].children[0].updateMatrixWorld()
        this.boxes.push(b);
 }
}

this.scene.add( gltf.scene );

this.mixer = new THREE.AnimationMixer(gltf.scene.children[0].children[0]);
console.log(this.scene)
this.startAnimation(gltf.scene.children[0].children[0],tempanimations,"LowerLeftArmBone_raise")
this.animate();

  }
  startAnimation=(skinnedMesh, animations, animationName)=> {
   
 
    var clip = THREE.AnimationClip.findByName(animations, animationName);
    
    if (clip) {
      var action = this.mixer.clipAction(clip);
      action.setLoop( THREE.LoopPingPong)
      action.repetitions=50
       action.clampWhenFinished = false
  action.enable = true
      action.play();
    }
   
    
   
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
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    light.position.set(0, 1, 0);
    this.scene.add(light);
    this.mount.appendChild( this.renderer.domElement );
    this.material = new THREE.MeshBasicMaterial( {  
     transparent:true,
 
     });
    this.mesh = new THREE.Mesh(new THREE.PlaneGeometry( 2, 1), this.material );
     this.mesh.position.z=2
    this.scene.add(this.mesh)
    // console.log("OG MESH",this.mesh)
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

