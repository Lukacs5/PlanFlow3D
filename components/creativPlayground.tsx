import React, { useEffect, useRef, useState, useCallback } from "react";
import font from "../public/fonts/Roboto-msdf.json";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { signal } from "@preact/signals-react";

let selectedObject;
console.log(selectedObject);

const CreativPlayground: React.FC = () => {
  const fontRoboto = "/fonts/Roboto-msdf.json";
  const divRef = useRef<HTMLDivElement | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [cubeWidth, setCubeWidth] = useState(1); // Alapértelmezett szélesség
  const [cubeHeight, setCubeHeight] = useState(1); // Alapértelmezett magasság
  const sceneRef = useRef<THREE.Scene | null>(null);
  const interactableObjectsRef = useRef<THREE.Object3D[]>([]);
  const selectedObjectRef = useRef<THREE.Object3D | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);

  const [operationMode, setOperationMode] = useState<
    "scale" | "rotate" | "translate"
  >();

  const operationModeRef = useRef(operationMode);
  
  const handleDelete = () => {
    if (selectedObjectRef.current && sceneRef.current) {
      sceneRef.current.remove(selectedObjectRef.current);
      const index = interactableObjectsRef.current.indexOf(
        selectedObjectRef.current
      );
      if (index > -1) {
        interactableObjectsRef.current.splice(index, 1);
      }
      if (transformControlsRef.current) {
        transformControlsRef.current.detach();
      }
      selectedObjectRef.current = null;
    }
  };

  const addCube = useCallback((width: number, height: number) => {
    if (!sceneRef.current) return;
    const geometry = new THREE.BoxGeometry(width, height, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    sceneRef.current.add(cube);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
     
      const newRenderer = new THREE.WebGLRenderer();
      const scene = new THREE.Scene();
      const yourDiv = divRef.current;
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      sceneRef.current = scene;
      operationModeRef.current = operationMode;
      let setIsMouseDown = false;

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

      scene.add(cabin);
      scene.add(cabin2);
      scene.add(cabin3);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      // Méretkotta vonalának létrehozása
      const points = [
        new THREE.Vector3(2.5, 2, 0),
        new THREE.Vector3(2.5, 0, 0),
      ];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
      const line = new THREE.Line(lineGeometry, lineMaterial);

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
      interactableObjectsRef.current.push(cabin);
      interactableObjectsRef.current.push(cabin2);
      interactableObjectsRef.current.push(cabin3);
      //console.log("Operation mode animelött changed to:", operationModeRef.current);
      const animate = () => {
        requestAnimationFrame(animate);
        newRenderer.render(scene, camera);

        const meshObjects = scene.children.filter(
          (child) => child instanceof THREE.Mesh
        );
        const intersects = raycaster.intersectObjects(meshObjects);
        if (intersects.length > 0 && setIsMouseDown) {
          const objectUnderMouse = intersects[0].object;
          // console.log(objectUnderMouse);
          transformControls.attach(objectUnderMouse);
          switch (operationModeRef.current) {
            case "scale":
              transformControls.setMode("scale");
              transformControls.attach(objectUnderMouse);
              break;
            case "rotate":
              transformControls.setMode("rotate");
              transformControls.attach(objectUnderMouse);
              break;
            case "translate":
              transformControls.setMode("translate");
              transformControls.attach(objectUnderMouse);
              break;
            default:
              break;
          }

          selectedObject = objectUnderMouse;

          console.log(operationModeRef.current);
        }
      };

      animate();
    }
  }, [operationMode]);

  return (
    <div ref={divRef} style={{ width: "100%", height: "100vh" }}>
      {/* A Three.js jelenet itt jelenik meg */}
      <div>
        <label>
          Szélesség:
          <input
            className=" text-black"
            type="number"
            value={cubeWidth}
            onChange={(e) => setCubeWidth(Number(e.target.value))}
            step="0.05"
          />
        </label>
        <label>
          Magasság:
          <input
            className=" text-black"
            type="number"
            value={cubeHeight}
            onChange={(e) => setCubeHeight(Number(e.target.value))}
            step="0.05"
          />
        </label>
      </div>
      <button
        className="p-3 hover:bg-blue-700"
        onClick={() => addCube(cubeWidth, cubeHeight)}
      >
        Kocka hozzáadása
      </button>

      <button className="p-3 hover:bg-red-700" onClick={handleDelete}>
        Törlés
      </button>

      <button
        className="p-3 hover:bg-blue-700"
        onClick={() => setOperationMode("scale")}
      >
        Átméretezés
      </button>
      <button
        className="p-3 hover:bg-blue-700"
        onClick={() => setOperationMode("rotate")}
      >
        Forgatás
      </button>
      <button
        className="p-3 hover:bg-blue-700"
        onClick={() => setOperationMode("translate")}
      >
        Mozgatás
      </button>
    </div>
  );
};

export default CreativPlayground;
