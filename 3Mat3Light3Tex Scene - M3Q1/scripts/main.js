//import statements
import * as THREE from './three.module.js';
import { OrbitControls } from './OrbitControls.js';

//Scene, camera, renderer, texture, orbitControls setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); //fullscreen
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight ); ///fullscreen
document.body.appendChild( renderer.domElement );
const textureLoader = new THREE.TextureLoader();
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0.01 ,0.01, 0.01);

//floor setup
const floorGeometry = new THREE.PlaneGeometry(40, 50);
const floorTexture = textureLoader.load('/assets/textures/floor.jpg');
const floorMaterial = new THREE.MeshStandardMaterial({ map:floorTexture, side: THREE.DoubleSide });
floorTexture.repeat.set(8,8); 
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);

//ceiling setup
const ceilingGeometry = new THREE.PlaneGeometry(25, 50);
const ceilingMaterial = new THREE.MeshStandardMaterial({ color:0x5A2800, side: THREE.DoubleSide });
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
scene.add(ceiling);

//LIGHTING setup
const lightGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3.7, 32);
const lightMaterial = new THREE.MeshStandardMaterial({ color:0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.2, side: THREE.DoubleSide });
const light = new THREE.Mesh(lightGeometry, lightMaterial);
ceiling.add(light);
const generalLight = new THREE.PointLight(0xFFFFFF, 1.3);     //bigger number, more illumination
generalLight.position.copy(light.position);
scene.add(generalLight);
const smallLight = new THREE.AmbientLight(0x000000, -0.6);    //added as a layer of light within darkness
scene.add(smallLight);
const visionLimit = new THREE.AmbientLight(0xffffff, -0.022); //bigger number, less light range for vision
scene.add(visionLimit);

//setup of walls and things on walls
const wallTexture = textureLoader.load('/assets/textures/walls.jpg');
const wallMaterial = new THREE.MeshLambertMaterial({ map:wallTexture, side: THREE.DoubleSide });
wallTexture.repeat.set(8,1.5); 
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;

const fWallGeometry = new THREE.PlaneGeometry(32, 7);
const fWall = new THREE.Mesh(fWallGeometry, wallMaterial);
scene.add(fWall);

const bWallGeometry = new THREE.PlaneGeometry(32, 7);
const bWall = new THREE.Mesh(bWallGeometry, wallMaterial);
scene.add(bWall);

const lWallGeometry = new THREE.PlaneGeometry(17, 7);
const lWall = new THREE.Mesh(lWallGeometry, wallMaterial);
scene.add(lWall);

const logoGeometry = new THREE.PlaneGeometry(4, 2.5);
const logoTexture = textureLoader.load('assets/textures/logo.png')
const logoMaterial = new THREE.MeshPhongMaterial({ map:logoTexture, side: THREE.DoubleSide, shininess: 500 })
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
lWall.add(logo);

const rWallGeometry = new THREE.PlaneGeometry(17, 7);
const rWall = new THREE.Mesh(rWallGeometry, wallMaterial);
scene.add(rWall);

const doorGeometry = new THREE.PlaneGeometry(2, 5);
const doorTexture = textureLoader.load('assets/textures/door.png')
const doorMaterial = new THREE.MeshPhongMaterial({ map:doorTexture, side: THREE.DoubleSide, shininess: 200 })
const door1 = new THREE.Mesh(doorGeometry, doorMaterial);
rWall.add(door1);
const door2 = new THREE.Mesh(doorGeometry, doorMaterial);
rWall.add(door2);

//entity setup
const entityGeom = new THREE.PlaneGeometry(0.8,1.6);
const entityTex = textureLoader.load('/assets/textures/surprise.png');
const entityMat = new THREE.MeshLambertMaterial({ map:entityTex, side: THREE.DoubleSide, color: 0x2e2e28 });
const entity = new THREE.Mesh(entityGeom, entityMat);
scene.add(entity);
entity.position.set(0,0,10);

//flashlight effect setup
const glintGeom = new THREE.SphereGeometry(0.05, 32, 16);
const glintMat = new THREE.MeshStandardMaterial({color:0xFFFFFF, emissive: 0xFFFFFF, emissiveIntensity: 0.7, side: THREE.DoubleSide});
const glint = new THREE.Mesh(glintGeom, glintMat);
scene.add(glint);
const spotlight = new THREE.SpotLight(0xFFFFFF, 5, 100, Math.PI / 5.5, 2, 1.8); //main flashlight
const spotlightTarget = glint;
scene.add(spotlightTarget);
spotlightTarget.position.set(0, 1, 2);
spotlight.target = spotlightTarget;
glint.add(spotlight);

camera.position.z = 0;

function animate() {
    requestAnimationFrame(animate);

    // floor
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3.3;
    floor.position.z = 6.8;

    //ceiling
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3.6;
    ceiling.position.z = 3.3;
    light.position.z = 0.4;
    light.position.y = -3;

    //front wall
    fWall.position.z = -15.70;

    //back wall
    bWall.position.z = 20.70;

    //flashlight effect
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const distance = 2.15;
    const newPosition = new THREE.Vector3().copy(cameraDirection).multiplyScalar(distance);
    glint.position.copy(newPosition.add(camera.position));

    //flashlight target
    glintMat.transparent = true;
    glintMat.opacity = 0;
    spotlight.position.z = 2;

    //flashlight finalization
    controls.update();
    spotlight.position.copy(camera.position);
    spotlight.target.position.copy(glint.position);

    // left wall
    lWall.position.x = -4.65; 
    lWall.rotation.y = -Math.PI / 2;
    lWall.position.z = 2.2;
    logo.position.z = -0.1;
    logo.rotation.y = Math.PI;

    // right wall
    rWall.position.x = 4.65;
    rWall.rotation.y = -Math.PI / 2; 
    rWall.position.z = 2.2;
    door1.position.z = 0.5;
    door1.position.y = -0.5;
    door1.position.x = 3.2;
    door2.position.z = 0.5;
    door2.position.y = -0.5;
    door2.position.x = -3.2;

    //entity
    entity.position.z -= 0.012;

    //rendering everything
    renderer.render(scene, camera);
}
animate();