import { useEffect, useRef } from "react";
import {Scene, PerspectiveCamera, WebGLRenderer, TorusGeometry, MeshBasicMaterial, Mesh, GridHelper, AmbientLight} from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/dist/ScrollTrigger";
import styles from "./threeBk.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ThreeBk(){
    const sceneContainer= useRef(null);
    const reqAnimFrame= useRef(null);

    useEffect(()=>{
        const scene= new Scene();
        const camera= new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer= new WebGLRenderer({alpha:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        sceneContainer.current.appendChild(renderer.domElement);

        const loader= new GLTFLoader();
        loader.load('block02.glb', gltf=>{
            gltf.scene.scale.set(2,2,2);
            scene.add(gltf.scene);
        });

        const ambientLight= new AmbientLight("#fff");
        scene.add(ambientLight);

        ScrollTrigger.defaults({ 
            scrub: true, 
            snap: true,
            markers: true, 
           onUpdate:()=>{
             camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);
             camera.rotation.set(animateProps.rotX, animateProps.rotY, animateProps.rotZ);
             console.log(animateProps);
         }
        });

        const animateProps={posX: 2.08,
                             posY:-0.12,
                             posZ:4.2,
                             rotX:0, 
                             rotY:0,
                             rotZ:0
                             };
       camera.position.set(animateProps.posX, animateProps.posY, animateProps.posZ);

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
            posX:1.5
        })
        .to(animateProps,{
            duration: 0.5,
            posZ:-2,
            posY:0
        })
        .to(animateProps,{
            duration: 0.5,
            posZ:-3,
            posY:-1.3,
            posX:1.6
        })
        .to(animateProps,{
            duration: 0.8,
            posZ:-6.20,
            posY:-0.15,
            posX:0.30
        })
        .addLabel("first-rot",0.7)
        .to(animateProps,{
            duration:1,
            rotY: Math.PI
        }, "first-rot");

        const tl2= gsap.timeline();
        ScrollTrigger.create({
            trigger: "#t2",  
           animation: tl2
        });
        tl2
        .to(animateProps, {
            duration:0.5, 
            posZ: -10
        })
        .to(animateProps, {
            duration:0.5, 
            rotX: degToRad(-90),
            posY: -10,
            posZ: 0
        })
        .to(animateProps, {
            duration:0.5, 
            rotZ: degToRad(180)
        })
        .to(animateProps, {
            duration:0.5, 
            posY:-5.4, 
            posZ:1.3,
            posX:0
        })

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
            rotY: degToRad(270)
        })
        .to(animateProps, {
            posX:0,
            posY: 10,
            rotY: degToRad(360)
        })
        .to(animateProps, {
            posY: -0.12,
            posZ:-6.20,
            posX:0.15,
            rotX: degToRad(-180)
        })

        const tl4= gsap.timeline();
        ScrollTrigger.create({
            trigger: "#t4",  
           animation: tl4
        });
        tl4
        .to(animateProps,{
            posZ:-4, //adelante
            posY: -1.05, //abajo
            posX:1.2
        })
        .to(animateProps,{
            posZ:-2,
        })
        .to(animateProps,{
            rotX:degToRad(-90),
            posZ: 0
        })
        .to(animateProps,{
            posY:-2.5,
            posX:0.9,
            posZ:0.1
        })
        .to(animateProps,{ 
            rotY: degToRad(180),
            posY:-3,
        })
        .to(animateProps,{ 
            posY:-5.4,
            posZ:1.3,
            posX:0.05
        });

        const tl5= gsap.timeline();
        ScrollTrigger.create({
            trigger: "#t5",  
           animation: tl5
        });
        tl5
        .to(animateProps,{
            posY:-3,
            posZ:3,
            posX:1
        })
        .to(animateProps,{
            posY:1,
            posZ:2.65,
            posX:1.8,
            rotY: degToRad(90)
        })
        .to(animateProps,{
            posY:3,
            rotY: degToRad(0)
        })
        .to(animateProps,{
            rotZ: degToRad(90),
            posY:5.3,
            posX: 0.6,
            posZ:1.3
        })

        const tl6= gsap.timeline();
        ScrollTrigger.create({
            trigger: "#t6",  
           animation: tl6
        });

        tl6
        .to(animateProps, {
            rotZ: degToRad(-90),
            posY:6
        })
        .to(animateProps, {
            rotY: degToRad(-90),
            posX:-7,
            posY:0,
            posZ:0
        })
        .to(animateProps, {
            posX:-4.65,
            posY:-0.5,
            posZ:0.3
        })
        


        function animate(){
            reqAnimFrame.current= requestAnimationFrame(animate);

            renderer.render(scene, camera);
        }
        animate(); 

        function degToRad(deg){
            return deg * (Math.PI / 180 );
        }

        return ()=> cancelAnimationFrame(reqAnimFrame.current);
    },[]);
    

    return(
        <div ref={sceneContainer} className={styles.three}>
        </div>
    )
}