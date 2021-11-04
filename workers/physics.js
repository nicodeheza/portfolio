import * as CANNON from "cannon-es";
import {MathUtils} from "three"
import Body from "../public/body2.json";

const shapes= [];
const forms=[];

//word
const world= new CANNON.World({gravity:new CANNON.Vec3(0,0,0)});

//add boundaries
const boundariesData=[
    {
        rotation:{x:degToRad(-90), y:0, z:0},
        position:{x:0, y:-4, z:0}
    },
    {
        rotation:{x:0, y:0, z:0},
        position:{x:0, y:0, z:-5}
    },
    {
        rotation:{x:degToRad(180), y:0, z:0},
        position:{x:0, y:0, z:5}
    },
    {
        rotation:{x:degToRad(90), y:0, z:0},
        position:{x:0, y:3.5, z:0}
    },
    {
        rotation:{x:0, y:degToRad(90), z:0},
        position:{x:-4, y:0, z:0}
    },
    {
        rotation:{x:0, y:degToRad(-90), z:0},
        position:{x:4, y:0, z:0}
    }
            
];
const plane= new CANNON.Plane();
boundariesData.forEach(data=>{
    const boundaries= new CANNON.Body({mass:0, shape: plane});
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

// add shapes
const shape= [
    {type:"sphere", geometry: new CANNON.Sphere(0.25)},
    {type:"cone", geometry: new CANNON.Cylinder(0, 0.25, 0.5, 36)}, 
    {type:"cylinder", geometry: new CANNON.Cylinder(0.10, 0.10, 0.5, 25)}
]; 
for(let i=0; i< 35; i++){
    createParticle(shape[Math.floor(Math.random() * 3)], );
}
postMessage({
    type: "forms", 
    boundariesData,
    forms
});

//add mouse body
const mouseBody= new CANNON.Body({
    mass: 10, 
    shape: new CANNON.Sphere(0.2)
});
mouseBody.sleep();
world.addBody(mouseBody);

  
addEventListener("message", (e)=>{
    if(e.data.type === "update"){
        const {positions, quaternions, timeStep}= e.data;
    
        world.step(timeStep);
        const maxSpeed= 0.5;
        world.bodies.forEach(body=>{
            //velocity
            if(body.velocity.x > maxSpeed){
                body.velocity.x = maxSpeed;
            }
            if(body.velocity.y > maxSpeed){
                body.velocity.y = maxSpeed;
            }
            if(body.velocity.z > maxSpeed){
                body.velocity.z = maxSpeed;
            }
    
            if(body.velocity.x < maxSpeed * -1){
                body.velocity.x = maxSpeed * -1;
            }
            if(body.velocity.y < maxSpeed * -1){
                body.velocity.y = maxSpeed * -1;
            }
            if(body.velocity.z < maxSpeed * -1){
                body.velocity.z = maxSpeed  *-1;
            }
            //angular velocity
            if(body.angularVelocity.x > maxSpeed){
                body.angularVelocity.x = maxSpeed;
            }
            if(body.angularVelocity.y > maxSpeed){
                body.angularVelocity.y = maxSpeed;
            }
            if(body.angularVelocity.z > maxSpeed){
                body.angularVelocity.z = maxSpeed;
            }
    
            if(body.angularVelocity.x < maxSpeed * -1){
                body.angularVelocity.x = maxSpeed * -1;
            }
            if(body.angularVelocity.y < maxSpeed * -1){
                body.angularVelocity.y = maxSpeed * -1;
            }
            if(body.angularVelocity.z < maxSpeed * -1){
                body.angularVelocity.z = maxSpeed  * -1;
            }

        });
    
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

        if(mouseBody.sleepState === 0){
            mouseBody.sleep();
        }
    }else {
        const {x,y,z} = e.data;
        //console.log(x);
        mouseBody.wakeUp();
        mouseBody.position.set(x,y,z);
    }
});

function createParticle(shape){
    function getRandomPos(num){
        return {
            x:MathUtils.randFloatSpread(num),
            y:MathUtils.randFloatSpread(num),
            z:MathUtils.randFloatSpread(num)
        } 
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

   forms.push(shape.type);

    const body= new CANNON.Body({
        mass:0.5, 
        shape: shape.geometry 
    });
    const num= 7;
    let pos= getRandomPos(num);
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

