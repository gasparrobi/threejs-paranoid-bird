import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import anime from "animejs/lib/anime.es";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#e0dacd");

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight("#ffffff", 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 1, 10, 2);
pointLight.castShadow = true;
pointLight.shadow.mapSize.x = 1024;
pointLight.shadow.mapSize.y = 1024;
pointLight.shadow.camera.far = 22;
scene.add(pointLight);

// const pointLighthelper = new THREE.CameraHelper(pointLight.shadow.camera);
// scene.add(pointLighthelper);

pointLight.position.set(2.68, 4, 1.94);

gui.add(pointLight, "intensity", 0, 2, 0.01);
gui.add(pointLight.position, "x", 0, 4, 0.01);
gui.add(pointLight.position, "y", 0, 4, 0.01);
gui.add(pointLight.position, "z", 0, 4, 0.01);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

const eyeMaterial = new THREE.MeshStandardMaterial({
  color: "black"
});
eyeMaterial.roughness = 0.4;

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: "#ff7070"
});

const noseMaterial = new THREE.MeshStandardMaterial({
  // color: "#e6ba39"
  color: "#edb100"
});

const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.75, 2, 32, 3);

const getBird = () => {
  return {
    body: new THREE.Mesh(bodyGeometry, bodyMaterial),
    nose: new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.12, 0.24, 0.05),
      noseMaterial
    ),
    cube: new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.75, 0.75, 0.05),
      material
    ),
    eyeBall: new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.15, 0.15, 0.15),
      eyeMaterial
    ),
    cube2: new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.75, 0.75, 0.05),
      material
    ),
    eyeBall2: new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.15, 0.15, 0.15),
      eyeMaterial
    ),
    eye: new THREE.Group(),
    eye2: new THREE.Group(),
    face: new THREE.Group(),
    bird: new THREE.Group()
  };
};

const setupBird = (bird) => {
  bird.body.position.y = 0;
  bird.body.position.z = 0;

  bird.nose.position.z = 0.7;
  bird.nose.position.y = -0.55;

  bird.eye.add(bird.cube);
  bird.eye.add(bird.eyeBall);
  bird.eye.position.z = 0.6;

  bird.eye2.add(bird.cube2);
  bird.eye2.add(bird.eyeBall2);
  bird.eye2.position.z = 0.6;

  bird.eye.position.x = -0.33;
  bird.eye.rotation.y = -Math.PI / 4;
  bird.eye2.position.x = 0.33;
  bird.eye2.rotation.y = Math.PI / 4;

  bird.face.add(bird.eye);
  bird.face.add(bird.eye2);
  bird.face.add(bird.nose);
  bird.face.position.y = 0.3;

  bird.bird.add(bird.face);
  bird.bird.add(bird.body);

  bird.bird.rotation.set(0, 0, 0);

  bird.eye.castShadow = true;
  bird.face.castShadow = true;
  bird.eye.receiveShadow = true;
  bird.face.receiveShadow = true;

  bird.cube.castShadow = true;
  bird.cube2.castShadow = true;
  bird.cube.receiveShadow = true;
  bird.cube2.receiveShadow = true;
  bird.eyeBall.castShadow = true;
  bird.eyeBall2.castShadow = true;
  bird.body.receiveShadow = true;
  bird.body.castShadow = true;
  bird.nose.receiveShadow = true;
  bird.nose.castShadow = true;
};

const bird1 = getBird();
const bird2 = getBird();

setupBird(bird1);
setupBird(bird2);

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(7, 5),
  new THREE.ShadowMaterial({
    opacity: 0.2
  })
);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true;

bird1.bird.position.set(0, 0.48, 0);

bird2.bird.position.set(2.5, 0.48, 0);
bird2.bird.rotation.y = -0.9;
bird2.bird.scale.set(0.8, 0.8, 0.8);
bird2.bird.translateY(-0.2);

