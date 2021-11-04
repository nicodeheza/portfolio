import { useEffect, useRef } from "react";
import * as THREE from "three";
// import * as CANNON from "cannon-es";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
// import cannonDebugger from "cannon-es-debugger";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
import styles from "./threeBk.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeBk(){
    const sceneContainer= useRef(null);
    const reqAnimFrame= useRef(null);
    const workerRef= useRef();

    useEffect(()=>{
        const timeStep= 1 / 60;
        let numOfShapes;
        const shapes= [];
        let positions;
        let quaternions;

        workerRef.current= new Worker(new URL("../../workers/physics.js", import.meta.url));
        // Time when we sent last message
        let sendTime;
        // Send the array buffers that will be populated in the
        // worker with cannon.js' data
        function requestDataFromWorker(){
            sendTime= performance.now();
            workerRef.current.postMessage(
                {
                    type: "update", 
                    timeStep,
                    positions,
                    quaternions
                },
                [positions.buffer, quaternions.buffer]
            );
        }
        
        workerRef.current.onmessage= (e)=>{
            if(e.data.type === "forms"){
                const forms= e.data.forms;
                numOfShapes = forms.length;
                positions= new Float32Array(numOfShapes * 3);
                quaternions= new Float32Array(numOfShapes * 4);

                const geometry ={
                                sphere: new THREE.SphereBufferGeometry(0.25, 32, 16),
                                cone: new THREE.ConeGeometry(0.25, 0.5, 36),
                                cylinder: new THREE.CylinderGeometry(0.10, 0.10, 0.5, 25)
                                };

                const material= [new THREE.MeshStandardMaterial({color: "#a55369", roughness:0.4}),
                                new THREE.MeshStandardMaterial({color:  "#005bb1", roughness:0.4}),
                                new THREE.MeshStandardMaterial({color: "#5db100", roughness:0.4}),];

                forms.forEach((form, i)=>{
                    const geo= geometry[form];
                    createParticle(material[ i % material.length],geo);
                });

                renderBoundaries(e.data.boundariesData);
                requestDataFromWorker();

            }else{
                // The mutated position and quaternion data we
                // get back from the worker
                positions= e.data.positions;
                quaternions= e.data.quaternions;

                // Update the three.js meshes
                for(let i=0; i<shapes.length; i++){
                    const p= shapes[i];
                    p.particle.position.set(positions[i * 3 + 0], positions[i * 3 + 1], positions[i * 3 + 2]);
                    p.particle.quaternion.set(
                        quaternions[i * 4 + 0],
                        quaternions[i * 4 + 1],
                        quaternions[i * 4 + 2],
                        quaternions[i * 4 + 3]
                    );
                    p.transparent.position.set(p.particle.position.x + p.offset[0],
                    p.particle.position.y + p.offset[1],
                    p.particle.position.z + p.offset[2]);
                    p.transparent.quaternion.set(
                        quaternions[i * 4 + 0],
                        quaternions[i * 4 + 1],
                        quaternions[i * 4 + 2],
                        quaternions[i * 4 + 3]
                    );
                    p.outline.position.copy(p.transparent.position);
                    p.outline.quaternion.set(
                        quaternions[i * 4 + 0],
                        quaternions[i * 4 + 1],
                        quaternions[i * 4 + 2],
                        quaternions[i * 4 + 3]
                    );
                }

                // Delay the next step by the amount of timeStep remaining,
                // otherwise run it immediatly
                const delay= timeStep * 1000  - (performance.now() - sendTime);
                setTimeout(requestDataFromWorker, Math.max(delay, 0));
            }
        }

        workerRef.current.addEventListener('error', (event) => {
            console.error(event.message)
        });

        //three 
        const dev= true;
        const aspectRatio= window.innerWidth / window.innerHeight;
        const scene= new THREE.Scene();
        const camera= new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        const renderer= new THREE.WebGLRenderer({alpha:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        sceneContainer.current.appendChild(renderer.domElement);

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
        });


        /*
        blender to cannon esc x2:
        dimensions= (x,z,y);
        position=((x*2), (z*2), (y*2)*-1);
        */


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


        //raycaster
        const raycaster= new THREE.Raycaster();
        const mouse= new THREE.Vector2();
        function onMouseMove( event ) {

            // calculate mouse position in normalized device coordinates
            // (-1 to +1) for both components
        
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        }
          
        function animate(){
            reqAnimFrame.current= requestAnimationFrame(animate);
            if(dev){
                controls.update();
            }

            //raycaster
            // update the picking ray with the camera and mouse position
	        raycaster.setFromCamera( mouse, camera );
            // calculate objects intersecting the picking ray
	        const intersects = raycaster.intersectObjects( scene.children );
            //console.log(intersects);

	        for ( let i = 0; i < intersects.length; i ++ ) {
                if(intersects[i].object.name === "p"){
                   // console.log(intersects[i]);
                    workerRef.current.postMessage({
                        type:"intersect", 
                        x: intersects[i].point.x,
                        y: intersects[i].point.y, 
                        z: intersects[i].point.z
                    });
                }
		        //intersects[ i ].object.material.color.set( 0xff0000 );
	        }

            renderer.render(scene, camera);
        }
        animate();

        function degToRad(deg){
            return deg * (Math.PI / 180 );
        }


        const transparentMaterial= new THREE.MeshBasicMaterial({color:"#fff", transparent: true, opacity: 0});
        const outlineMaterial= new THREE.MeshBasicMaterial({color:"#000", side: THREE.BackSide, transparent: true});
        function createParticle(material, geometry){
            const particle= new THREE.Mesh(geometry, material);
            particle.name= "p";
            const transparent= new THREE.Mesh(geometry, transparentMaterial);
            const offset=[];
            for(let i=0; i<3; i++){
                if(Math.round(Math.random()) === 0){
                    offset.push( -0.02);
                }else{
                    offset.push(0.02);
                }
            }
            const outline= new THREE.Mesh(geometry, outlineMaterial);
            outline.renderOrder=1;
            outline.scale.multiplyScalar(1.15);

            shapes.push({particle, outline, offset, transparent});
            scene.add(particle);
            scene.add(outline);
            scene.add(transparent);
        }

        function renderBoundaries(boundariesData){
            const material= new THREE.MeshBasicMaterial({color:"green", wireframe: true});
            const planeGeometry= new THREE.PlaneGeometry(10,10);
            boundariesData.forEach(data=>{
                const {rotation, position}= data;
                const planeMesh= new  THREE.Mesh(planeGeometry, material);
                planeMesh.position.set(position.x, position.y, position.z);
                planeMesh.rotation.set(rotation.x, rotation.y, rotation.z);

                scene.add(planeMesh);
            });
        }

        window.addEventListener('mousemove', onMouseMove, false );
        return ()=>{
            cancelAnimationFrame(reqAnimFrame.current);
            workerRef.current.terminate();
            window.removeEventListener('mousemove', onMouseMove, false );
        };
    },[]);


    return(
        <div ref={sceneContainer} className={styles.three}>
        </div>
    )
}