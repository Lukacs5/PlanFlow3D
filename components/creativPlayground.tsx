import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const CreativPlayground: React.FC = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  let interactableObjects: THREE.Mesh[] = [];
  const addCube = () => {
    if (!sceneRef.current) return;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    sceneRef.current.add(cube);

    interactableObjects.push(cube);
    console.log("After pushing", interactableObjects);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newRenderer = new THREE.WebGLRenderer();
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const yourDiv = divRef.current;
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      //const scene = new THREE.Scene();

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let setIsMouseDown = false;
      let selectedObject = null;

      function onMouseDown(event: MouseEvent) {
        return (setIsMouseDown = true);
      }
      function onMouseUp(event: MouseEvent) {
        return (setIsMouseDown = false);
      }

      function onMouseMove(event: MouseEvent) {
        if (!divRef.current) return;
        // Az egér pozíciójának normalizálása, hogy az értékek -1 és 1 között legyenek
        const rect = divRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
      }
      setRenderer(newRenderer);

      const updateRendererSize = () => {
        const newWidth = yourDiv?.clientWidth || 100;
        const newHeight = yourDiv?.clientHeight || 100;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        newRenderer.setSize(newWidth, newHeight);
      };

      newRenderer.setSize(
        yourDiv?.clientWidth || 5,
        yourDiv?.clientHeight || 5
      );
      yourDiv?.appendChild(newRenderer.domElement);

      window.addEventListener("resize", updateRendererSize);
      window.addEventListener("mousemove", onMouseMove, false);

      updateRendererSize();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(200, 500, 300);
      scene.add(directionalLight);

      const lShape = new THREE.Group();

      const wall1 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.2, 1),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );
      wall1.position.set(2, 0.1, 1);
      lShape.add(wall1);

      const wall2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 0.2, 2),
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );
      wall2.position.set(2.5, 0.1, 0);
      lShape.add(wall2);

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 0.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );
      const cabin2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 3.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );

      const cabin3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.3, 2.3),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
      );

      const wall1Geometry = new THREE.BoxGeometry(2, 0.2, 1);
      wall1Geometry.translate(2, 0.1, 1);

      const wall2Geometry = new THREE.BoxGeometry(1, 0.2, 2);
      wall2Geometry.translate(2.5, 0.1, 0);

      const mergedGeometry = BufferGeometryUtils.mergeGeometries([
        wall1Geometry,
        wall2Geometry,
      ]);

      const lShape2 = new THREE.Mesh(
        mergedGeometry,
        new THREE.MeshLambertMaterial({ color: 0x888888 })
      );

      //scene.add(lShape);
      scene.add(lShape2);
      scene.add(cabin);
      scene.add(cabin2);
      scene.add(cabin3);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      //scene.add(cube);

      // Méretkotta vonalának létrehozása
      const points = [
        new THREE.Vector3(2.5, 2, 0),
        new THREE.Vector3(2.5, 0, 0),
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      //scene.add(line);

      // Méretkotta szövegének létrehozása
      const loader = new FontLoader();
      loader.load(
        "fonts/helvetiker_regular.typeface.json",
        function (font) {
          const textGeometry = new TextGeometry("1 unit", {
            font: font,
            size: 0.1,
            height: 0.01,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.set(0.8, -0.2, 0);
          scene.add(textMesh);
        },
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (err) {
          console.log("An error happened");
        }
      );

      cabin.position.x += 1;

      const controls = new OrbitControls(camera, newRenderer.domElement);
      const transformControls = new TransformControls(
        camera,
        newRenderer.domElement
      );
      scene.add(transformControls);
      //transformControls.attach(cabin);
      //transformControls.attach(lShape);

      transformControls.addEventListener("dragging-changed", function (event) {
        controls.enabled = !event.value;
      });

      camera.position.set(2, 0, 5);

      window.addEventListener("mousedown", onMouseDown, false);
      window.addEventListener("mouseup", onMouseUp, false);
      const animate = () => {
        requestAnimationFrame(animate);

        newRenderer.render(scene, camera);

        /*
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length >= 0) {
          const objectUnderMouse = intersects[0].object;
          console.log(objectUnderMouse);
          transformControls.attach(cabin);
         
        }*/

        interactableObjects.push(cabin);
        interactableObjects.push(lShape2);
        interactableObjects.push(cabin2);
        interactableObjects.push(cabin3);
        //interactableObjects.push(cube);
        //  [cabin, lShape2, cabin2, cabin3]; // és bármely más objektum, amelyet hozzáadott a jelenethez

        // ...
        // Szűrd ki a csak mesh objektumokat a scene.children listából
        const meshObjects = scene.children.filter(
          (child) => child instanceof THREE.Mesh
        );

        // Most a meshObjects tömb tartalmazza csak a mesh objektumokat
        

        const intersects = raycaster.intersectObjects(meshObjects);
        if (intersects.length > 0 && setIsMouseDown) {
          const objectUnderMouse = intersects[0].object;
          console.log(objectUnderMouse);
          transformControls.attach(objectUnderMouse);
          selectedObject = objectUnderMouse;
          //console.log(interactableObjects)
         // console.log(scene.children);
          console.log(meshObjects);
        }
      };

      animate();
    }
  }, []);

  return (
    <div ref={divRef} style={{ width: "100%", height: "100vh" }}>
      {/* A Three.js jelenet itt jelenik meg */}
      <button onClick={addCube}>kocka++</button>
    </div>
  );
};

export default CreativPlayground;
