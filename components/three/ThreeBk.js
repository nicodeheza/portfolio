import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {mergeVertices} from "three/examples/jsm/utils/BufferGeometryUtils";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry'
import cannonDebugger from "cannon-es-debugger";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
import styles from "./threeBk.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeBk(){
    const sceneContainer= useRef(null);
    const reqAnimFrame= useRef(null);

    useEffect(()=>{
        let modelLoaded= false;
        let bodyMeshLoaded= false;
        let shapeLoaded= false;
        //cannon
        const world= new CANNON.World({gravity:new CANNON.Vec3(0,0,0)});
        //three
        const dev= true;
        const aspectRatio= window.innerWidth / window.innerHeight;
        const particles= [];
        const scene= new THREE.Scene();
        const camera= new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        const renderer= new THREE.WebGLRenderer({alpha:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        sceneContainer.current.appendChild(renderer.domElement);

        cannonDebugger(scene, world.bodies);


        let controls;
        if(dev){
            controls = new OrbitControls( camera, renderer.domElement );
            camera.position.set( 0, 0, 10 );
            controls.update();
        }
        

        const loader= new GLTFLoader();
        loader.load('block02.glb', gltf=>{
            gltf.scene.scale.set(2,2,2);
            scene.add(gltf.scene);
            modelLoaded= true;
        });

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

        
        /*
        blender to cannon esc x2:
        dimensions= (x,z,y);
        position=((x*2), (z*2), (y*2)*-1);
        */
       fetch("body2.json")
       .then(res=> res.json())
       .then(data=>{ 
           //console.log(data);
           data.boxes.forEach(box=>{
               const boxBody= new CANNON.Body({
                    mass:0, 
                    shape: new CANNON.Box(new CANNON.Vec3(box.dimensions.x, box.dimensions.y, box.dimensions.z))
                });
                boxBody.position.set(box.location.x, box.location.y, box.location.z);
                world.addBody(boxBody);
            });
            bodyMeshLoaded= true;

            const colors=["#a55369", "#005bb1", "#5db100"];
            const shape= ["sphere", "cylinder", "cone"];
            for(let i=0; i< 15; i++){
                const newParticle= createParticle(
                    colors[ i % colors.length],
                    shape[Math.floor( Math.random() * 3)]);
                particles.push(newParticle);
                scene.add(newParticle.particle);
                scene.add(newParticle.outline);
                scene.add(newParticle.transparent);
            }
            shapeLoaded= true;
        });

        
        
        if(dev){
            const axes= new THREE.AxesHelper(5);
            scene.add(axes);
        }


        const ambientLight= new THREE.AmbientLight("#fff", 0.2);
        scene.add(ambientLight);
        const lights=[
            {x:5, y:0, z: -1, p:0.5},
            {x:-5, y:0, z: 0, p:0.5},
            {x:0, y:5, z: 0, p:0.5},
            {x:0, y:-6, z: 1, p:0.5},
            {x:0, y:0, z: 5, p:0.5},
            {x:0, y:0, z: -7, p:0.5}
        ]
        lights.forEach(e=>{
            const light= new THREE.PointLight( 0xffffff, e.p*3, 10, 2);
            light.position.set(e.x, e.y, e.z);
            scene.add(light);
            if(dev){
                const lightHelper= new THREE.PointLightHelper(light, 1, "red");
                scene.add(lightHelper);
            }
        });
        

        //console.log(aspectRatio);
        if(!dev){
        if(aspectRatio > 1){
            
            const animateProps={posX: 2.08,
                posY:-0.12,
                posZ:4.2,
                rotX:0, 
                rotY:0,
                rotZ:0
            };
            ScrollTrigger.defaults({ 
                scrub: true, 
                snap: {
                    snapTo:1 , 
                    duration:3,
                    ease:"power1.out"
                },
                markers: true, 
               onUpdate:()=>{
                 camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);
                 camera.rotation.set(animateProps.rotX, animateProps.rotY, animateProps.rotZ);
                 //console.log(animateProps);
             }
            });

           camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);
    
           //home - project 1
           const tl1= gsap.timeline();
           ScrollTrigger.create({
               trigger: "#t1", 
              animation: tl1, 
           });
            tl1
            .to(animateProps, {
                duration: 0.5, 
                posZ: 0.8,
                posY:1.3,
                posX:1.5,
                ease:"none"
            })
            .to(animateProps,{
                duration: 0.5,
                posZ:-2,
                posY:0,
                ease:"none"
            })
            .to(animateProps,{
                duration: 0.5,
                posZ:-3,
                posY:-1.3,
                posX:1.6,
                ease:"none"
            })
            .to(animateProps,{
                duration: 0.8,
                posZ:-6.20,
                posY:-0.15,
                posX:0.30,
                ease:"none"
            })
            .addLabel("first-rot",0.7)
            .to(animateProps,{
                duration:1,
                rotY: Math.PI
            }, "first-rot");
    
            //project 1 - project 2 
            const tl2= gsap.timeline();
            ScrollTrigger.create({
                trigger: "#t2",  
               animation: tl2
            });
            tl2
            .to(animateProps, {
                duration:0.5, 
                posZ: -10,
                ease:"none"
            })
            .to(animateProps, {
                duration:0.5, 
                rotX: degToRad(-90),
                posY: -10,
                posZ: 0,
                ease:"none"
            })
            .to(animateProps, {
                duration:0.5, 
                rotZ: degToRad(180),
                ease:"none"
            })
            .to(animateProps, {
                duration:0.5, 
                posY:-5.4, 
                posZ:1.3,
                posX:0,
                ease:"none"
            })
    
            //project 2 - project 3
            const tl3= gsap.timeline();
            ScrollTrigger.create({
                trigger: "#t3",  
               animation: tl3
            });
            tl3
            .to(animateProps, {
                posX:-7,
                posY: -2,
                posZ: 0,
                rotY: degToRad(270),
                ease:"none"
            })
            .to(animateProps, {
                posX:0,
                posY: 10,
                rotY: degToRad(360),
                ease:"none"
            })
            .to(animateProps, {
                posY: -0.12,
                posZ:-6.20,
                posX:0.15,
                rotX: degToRad(-180),
                ease:"none"
            });
    
            //project 3 - project menu
            const tl4= gsap.timeline();
            ScrollTrigger.create({
                trigger: "#t4",  
               animation: tl4
            });
            tl4
            .to(animateProps,{
                posZ:-4,
                posY: -1.05,
                posX:1.2,
                ease:"none"
            })
            .to(animateProps,{
                posZ:-2,
                ease:"none"
            })
            .to(animateProps,{
                rotX:degToRad(-90),
                posZ: 0,
                ease:"none"
            })
            .to(animateProps,{
                posY:-2.5,
                posX:0.9,
                posZ:0.1,
                ease:"none"
            })
            .to(animateProps,{ 
                rotY: degToRad(180),
                posY:-3,
                ease:"none"
            })
            .to(animateProps,{ 
                posY:-5.4,
                posZ:1.3,
                posX:0.05,
                ease:"none"
            });
    
            //project menu - about
            const tl5= gsap.timeline();
            ScrollTrigger.create({
                trigger: "#t5",  
               animation: tl5
            });
            tl5
            .to(animateProps,{
                posY:-3,
                posZ:3,
                posX:1,
                ease:"none"
            })
            .to(animateProps,{
                posY:1,
                posZ:2.65,
                posX:1.8,
                rotY: degToRad(90),
                ease:"none"
            })
            .to(animateProps,{
                posY:3,
                rotY: degToRad(0),
                ease:"none"
            })
            .to(animateProps,{
                rotZ: degToRad(90),
                posY:5.3,
                posX: 0.6,
                posZ:1.3,
                ease:"none"
            });
    
            //about - contact
            const tl6= gsap.timeline();
            ScrollTrigger.create({
                trigger: "#t6",  
               animation: tl6
            });
    
            tl6
            .to(animateProps, {
                rotZ: degToRad(-90),
                posY:6,
                ease:"none"
            })
            .to(animateProps, {
                rotY: degToRad(-90),
                posX:-7,
                posY:0,
                posZ:0,
                ease:"none"
            })
            .to(animateProps, {
                posX:-4.65,
                posY:-0.5,
                posZ:0.3,
                ease:"none"
            });
        }else{
            const animateProps={posX: 2.35,
                posY:-0.12,
                posZ:4.2,
                rotX:0, 
                rotY:0,
                rotZ:0
                };

            ScrollTrigger.defaults({ 
                scrub: true, 
                snap: {
                    snapTo:1 , 
                    duration:3,
                    ease:"power1.out"
                },
                markers: true, 
               onUpdate:()=>{
                 camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);
                 camera.rotation.set(animateProps.rotX, animateProps.rotY, animateProps.rotZ);
                // console.log(animateProps);
             }
            });

            camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);

            //home - project 1
            const tl1= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t1", 
            animation: tl1, 
            });
            tl1
            .to(animateProps, {
            duration: 0.5, 
            posZ: 0.8,
            posY:1.3,
            posX:1.5,
            ease:"none"
            })
            .to(animateProps,{
            duration: 0.5,
            posZ:-2,
            posY:0,
            ease:"none"
            })
            .to(animateProps,{
            duration: 0.5,
            posZ:-3,
            posY:-1.3,
            posX:1.6,
            ease:"none"
            })
            .to(animateProps,{
            duration: 0.8,
            posZ:-6.20,
            posY:-0.15,
            posX:-0.8,
            ease:"none"
            })
            .addLabel("first-rot",0.7)
            .to(animateProps,{
            duration:1,
            rotY: Math.PI
            }, "first-rot");

            //project 1 - project 2 
            const tl2= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t2",  
            animation: tl2
            });
            tl2
            .to(animateProps, {
            duration:0.5, 
            posZ: -10,
            ease:"none"
            })
            .to(animateProps, {
            duration:0.5, 
            rotX: degToRad(-90),
            posY: -10,
            posZ: 0,
            ease:"none"
            })
            .to(animateProps, {
            duration:0.5, 
            rotZ: degToRad(180),
            ease:"none"
            })
            .to(animateProps, {
            duration:0.5, 
            posY:-5.4, 
            posZ:1.3,
            posX: 1.15,
            ease:"none"
            })

            //project 2 - project 3
            const tl3= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t3",  
            animation: tl3
            });
            tl3
            .to(animateProps, {
            posX:-7,
            posY: -2,
            posZ: 0,
            rotY: degToRad(270),
            ease:"none"
            })
            .to(animateProps, {
            posX:0,
            posY: 10,
            rotY: degToRad(360),
            ease:"none"
            })
            .to(animateProps, {
            posY: -0.12,
            posZ:-6.20,
            posX:-0.8,
            rotX: degToRad(-180),
            ease:"none"
            });

            //project 3 - project menu
            const tl4= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t4",  
            animation: tl4
            });
            tl4
            .to(animateProps,{
            posZ:-4,
            posY: -1.05,
            posX:1.2,
            ease:"none"
            })
            .to(animateProps,{
            posZ:-2,
            ease:"none"
            })
            .to(animateProps,{
            rotX:degToRad(-90),
            posZ: 0,
            ease:"none"
            })
            .to(animateProps,{
            posY:-2.5,
            posX:0.9,
            posZ:0.1,
            ease:"none"
            })
            .to(animateProps,{ 
            rotY: degToRad(180),
            posY:-3,
            ease:"none"
            })
            .to(animateProps,{ 
            posY:-5.4,
            posZ:1.3,
            posX:1.15,
            ease:"none"
            });

            //project menu - about
            const tl5= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t5",  
            animation: tl5
            });
            tl5
            .to(animateProps,{
            posY:-3,
            posZ:3,
            posX:1,
            ease:"none"
            })
            .to(animateProps,{
            posY:1,
            posZ:2.65,
            posX:1.8,
            rotY: degToRad(90),
            ease:"none"
            })
            .to(animateProps,{
            posY:3,
            rotY: degToRad(0),
            ease:"none"
            })
            .to(animateProps,{
            rotZ: degToRad(90),
            posY:5.3,
            posX: 0.6,
            posZ:2.1,
            ease:"none"
            });

            //about - contact
            const tl6= gsap.timeline();
            ScrollTrigger.create({
            trigger: "#t6",  
            animation: tl6
            });

            tl6
            .to(animateProps, {
            rotZ: degToRad(-90),
            posY:6,
            ease:"none"
            })
            .to(animateProps, {
            rotY: degToRad(-90),
            posX:-7,
            posY:0,
            posZ:0,
            ease:"none"
            })
            .to(animateProps, {
            posX:-4.65,
            posY:-0.5,
            posZ:-1.1,
            ease:"none"
            });

        }
        }


        const timeStep= 1 / 60;
        let lastCallTime;
        function animate(){
            reqAnimFrame.current= requestAnimationFrame(animate);

            //cannon
            const time= performance.now();
            if(modelLoaded && bodyMeshLoaded && shapeLoaded){
                //console.log("started");
                if(!lastCallTime){
                    world.step(timeStep);
                }else{
                    const dt= time - lastCallTime;
                    world.step(timeStep, dt);
                }
            }

            particles.forEach(p=>{
                p.particle.position.copy(p.body.position);
                p.particle.quaternion.copy(p.body.quaternion);
                p.transparent.position.set(p.particle.position.x + p.offset[0],
                                           p.particle.position.y + p.offset[1],
                                           p.particle.position.z + p.offset[2]);
                p.transparent.quaternion.copy(p.body.quaternion);
                p.outline.position.copy(p.transparent.position);
                p.outline.quaternion.copy(p.body.quaternion);
            });
            
            if(dev){
                controls.update();
            }
            
            
            renderer.render(scene, camera);
            lastCallTime= time;
        }
        animate(); 

        function degToRad(deg){
            return deg * (Math.PI / 180 );
        }

        function createParticle(color, shape){
            function getRandomPos(num){
                return {
                    x:THREE.MathUtils.randFloatSpread(num),
                    y:THREE.MathUtils.randFloatSpread(num),
                    z:THREE.MathUtils.randFloatSpread(num)
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

            const geometry=shape === "sphere" ? new THREE.SphereBufferGeometry(0.25, 32, 16) :
            shape === "cone" ? new THREE.ConeGeometry(0.25, 0.5, 36) :
            new THREE.CylinderGeometry(0.10, 0.10, 0.5, 25);
            const material= new THREE.MeshStandardMaterial({color: color, roughness:0.4});
            const particle= new THREE.Mesh(geometry, material);
            particle.position.copy(body.position);

            const transparentMaterial= new THREE.MeshBasicMaterial({color:"#fff", transparent: true, opacity: 0});
            const transparent= new THREE.Mesh(geometry, transparentMaterial);
            const offset=[];
            for(let i=0; i<3; i++){
                if(Math.round(Math.random()) === 0){
                    offset.push( -0.02);
                }else{
                    offset.push(0.02);
                }
            }
            transparent.position.set(particle.position.x + offset[0], particle.position.y + offset[1], particle.position.z + offset[2]);

            const outlineMaterial= new THREE.MeshBasicMaterial({color:"#000", side: THREE.BackSide, transparent: true});
            const outline= new THREE.Mesh(geometry, outlineMaterial);
            outline.renderOrder=1;
            outline.position.set(transparent.position.x, transparent.position.y, transparent.position.z );
            outline.scale.multiplyScalar(1.15);

            return {particle, outline, offset, transparent, body};
        }

    

        return ()=> cancelAnimationFrame(reqAnimFrame.current);
    },[]);
    

    return(
        <div ref={sceneContainer} className={styles.three}>
        </div>
    )
}