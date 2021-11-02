import * as CANNON from "cannon-es";
import {MathUtils} from "three"
import Body from "../public/body2.json";

const shapes= [];
const forms=[];

//word
const world= new CANNON.World({gravity:new CANNON.Vec3(0,0,0)});

//add boundaries
const bDist= 5;
const boundariesData=[
    {
        rotation:{x:degToRad(-90), y:0, z:0},
        position:{x:0, y:-bDist, z:0}
    },
    {
                rotation:{x:0, y:0, z:0},
                position:{x:0, y:0, z:-bDist}
    },
    {
        rotation:{x:degToRad(180), y:0, z:0},
        position:{x:0, y:0, z:bDist}
    },
    {
        rotation:{x:degToRad(90), y:0, z:0},
        position:{x:0, y:bDist, z:0}
    },
    {
        rotation:{x:0, y:degToRad(90), z:0},
        position:{x:-bDist, y:0, z:0}
    },
    {
        rotation:{x:0, y:degToRad(-90), z:0},
        position:{x:bDist, y:0, z:0}
    }
            
];
boundariesData.forEach(data=>{
    const boundaries= new CANNON.Body({mass:0, shape: new CANNON.Plane()});
    boundaries.quaternion.setFromEuler(data.rotation.x, data.rotation.y, data.rotation.z);
    boundaries.position.set(data.position.x, data.position.y, data.position.z);
    world.addBody(boundaries);
});

//add block
Body.boxes.forEach(box=>{
    const boxBody= new CANNON.Body({
        mass:0, 
        shape: new CANNON.Box(new CANNON.Vec3(box.dimensions.x, box.dimensions.y, box.dimensions.z))
    });
    boxBody.position.set(box.location.x, box.location.y, box.location.z);
    world.addBody(boxBody);
});
//bodyMeshLoaded= true;

// add shapes
const shape= ["sphere", "cylinder", "cone"];
for(let i=0; i< 15; i++){
    createParticle(shape[Math.floor( Math.random() * 3)]);
}
postMessage({
    type: "forms", 
    forms
});
//shapeLoaded= true;


    

addEventListener("message", (e)=>{
    const {positions, quaternions, timeStep}= e.data;

    world.step(timeStep);

    // Copy the cannon.js data into the buffers
    for( let i=0; i< shapes.length; i++){
        const shape= shapes[i];

        positions[i * 3 + 0]= shape.position.x;
        positions[i * 3 + 1]= shape.position.y;
        positions[i * 3 + 2]= shape.position.z;
        quaternions[i * 4 + 0]= shape.quaternion.x;
        quaternions[i * 4 + 1]= shape.quaternion.y;
        quaternions[i * 4 + 2]= shape.quaternion.z;
        quaternions[i * 4 + 3]= shape.quaternion.w;
    }
    postMessage({
        type:"pos-qua", 
        positions, 
        quaternions
    }, 
    [positions.buffer, quaternions.buffer]);
});


function createParticle(shape){
    function getRandomPos(num){
        return {
            x:MathUtils.randFloatSpread(num),
            y:MathUtils.randFloatSpread(num),
            z:MathUtils.randFloatSpread(num)
        } 
    }
    function getDist(x1, x2, y1, y2, z1, z2){
        const powDisX= Math.pow((x1 - x2), 2);
        const powDisY= Math.pow((y1 - y2), 2);
        const powDisZ= Math.pow((z1 - z2), 2);
        return Math.sqrt((powDisX + powDisY + powDisZ));
    }
   function randomAng(){
       const n= Math.floor(Math.random() * 361);
       if(Math.random() < 0.5){
           return n *-1; 
       }else{
           return n;
       }
   }
   function randomNum(min, max ){
       return Math.random() * (max - min) + min;
   }

   forms.push(shape);

    const body= new CANNON.Body({
        mass:0.5, 
        shape: shape === "sphere" ? 
        new CANNON.Sphere(0.25) :
        shape === "cone" ? 
        new CANNON.Cylinder(0, 0.25, 0.5, 36) :
        new CANNON.Cylinder(0.10, 0.10, 0.5, 25)  
    });
    const num= 7;
    let pos= getRandomPos(num);
    const minDist= 1.5;
    for(let i=0; i< world.bodies.length; i++){
        const b= world.bodies[i];
        //console.log(b);
        const dist= getDist(pos.x, b.position.x, pos.y, b.position.y, pos.z, b.position.z);
        //console.log(dist)
        if(dist < minDist){
            console.log("recal");
            pos= getRandomPos(num);
            i=0;
        }
    }
    body.position.set(pos.x, pos.y, pos.z);
    //console.log(body);
    body.quaternion.setFromEuler(randomAng(), randomAng(), randomAng());
    //body.applyForce(new CANNON.Vec3(randomNum(-0.7, 0.8),randomNum(-0.7, 0.8),randomNum(-0.7, 0.8)), new CANNON.Vec3(0,0,0));
    //body.applyImpulse(new CANNON.Vec3(randomNum(-0.1, 0.2),randomNum(-0.1, 0.2),randomNum(-0.1, 0.2)), new CANNON.Vec3(0,0,0));
    body.applyLocalImpulse(new CANNON.Vec3(randomNum(-0.1, 0.2),randomNum(-0.1, 0.2),randomNum(-0.1, 0.2)), new CANNON.Vec3(0,0,0));
    body.linearDamping= 0;
    body.angularDamping= 0;
    world.addBody(body);
    shapes.push(body);
}

function degToRad(deg){
    return deg * (Math.PI / 180 );
}