scene.add(plane, bird1.bird, bird2.bird);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  widthHalf: window.innerWidth / 2,
  heightHalf: window.innerHeight / 2
};

const mousePos = { x: 0, y: 0 };

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.widthHalf = window.innerWidth / 2;
  sizes.heightHalf = window.innerHeight / 2;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const onMouseMove = (event) => {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
};

const onTouchStart = (event) => {
  if (event.touches.length > 1) {
    event.preventDefault();
    mousePos.x = event.touches[0].pageX;
    mousePos.y = event.touches[0].pageY;
  }
};

const onTouchEnd = () => {
  mousePos.x = sizes.windowHalfX;
  mousePos.y = sizes.windowHalfY;
};

const onTouchMove = (event) => {
  if (event.touches.length === 1) {
    event.preventDefault();
    mousePos.x = event.touches[0].pageX;
    mousePos.y = event.touches[0].pageY;
  }
};

document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("touchstart", onTouchStart, false);
document.addEventListener("touchend", onTouchEnd, false);
document.addEventListener("touchmove", onTouchMove, false);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 2;
camera.position.z = 7;
scene.add(camera);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

let bird2AnimationInProgress = false;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const horizontalPosition = (mousePos.x - sizes.widthHalf) / 250;
  const verticalPosition = (mousePos.y - sizes.heightHalf) / 250;
  const angleHorizontal = Math.min(
    Math.max(horizontalPosition, -Math.PI / 3),
    Math.PI / 3
  );
  const angleVertical = Math.min(
    Math.max(verticalPosition, -Math.PI / 3),
    Math.PI / 3
  );

  bird1.eyeBall.position.y = 0 - angleVertical * 0.2;
  bird1.eyeBall.position.x = 0 + angleHorizontal * 0.2;
  bird1.nose.position.y = -0.55 - angleVertical * 0.05;

  bird1.eye.position.y = -angleVertical * 0.1;
  bird1.eye2.position.y = -angleVertical * 0.1;
  // eye.position.z = 0.6 + Math.abs(angleVertical) * 0.03;
  // eye2.position.z = 0.6 + Math.abs(angleVertical) * 0.03;

  // eyeBrowLeft.position.y = 0.5 - angleVertical * 0.1;
  // eyeBrowRight.position.y = 0.5 - angleVertical * 0.1;

  bird1.bird.rotation.y = angleHorizontal;

  bird1.eyeBall2.position.y = 0 - angleVertical * 0.2;
  bird1.eyeBall2.position.x = 0 + angleHorizontal * 0.2;

  if (angleHorizontal > 0.8 && !bird2AnimationInProgress) {
    anime.running.length = 0;
    anime({
      targets: bird2.bird.rotation,
      y: 0.3,
      duration: 300,
      delay: 100,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall.position,
      y: -0.2,
      duration: 300,
      delay: 100,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall.position,
      x: 0.2,
      duration: 300,
      delay: 100,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall2.position,
      y: -0.2,
      duration: 300,
      delay: 100,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall2.position,
      x: 0.2,
      duration: 300,
      delay: 100,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    bird2AnimationInProgress = true;
  } else if (angleHorizontal < 0.8 && bird2AnimationInProgress) {
    anime({
      targets: bird2.bird.rotation,
      y: -0.9,
      duration: 1500,
      delay: 500,
      easing: "cubicBezier(1,.01,.46,.83)"
    });
    anime({
      targets: bird2.eyeBall.position,
      y: 0.1,
      duration: 1500,
      delay: 1000,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall.position,
      x: -0.1,
      duration: 1500,
      delay: 1000,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall2.position,
      y: 0.1,
      duration: 1500,
      delay: 1000,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    anime({
      targets: bird2.eyeBall2.position,
      x: -0.1,
      duration: 1500,
      delay: 1000,
      easing: "cubicBezier(0,.03,.61,.99)"
    });
    bird2AnimationInProgress = false;
  }

  // Update controls
  // controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
